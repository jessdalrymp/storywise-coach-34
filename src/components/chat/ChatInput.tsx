
import React, { useState, useRef, useEffect } from 'react';
import { ActionButton } from '../ui/ActionButton';
import { Send, Loader2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { AnswerLengthToggle } from './AnswerLengthToggle';

interface ChatInputProps {
  onSendMessage: (message: string, options?: { brevity?: 'short' | 'detailed' }) => void;
  loading: boolean;
}

export const ChatInput = ({ onSendMessage, loading }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [brevity, setBrevity] = useState<'short' | 'detailed'>(() => {
    // Try to get saved preference from localStorage, default to 'detailed'
    return (localStorage.getItem('chatBrevityPreference') as 'short' | 'detailed') || 'detailed';
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleSend = () => {
    if (!message.trim() || loading) return;
    onSendMessage(message, { brevity });
    setMessage('');
  };
  
  const handleToggleBrevity = (value: 'short' | 'detailed') => {
    setBrevity(value);
    localStorage.setItem('chatBrevityPreference', value);
  };
  
  // Automatically adjust the height based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to calculate correct scrollHeight
      textarea.style.height = 'auto';
      // Set the height to match the content
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [message]);
  
  return (
    <div className="border-t border-jess-subtle p-4">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-end">
          <AnswerLengthToggle 
            brevity={brevity}
            onToggle={handleToggleBrevity}
          />
        </div>
        <div className="flex items-center">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={loading ? "Jess is thinking..." : "Type your message..."}
            className="flex-1 bg-jess-subtle text-jess-foreground min-h-[40px] max-h-[200px] overflow-y-auto resize-none py-2"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={loading}
            rows={1}
          />
          {loading ? (
            <div className="ml-2 w-10 h-10 p-0 rounded-full flex items-center justify-center bg-jess-subtle">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : (
            <ActionButton
              type="primary"
              onClick={handleSend}
              disabled={!message.trim()}
              className="ml-2 w-10 h-10 p-0 rounded-full flex items-center justify-center"
              icon={<Send size={18} />}
            >
              <span className="sr-only">Send</span>
            </ActionButton>
          )}
        </div>
      </div>
    </div>
  );
};
