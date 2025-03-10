
import { useState } from 'react';
import { ConversationSession, ChatMessage } from '@/lib/types';
import { useUserData } from '../../../context/UserDataContext';
import { useToast } from '@/hooks/use-toast';
import { formatMessagesForAI } from '../chatUtils';
import { generateDeepseekResponse } from '../../../utils/deepseekApi';
import { saveCurrentConversationToStorage } from '@/lib/storageUtils';

export const useSendMessage = (type: 'story' | 'sideQuest' | 'action' | 'journal') => {
  const [loading, setLoading] = useState(false);
  const { addMessageToConversation } = useUserData();
  const { toast } = useToast();

  const sendMessage = async (message: string, session: ConversationSession) => {
    if (!session) {
      console.error("No active session");
      return null;
    }
    
    setLoading(true);
    
    try {
      const newUserMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user' as const,
        content: message,
        timestamp: new Date(),
      };
      
      const updatedSessionWithUserMsg: ConversationSession = {
        ...session,
        messages: [...(session.messages || []), newUserMessage],
      };
      
      saveCurrentConversationToStorage(updatedSessionWithUserMsg);
      
      await addMessageToConversation(session.id, message, 'user');
      
      const updatedMessages = [...(session.messages || []), newUserMessage];
      
      // Here we format messages according to the chat type, which includes the updated system prompts
      const aiMessages = formatMessagesForAI(updatedMessages, type);
      
      console.log(`Sending ${type} messages to AI with system prompt:`, 
        aiMessages.length > 0 ? aiMessages[0].content.substring(0, 100) + '...' : 'No system prompt');
      
      const response = await generateDeepseekResponse(aiMessages);
      const aiResponseText = response.choices[0].message.content;
      
      console.log(`Received AI response for ${type}:`, 
        aiResponseText.substring(0, 100) + (aiResponseText.length > 100 ? '...' : ''));
      
      const newAIMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: aiResponseText,
        timestamp: new Date(),
      };
      
      const finalUpdatedSession: ConversationSession = {
        ...session,
        messages: [...(session.messages || []), newUserMessage, newAIMessage],
      };
      
      saveCurrentConversationToStorage(finalUpdatedSession);
      
      await addMessageToConversation(session.id, aiResponseText, 'assistant');
      
      return finalUpdatedSession;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendMessage,
    loading
  };
};
