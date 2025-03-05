
import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '@/lib/types';
import ReactMarkdown from 'react-markdown';

interface ChatMessageListProps {
  messages: ChatMessage[];
}

export const ChatMessageList = ({ messages }: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center text-gray-400">
        No messages yet
      </div>
    );
  }
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg: ChatMessage) => (
        <div
          key={msg.id}
          className={`${msg.role === 'user' ? 'chat-message-user' : 'chat-message-ai'} p-3 rounded-lg mb-2 ${
            msg.role === 'user' ? 'bg-jess-primary bg-opacity-10 ml-auto max-w-[80%]' : 'bg-gray-100 mr-auto max-w-[80%]'
          }`}
        >
          {msg.role === 'assistant' ? (
            <ReactMarkdown 
              className="whitespace-pre-wrap max-w-none leading-tight"
            >
              {msg.content}
            </ReactMarkdown>
          ) : (
            <div className="whitespace-pre-wrap leading-tight">{msg.content}</div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
