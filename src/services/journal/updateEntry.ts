
import { supabase } from '@/integrations/supabase/client';
import { encryptContent } from './encryption';

/**
 * Updates an existing journal entry
 */
export const updateJournalEntry = async (entryId: string, content: string, userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // Encrypt the content before updating
    const encryptedContent = encryptContent(content, userId);
    
    const { error } = await supabase
      .from('journal_entries')
      .update({ content: encryptedContent })
      .eq('id', entryId);

    if (error) {
      console.error('Error updating journal entry:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating journal entry:', error);
    return false;
  }
};
