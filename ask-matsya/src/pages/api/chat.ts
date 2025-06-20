import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

// Mock AI response for now - in production, you'd integrate with OpenAI/Claude
const generateAIResponse = async (userMessage: string, conversationHistory: any[]): Promise<string> => {
  // Simple keyword-based responses for demo
  const message = userMessage.toLowerCase();
  
  if (message.includes('hello') || message.includes('hi') || message.includes('namaste')) {
    return "Namaste! I'm Matsya, your AI assistant for discovering authentic Indian ethnic products. How can I help you today?";
  }
  
  if (message.includes('saree') || message.includes('sari')) {
    return "I'd be happy to help you find the perfect saree! Are you looking for something specific like a wedding saree, casual wear, or perhaps a particular regional style like Banarasi or Kanjivaram?";
  }
  
  if (message.includes('jewelry') || message.includes('jewellery')) {
    return "Our jewelry collection features beautiful traditional pieces! Would you like to explore Kundan sets, gold jewelry, or perhaps silver ornaments? What's the occasion?";
  }
  
  if (message.includes('wedding') || message.includes('marriage')) {
    return "Wedding preparations are so exciting! I can help you find everything from bridal sarees and lehengas to jewelry sets and accessories. What would you like to explore first?";
  }
  
  if (message.includes('gift') || message.includes('present')) {
    return "I'd love to help you find the perfect gift! Could you tell me a bit more about who it's for and what the occasion is? That way I can suggest something truly special.";
  }
  
  // Default response
  return "Thank you for sharing that with me! I'm here to help you discover beautiful Indian ethnic products. Would you like me to show you some of our featured items, or do you have something specific in mind?";
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, conversationId } = req.body;

    if (!message || !conversationId) {
      return res.status(400).json({ error: 'Message and conversation ID are required' });
    }

    // Get conversation history (last 10 messages for context)
    const { data: history, error: historyError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (historyError) {
      console.error('Error fetching conversation history:', historyError);
    }

    // Generate AI response
    const aiResponse = await generateAIResponse(message, history || []);

    // Save the AI message to database
    const { data: savedMessage, error: saveError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        type: 'assistant',
        content: aiResponse,
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving AI message:', saveError);
      return res.status(500).json({ error: 'Failed to save AI response' });
    }

    // Update conversation timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return res.status(200).json({
      success: true,
      message: savedMessage,
      response: aiResponse,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Chat processing failed';
    
    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
}