
import React from 'react';
import { UserProfile } from '../types';

interface ChatHeaderProps {
  profile: UserProfile;
  onOpenSettings: () => void;
  onBack: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ profile, onOpenSettings, onBack }) => {
  if (profile.theme === 'whatsapp') {
    return (
      <div className="flex items-center justify-between px-3 py-2 bg-[#202c33] sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <button onClick={onBack} className="text-[#aebac1] hover:text-white"><i className="fa-solid fa-arrow-left"></i></button>
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onOpenSettings}>
            <img src={profile.avatar} className="w-10 h-10 rounded-full object-cover" alt="avatar" />
            <div className="flex flex-col">
              <span className="text-white text-base font-medium leading-tight">{profile.name}</span>
              <span className="text-[#aebac1] text-xs leading-tight">online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-6 text-[#aebac1]">
          <button className="hover:text-white"><i className="fa-solid fa-video"></i></button>
          <button className="hover:text-white"><i className="fa-solid fa-phone"></i></button>
          <button className="hover:text-white" onClick={onOpenSettings}><i className="fa-solid fa-ellipsis-vertical"></i></button>
        </div>
      </div>
    );
  }

  if (profile.theme === 'snapchat') {
    return (
      <div className="flex items-center justify-between px-4 py-3 bg-black border-b border-zinc-900 sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="text-white"><i className="fa-solid fa-chevron-left"></i></button>
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onOpenSettings}>
            <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center overflow-hidden border border-zinc-700">
               <img src={profile.avatar} className="w-full h-full object-cover" alt="avatar" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg leading-tight">{profile.name}</span>
              <span className="text-[#00baff] text-xs font-bold uppercase tracking-wider">New Chat</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-white">
          <button className="w-9 h-9 bg-zinc-900 rounded-full flex items-center justify-center" onClick={onOpenSettings}>
            <i className="fa-solid fa-gear"></i>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-black sticky top-0 z-10">
      <div className="flex items-center space-x-3">
        <button onClick={onBack} className="text-white hover:opacity-70 transition-opacity">
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={onOpenSettings}>
          <div className="relative">
            <img src={profile.avatar} className="w-10 h-10 rounded-full object-cover border border-zinc-700" alt="avatar" />
            {profile.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></div>}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white leading-tight">{profile.name}</span>
            <span className="text-xs text-zinc-400 leading-tight">Active now</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-5 text-xl text-white">
        <button className="hover:opacity-70"><i className="fa-solid fa-phone"></i></button>
        <button className="hover:opacity-70"><i className="fa-solid fa-video"></i></button>
        <button className="hover:opacity-70" onClick={onOpenSettings}><i className="fa-solid fa-circle-info"></i></button>
      </div>
    </div>
  );
};

export default ChatHeader;
