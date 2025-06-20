'use client';

import React, { useEffect, useRef } from 'react';
import { User, Bot, Volume2, Play, Pause } from 'lucide-react';
import { useConversation } from '@/hooks/useConversation';
import { Message } from '@/lib/supabase';

interface ConversationViewProps {
  className?: string;
}

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [audioElement, setAudioElement] = React.useState<HTMLAudioElement | null>(null);

  const handlePlayAudio = () => {
    if (!message.audio_url) return;

    if (isPlaying && audioElement) {
      audioElement.pause();
      setIsPlaying(false);
      return;
    }

    const audio = new Audio(message.audio_url);
    audio.play();
    setIsPlaying(true);
    setAudioElement(audio);

    audio.onended = () => {
      setIsPlaying(false);
      setAudioElement(null);
    };
  };

  const isUser = message.type === 'user';
  const timestamp = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-blue-500' : 'bg-green-500'
          }`}>
            {isUser ? (
              <User className="w-4 h-4 text-white" />
            ) : (
              <Bot className="w-4 h-4 text-white" />
            )}
          </div>
        </div>

        {/* Message Content */}
        <div className={`${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
        } rounded-lg px-4 py-2 shadow-md`}>
          
          {/* Audio Player */}
          {message.audio_url && (
            <div className="mb-2">
              <button
                onClick={handlePlayAudio}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                  isUser 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                } transition-colors duration-200`}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <Volume2 className="w-4 h-4" />
                <span className="text-sm">
                  {isPlaying ? 'Playing...' : 'Voice Message'}
                </span>
              </button>
            </div>
          )}

          {/* Text Content */}
          <p className="whitespace-pre-wrap">{message.content}</p>

          {/* Timestamp */}
          <div className={`text-xs mt-1 ${
            isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
          }`}>
            {timestamp}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ConversationView: React.FC<ConversationViewProps> = ({
  className = '',
}) => {
  const { state } = useConversation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  if (!state.currentConversation) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center">
          <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No conversation selected
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Start a new conversation or select an existing one
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Conversation Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {state.currentConversation.title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {state.messages.length} messages
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 px-6 py-4">
        {state.isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        ) : state.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">
                Start the conversation by recording a voice message
              </p>
            </div>
          </div>
        ) : (
          <>
            {state.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error Display */}
      {state.error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800 px-6 py-3">
          <p className="text-sm text-red-700 dark:text-red-300">{state.error}</p>
        </div>
      )}
    </div>
  );
};