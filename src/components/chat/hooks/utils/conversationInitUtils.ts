
import { saveCurrentConversationToStorage } from '@/lib/storageUtils';
import { ConversationSession } from '@/lib/types';
import { getInitialMessage } from '../../chatUtils';
import { fetchConversation } from '@/services/conversation';

/**
 * Load a specific conversation by ID
 */
export const loadExistingConversation = async (
  conversationId: string, 
  userId: string
): Promise<ConversationSession | null> => {
  try {
    if (!userId) {
      console.error('Cannot load conversation: No user ID provided');
      return null;
    }
    
    if (!conversationId) {
      console.error('Cannot load conversation: No conversation ID provided');
      return null;
    }
    
    console.log(`Attempting to load specific conversation ID: ${conversationId} for user: ${userId}`);
    
    const conversation = await fetchConversation(conversationId, userId);
    
    if (conversation) {
      console.log(`Successfully loaded conversation ${conversationId} with ${conversation.messages.length} messages`);
      
      // Ensure messages is always an array
      if (!conversation.messages || !Array.isArray(conversation.messages)) {
        console.error(`Conversation ${conversationId} has no messages or invalid message format`);
        throw new Error("Invalid conversation format: messages missing or not an array");
      }

      // Convert to ConversationSession format
      const conversationSession: ConversationSession = {
        id: conversation.id,
        userId: conversation.userId,
        type: conversation.type as 'story' | 'sideQuest' | 'action' | 'journal',
        title: conversation.title,
        messages: conversation.messages.map(msg => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: msg.createdAt
        })),
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt
      };
      
      saveCurrentConversationToStorage(conversationSession);
      return conversationSession;
    } else {
      console.log(`Conversation ${conversationId} not found or not accessible`);
      throw new Error(`Conversation ${conversationId} not found or not accessible`);
    }
  } catch (err) {
    console.error(`Error loading conversation ${conversationId}:`, err);
    throw err;
  }
};

/**
 * Create a new conversation with initial assistant message
 */
export const createConversationWithInitialMessage = async (
  type: 'story' | 'sideQuest' | 'action' | 'journal',
  initialMessage: string,
  startConversationFn: (type: 'story' | 'sideQuest' | 'action' | 'journal') => Promise<ConversationSession>,
  addMessageFn: (conversationId: string, content: string, role: 'user' | 'assistant') => Promise<boolean>
): Promise<ConversationSession | null> => {
  try {
    console.log(`Creating new ${type} conversation`);
    const conversation = await startConversationFn(type);
    
    if (!conversation?.id) {
      console.error('Failed to create conversation - no ID returned');
      throw new Error('Failed to create conversation - no ID returned');
    }
    
    // Add initial message and ensure we're capturing the boolean result
    console.log(`Adding initial message to conversation ${conversation.id}`);
    const messageAdded = await addMessageFn(
      conversation.id,
      initialMessage,
      'assistant' as const
    );
    
    if (!messageAdded) {
      console.warn('Initial message may not have been added properly');
    }
    
    const updatedSession: ConversationSession = {
      ...conversation,
      messages: [
        {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: initialMessage,
          timestamp: new Date(),
        },
      ],
    };
    
    saveCurrentConversationToStorage(updatedSession);
    return updatedSession;
  } catch (err) {
    console.error(`Error creating ${type} conversation:`, err);
    throw err;
  }
};

/**
 * Determine appropriate initial message based on conversation type and context
 */
export const determineInitialMessage = (
  type: 'story' | 'sideQuest' | 'action' | 'journal',
  isFirstVisit: boolean
): string => {
  if (isFirstVisit && type === 'story') {
    return "I'm excited to hear your story! What would you like to talk about today?";
  }
  
  return getInitialMessage(type);
};
