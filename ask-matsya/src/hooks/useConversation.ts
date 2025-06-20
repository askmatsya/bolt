'use client';

import { useState, useCallback, useEffect } from 'react';
import { supabase, Message, Conversation } from '@/lib/supabase';

export interface ConversationState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface UseConversationReturn {
  state: ConversationState;
  createConversation: (title: string) => Promise<Conversation | null>;
  selectConversation: (conversationId: string) => Promise<void>;
  addMessage: (content: string, type: 'user' | 'assistant', audioUrl?: string) => Promise<Message | null>;
  loadConversations: () => Promise<void>;
  clearError: () => void;
}

export const useConversation = (): UseConversationReturn => {
  const [state, setState] = useState<ConversationState>({
    conversations: [],
    currentConversation: null,
    messages: [],
    isLoading: false,
    error: null,
  });

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setState(prev => ({
        ...prev,
        conversations: data || [],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load conversations';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
    }
  }, []);

  const createConversation = useCallback(async (title: string): Promise<Conversation | null> => {
    try {
      setState(prev => ({ ...prev, error: null }));

      const { data, error } = await supabase
        .from('conversations')
        .insert({
          title,
          user_id: null, // For now, we'll use anonymous conversations
        })
        .select()
        .single();

      if (error) throw error;

      const newConversation = data as Conversation;
      
      setState(prev => ({
        ...prev,
        conversations: [newConversation, ...prev.conversations],
        currentConversation: newConversation,
        messages: [],
      }));

      return newConversation;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create conversation';
      setState(prev => ({ ...prev, error: errorMessage }));
      return null;
    }
  }, []);

  const selectConversation = useCallback(async (conversationId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Load conversation details
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (convError) throw convError;

      // Load messages for this conversation
      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (msgError) throw msgError;

      setState(prev => ({
        ...prev,
        currentConversation: conversation,
        messages: messages || [],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load conversation';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
    }
  }, []);

  const addMessage = useCallback(async (
    content: string,
    type: 'user' | 'assistant',
    audioUrl?: string
  ): Promise<Message | null> => {
    if (!state.currentConversation) {
      setState(prev => ({ ...prev, error: 'No conversation selected' }));
      return null;
    }

    try {
      setState(prev => ({ ...prev, error: null }));

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: state.currentConversation.id,
          type,
          content,
          audio_url: audioUrl,
        })
        .select()
        .single();

      if (error) throw error;

      const newMessage = data as Message;

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage],
      }));

      // Update conversation's updated_at timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', state.currentConversation.id);

      return newMessage;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add message';
      setState(prev => ({ ...prev, error: errorMessage }));
      return null;
    }
  }, [state.currentConversation]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    state,
    createConversation,
    selectConversation,
    addMessage,
    loadConversations,
    clearError,
  };
};