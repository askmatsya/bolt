'use client';

import React, { useState } from 'react';
import { Bot, MessageCircle, Settings, Moon, Sun } from 'lucide-react';
import { AudioRecorder } from '@/components/AudioRecorder';
import { ConversationView } from '@/components/ConversationView';
import { useConversation } from '@/hooks/useConversation';

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ta'>('en');
  
  const { state, createConversation, addMessage } = useConversation();

  const handleTranscriptionComplete = async (transcript: string, audioBlob: Blob) => {
    // Create new conversation if none exists
    let conversation = state.currentConversation;
    if (!conversation) {
      conversation = await createConversation(
        `Conversation ${new Date().toLocaleDateString()}`
      );
      if (!conversation) return;
    }

    // Upload audio to Supabase storage (simplified for demo)
    const audioUrl = URL.createObjectURL(audioBlob);

    // Add user message with audio
    const userMessage = await addMessage(transcript, 'user', audioUrl);
    if (!userMessage) return;

    // Generate AI response
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: transcript,
          conversationId: conversation.id,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        console.error('Chat API error:', data.error);
      }
    } catch (error) {
      console.error('Failed to get AI response:', error);
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Ask Matsya
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    AI Voice Assistant for Ethnic Products
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-4">
                {/* Language Toggle */}
                <button
                  onClick={toggleLanguage}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  {language === 'en' ? 'தமிழ்' : 'English'}
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* New Conversation */}
                <button
                  onClick={() => createConversation(`New Chat ${Date.now()}`)}
                  className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>New Chat</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
            {/* Audio Recorder Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <AudioRecorder
                  onTranscriptionComplete={handleTranscriptionComplete}
                  language={language}
                />

                {/* Quick Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Voice Assistant Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Conversations</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {state.conversations.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Messages</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {state.messages.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Language</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {language === 'en' ? 'English' : 'தமிழ்'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversation Area */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full">
                <ConversationView />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Powered by Speechmatics AI • Built with Next.js & Supabase
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <span>🎙️ Real-time Voice Recognition</span>
                <span>🤖 AI-Powered Conversations</span>
                <span>🌐 Multi-language Support</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}