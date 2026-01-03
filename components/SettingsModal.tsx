
import React, { useState } from 'react';
import { UserProfile, ChatTheme } from '../types';

interface SettingsModalProps {
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ profile, onSave, onClose }) => {
  const [edited, setEdited] = useState<UserProfile>({ ...profile });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(edited);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEdited(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 w-full max-w-md rounded-2xl border border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <button onClick={onClose} className="text-white text-sm font-semibold">Cancel</button>
          <h3 className="text-white font-bold">Edit Chat Experience</h3>
          <button onClick={handleSubmit} className="text-blue-500 text-sm font-bold">Done</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
          <div className="bg-zinc-800/50 p-4 rounded-xl space-y-4 border border-zinc-700">
            <h4 className="text-white text-xs font-black uppercase tracking-widest opacity-50">Theme & Style</h4>
            <div className="flex flex-col space-y-1">
              <label className="text-zinc-500 text-[10px] px-1 uppercase font-bold">Platform Interface</label>
              <div className="grid grid-cols-3 gap-2">
                {(['instagram', 'whatsapp', 'snapchat'] as ChatTheme[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setEdited(prev => ({ ...prev, theme: t }))}
                    className={`py-2 px-1 text-xs rounded-lg font-bold capitalize border transition-all ${
                      edited.theme === t 
                      ? 'bg-blue-600 border-blue-500 text-white' 
                      : 'bg-black border-zinc-800 text-zinc-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img src={edited.avatar} className="w-20 h-20 rounded-full object-cover border-2 border-zinc-700 mb-2" alt="Avatar" />
            <button className="text-blue-500 text-xs font-bold">Change profile photo</button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-zinc-500 text-xs px-1">Name</label>
                <input name="name" value={edited.name} onChange={handleChange} className="bg-black border border-zinc-800 rounded-lg p-2 text-white text-sm outline-none" />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-zinc-500 text-xs px-1">Username</label>
                <input name="username" value={edited.username} onChange={handleChange} className="bg-black border border-zinc-800 rounded-lg p-2 text-white text-sm outline-none" />
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-zinc-500 text-xs px-1">Avatar URL</label>
              <input name="avatar" value={edited.avatar} onChange={handleChange} className="bg-black border border-zinc-800 rounded-lg p-2 text-white text-sm outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-zinc-500 text-xs px-1">Followers</label>
                <input name="followers" value={edited.followers} onChange={handleChange} className="bg-black border border-zinc-800 rounded-lg p-2 text-white text-sm outline-none" />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-zinc-500 text-xs px-1">Posts</label>
                <input name="posts" value={edited.posts} onChange={handleChange} className="bg-black border border-zinc-800 rounded-lg p-2 text-white text-sm outline-none" />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <h4 className="text-white text-sm font-bold mb-3">AI Personality</h4>
              <div className="flex flex-col space-y-1 mb-4">
                <label className="text-zinc-500 text-xs px-1">Language</label>
                <input name="language" value={edited.language} onChange={handleChange} placeholder="e.g. Dutch" className="bg-black border border-zinc-800 rounded-lg p-2 text-white text-sm outline-none" />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-zinc-500 text-xs px-1">Personality Bio</label>
                <textarea name="personality" value={edited.personality} onChange={handleChange} rows={4} className="bg-black border border-zinc-800 rounded-lg p-2 text-white text-sm outline-none resize-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
