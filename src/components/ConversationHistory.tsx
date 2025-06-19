import React from 'react';
import { Bot, User, Heart, Star, Clock } from 'lucide-react';
import { Conversation, Product } from '../types';
import { ProductCard } from './ProductCard';

interface ConversationHistoryProps {
  conversations: Conversation[];
  onLearnMore: (product: Product) => void;
  onOrder: (product: Product) => void;
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  conversations,
  onLearnMore,
  onOrder
}) => {
  return (
    <div className="space-y-6">
      {conversations.map((conversation) => (
        <div key={conversation.id} className="flex space-x-4">
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              conversation.isUser 
                ? 'bg-blue-500 text-white' 
                : 'bg-gradient-to-br from-orange-500 to-amber-600 text-white'
            }`}>
              {conversation.isUser ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium text-gray-800">
                {conversation.isUser ? 'You' : 'Matsya'}
              </span>
              <span className="text-xs text-gray-500">
                {conversation.timestamp.toLocaleTimeString()}
              </span>
            </div>

            <div className={`rounded-lg p-4 ${
              conversation.isUser 
                ? 'bg-blue-50 border border-blue-200' 
                : 'bg-orange-50 border border-orange-200'
            }`}>
              <p className="text-gray-800 whitespace-pre-wrap">{conversation.message}</p>

              {conversation.products && conversation.products.length > 0 && (
                <div className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {conversation.products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onLearnMore={onLearnMore}
                        onOrder={onOrder}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};