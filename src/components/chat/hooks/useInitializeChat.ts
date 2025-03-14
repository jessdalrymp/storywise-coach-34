
import { useState, useCallback, useEffect } from 'react';
import { useUserData } from '../../../context/UserDataContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { ConversationSession, ChatMessage } from '@/lib/types';
import { getInitialMessage } from '../chatUtils';
import {
  saveCurrentConversationToStorage,
  getCurrentConversationFromStorage
} from '@/lib/storageUtils';

export const useInitializeChat = (type: 'story' | 'sideQuest' | 'action' | 'journal') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const { startConversation, addMessageToConversation } = useUserData();
  const { user: authUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (authUser !== undefined) {
      setAuthChecked(true);
    }
  }, [authUser]);

  const initializeChat = useCallback(async () => {
    // Return early if already initialized or loading
    if (isInitialized && !loading) {
      console.log(`Chat for ${type} already initialized, using existing session`);
      const cachedConversation = getCurrentConversationFromStorage(type);
      if (cachedConversation && authUser && cachedConversation.userId === authUser.id) {
        return cachedConversation;
      }
    }

    if (!authChecked) {
      console.log("Auth status not yet checked, waiting...");
      return null;
    }

    // Prevent re-initialization while loading
    if (loading) {
      console.log(`${type} chat initialization already in progress`);
      return null;
    }

    try {
      setLoading(true);
      console.log(`Initializing chat for type: ${type}`);
      console.log("User authentication state:", authUser ? "Authenticated" : "Not authenticated");
      
      if (!authUser) {
        console.log("User not authenticated, cannot initialize chat");
        setError("Authentication required");
        return null;
      }
      
      // Check for cached conversation first
      const cachedConversation = getCurrentConversationFromStorage(type);
      
      if (cachedConversation && cachedConversation.userId === authUser.id) {
        console.log(`Using existing ${type} conversation from cache`);
        setIsInitialized(true);
        return cachedConversation;
      }
      
      // For sideQuest or action, create with initial message
      if (type === 'sideQuest' || type === 'action') {
        console.log(`Creating new ${type} conversation`);
        try {
          const conversation = await startConversation(type);
          
          const initialMessage = getInitialMessage(type);
          await addMessageToConversation(
            conversation.id,
            initialMessage,
            'assistant' as const
          );
          
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
          setIsInitialized(true);
          return updatedSession;
        } catch (err) {
          console.error(`Error starting ${type} conversation:`, err);
          setError(`Failed to initialize ${type} chat`);
          throw err;
        }
      }
      
      // For other types (story, journal)
      try {
        console.log(`Starting new ${type} conversation from API`);
        const conversation = await startConversation(type);
        
        if (!conversation.messages || conversation.messages.length === 0) {
          const isStoryType = type === 'story';
          const hasVisitedStoryPage = localStorage.getItem('hasVisitedStoryPage');
          const isFirstVisit = isStoryType && !hasVisitedStoryPage;
          
          let initialMessage = "";
          
          if (!isFirstVisit) {
            initialMessage = getInitialMessage(type);
          } else {
            initialMessage = "I'm excited to hear your story! What would you like to talk about today?";
          }
          
          await addMessageToConversation(
            conversation.id,
            initialMessage,
            'assistant' as const
          );
          
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
          setIsInitialized(true);
          return updatedSession;
        }
        
        setIsInitialized(true);
        return conversation;
      } catch (err) {
        console.error('Error initializing chat:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to initialize chat");
        }
        toast({
          title: "Error starting conversation",
          description: "Please try again later.",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      console.error('Error in initializeChat:', error);
      setError("Failed to initialize chat");
      toast({
        title: "Error starting conversation",
        description: "Please try again later.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [type, authUser, addMessageToConversation, startConversation, toast, isInitialized, authChecked, loading]);

  return {
    initializeChat,
    loading,
    error
  };
};
