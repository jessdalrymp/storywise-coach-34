
import React, { useState, useEffect, useRef } from 'react';
import { MoodType, MoodEntry, JournalEntry } from '../lib/types';
import { UserDataContext } from './UserDataContext';
import { useUserData } from '../hooks/useUserData';
import { useMoodActions } from '../hooks/useMoodActions';
import { useJournalActions } from '../hooks/useJournalActions';
import { useConversationData } from '../hooks/useConversationData';
import { useSubscription } from '../hooks/useSubscription';
import { useToast } from '@/components/ui/use-toast';
import { Subscription } from './types';

interface UserDataProviderProps {
  children: React.ReactNode;
}

export const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
  const { 
    user, 
    profile, 
    loading: userLoading, 
    fetchUser, 
    fetchProfile, 
    saveProfile 
  } = useUserData();

  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isJournalFetched, setIsJournalFetched] = useState(false);
  const [isJournalLoading, setIsJournalLoading] = useState(false);
  const isFetchingJournalRef = useRef(false);
  
  const moodActions = useMoodActions();
  const journalActions = useJournalActions();
  const { loading: conversationLoading, startConversation, addMessageToConversation } = useConversationData(user?.id);
  const { subscription, loading: subscriptionLoading, checkSubscriptionStatus, applyCoupon } = useSubscription(user?.id);
  const { toast } = useToast();
  
  const loading = userLoading || moodActions.loading || 
                 isJournalLoading || conversationLoading || subscriptionLoading;

  useEffect(() => {
    if (user && !isJournalFetched && !isFetchingJournalRef.current) {
      fetchJournalEntries();
      fetchMoodEntries();
      checkSubscriptionStatus();
    }
  }, [user, isJournalFetched]);

  const fetchMoodEntries = async () => {
    if (user) {
      try {
        const entries = await moodActions.fetchMoodEntries(user.id);
        setMoodEntries(entries);
      } catch (error) {
        console.error("Error fetching mood entries:", error);
      }
    }
  };

  const fetchJournalEntries = async () => {
    if (!user) return [];
    
    if (isFetchingJournalRef.current) {
      console.log("Journal entries already being fetched, skipping redundant fetch");
      return journalEntries;
    }
    
    isFetchingJournalRef.current = true;
    setIsJournalLoading(true);
    
    try {
      console.log("Fetching journal entries for user:", user.id);
      const entries = await journalActions.fetchJournalEntries(user.id);
      setJournalEntries(entries);
      setIsJournalFetched(true);
      console.log("Successfully fetched", entries.length, "journal entries");
      return entries;
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      return [];
    } finally {
      isFetchingJournalRef.current = false;
      setIsJournalLoading(false);
    }
  };

  const handleAddMessageToConversation = async (conversationId: string, content: string, role: 'user' | 'assistant') => {
    try {
      await addMessageToConversation(conversationId, content, role);
      
      if (role === 'assistant') {
        setIsJournalFetched(false);
        if (user) {
          await fetchJournalEntries();
        }
      }
    } catch (error) {
      console.error('Error adding message to conversation:', error);
      toast({
        title: "Error saving message",
        description: "Your message might not have been saved",
        variant: "destructive"
      });
      throw error;
    }
  };

  const value = {
    user,
    profile,
    loading,
    fetchUser,
    fetchProfile,
    saveProfile,
    startConversation,
    addMessageToConversation: handleAddMessageToConversation,
    moodEntries,
    addMoodEntry,
    journalEntries,
    fetchJournalEntries,
    subscription,
    checkSubscriptionStatus,
    applyCoupon
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};
