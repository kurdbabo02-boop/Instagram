
import React, { useState, useRef } from 'react';
import { ChatTheme } from '../types';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  isTyping: boolean;
  theme: ChatTheme;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isTyping, theme }) => {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim() && !isTyping) {
      onSendMessage(text);
      setText('');
    }
  };

  if (theme === 'whatsapp') {
    return (
      <div className="p-2 bg-[#202c33] flex items-center space-x-2">
        <div className="flex items-center space-x-4 px-2 text-[#aebac1]">
          <button type="button"><i className="fa-regular fa-face-smile text-xl"></i></button>
          <button type="button"><i className="fa-solid fa-plus text-xl"></i></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 flex items-center space-x-2">
          <input 
            type="text" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message" 
            className="flex-1 bg-[#2a3942] text-white text-[15px] outline-none px-4 py-2.5 rounded-lg placeholder-[#8696a0]"
          />
          <button 
            type="submit" 
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${text.trim() ? 'bg-[#00a884] text-white' : 'text-[#aebac1]'}`}
          >
            {text.trim() ? <i className="fa-solid fa-paper-plane"></i> : <i className="fa-solid fa-microphone"></i>}
          </button>
        </form>
      </div>
    );
  }

  if (theme === 'snapchat') {
    return (
      <div className="p-3 bg-black border-t border-zinc-900 flex items-center space-x-3">
        <button className="text-zinc-400 text-xl"><i className="fa-solid fa-camera"></i></button>
        <form onSubmit={handleSubmit} className="flex-1 flex items-center bg-zinc-900 rounded-full px-4 py-2">
          <input 
            type="text" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Send a Chat" 
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-zinc-500"
          />
          <button type="button" className="text-zinc-400 ml-2"><i className="fa-regular fa-face-smile"></i></button>
        </form>
        {text.trim() && (
          <button onClick={handleSubmit} className="text-[#00baff] font-bold text-sm uppercase">Send</button>
        )}
      </div>
    );
  }

  // Instagram Default
  return (
    <div className="p-4 bg-black sticky bottom-0">
      <form 
        onSubmit={handleSubmit}
        className="flex items-center bg-zinc-900/50 border border-zinc-800 rounded-full px-4 py-2 group focus-within:border-zinc-600 transition-colors"
      >
        <button type="button" className="text-white bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center mr-3 hover:bg-blue-600">
          <i className="fa-solid fa-camera"></i>
        </button>
        <input 
          ref={inputRef}
          type="text" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message..." 
          className="flex-1 bg-transparent text-white text-sm outline-none placeholder-zinc-500"
        />
        {text.trim() ? (
          <button type="submit" className="text-blue-500 font-semibold text-sm px-2">Send</button>
        ) : (
          <div className="flex items-center space-x-4 ml-2">
            <button type="button" className="text-white opacity-70"><i className="fa-solid fa-microphone"></i></button>
            <button type="button" className="text-white opacity-70"><i className="fa-regular fa-image"></i></button>
            <button type="button" className="text-white opacity-70"><i className="fa-regular fa-face-smile"></i></button>
          </div>
        )}
      </form>
    </div>
  );
};

export default MessageInput;
