
import React from 'react';
import { ChatMessage as ChatMessageType, MessageSender } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === MessageSender.USER;

  const formatDate = (date: Date): string => {
    return date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-xl shadow-md ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-slate-100 text-slate-800 rounded-bl-none'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        <div className={`text-xs mt-1 ${isUser ? 'text-blue-200 text-right' : 'text-slate-500 text-left'}`}>
          {formatDate(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
