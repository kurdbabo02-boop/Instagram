
import React from 'react';
import { Message, ChatTheme } from '../types';

interface MessageBubbleProps {
  message: Message;
  isLast: boolean;
  isFirst: boolean;
  theme: ChatTheme;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isLast, isFirst, theme }) => {
  const isUser = message.sender === 'user';
  
  if (theme === 'whatsapp') {
    return (
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-1`}>
        <div className={`
          max-w-[85%] px-3 py-1.5 text-[14.2px] rounded-lg relative shadow-sm
          ${isUser ? 'user-bubble-whatsapp text-[#e9edef]' : 'ai-bubble-whatsapp text-[#e9edef]'}
        `}>
          {message.text}
          <div className="flex justify-end items-center space-x-1 mt-0.5 h-3">
            <span className="text-[10px] text-[#aebac1]">
              {message.timestamp.getHours()}:{message.timestamp.getMinutes().toString().padStart(2, '0')}
            </span>
            {isUser && <i className="fa-solid fa-check-double text-[10px] text-[#53bdeb]"></i>}
          </div>
        </div>
      </div>
    );
  }

  if (theme === 'snapchat') {
    return (
      <div className={`flex flex-col mb-4 ${isUser ? 'items-start ml-2' : 'items-start ml-2'}`}>
        <div className="flex items-baseline space-x-2">
          <span className={`text-[11px] font-black uppercase tracking-tighter ${isUser ? 'text-[#00baff]' : 'text-[#ff004c]'}`}>
            {isUser ? 'ME' : 'AI'}
          </span>
        </div>
        <div className={`
          max-w-[90%] text-base text-white leading-snug border-l-2 pl-3 py-0.5
          ${isUser ? 'border-[#00baff]' : 'border-[#ff004c]'}
        `}>
          {message.text}
        </div>
      </div>
    );
  }

  // Instagram Default
  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-1`}>
      <div 
        className={`
          max-w-[75%] px-4 py-2 text-sm rounded-2xl break-words
          ${isUser 
            ? 'user-bubble-instagram text-white rounded-tr-md rounded-br-md' 
            : 'bg-zinc-800 text-white rounded-tl-md rounded-bl-md'}
          ${isFirst ? (isUser ? 'rounded-tr-2xl' : 'rounded-tl-2xl') : ''}
          ${isLast ? (isUser ? 'rounded-br-2xl' : 'rounded-bl-2xl') : ''}
        `}
      >
        {message.text}
      </div>
      {isLast && isUser && (
        <span className="text-[10px] text-zinc-500 mt-1 mr-1">Seen</span>
      )}
    </div>
  );
};

export default MessageBubble;
