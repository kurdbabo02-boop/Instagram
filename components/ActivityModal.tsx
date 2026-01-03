
import React, { useState } from 'react';
import { ActivityItem } from '../types';

interface ActivityModalProps {
  onAdd: (activity: ActivityItem) => void;
  onClose: () => void;
}

const ActivityModal: React.FC<ActivityModalProps> = ({ onAdd, onClose }) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(`https://picsum.photos/seed/${Math.random()}/200/200`);
  const [type, setType] = useState<'like' | 'follow' | 'comment' | 'request'>('request');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newActivity: ActivityItem = {
      id: Date.now().toString(),
      type,
      user: { name, avatar },
      time: 'Just now',
      content: type === 'comment' ? content : (type === 'like' ? 'liked your photo' : undefined)
    };

    onAdd(newActivity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-zinc-900 w-full max-w-sm rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
          <h3 className="text-white font-bold">Add Activity</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="flex flex-col items-center mb-2">
            <img src={avatar} className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 mb-2" alt="Preview" />
            <button 
              type="button" 
              onClick={() => setAvatar(`https://picsum.photos/seed/${Math.random()}/200/200`)}
              className="text-xs text-blue-500 font-bold"
            >
              Random Avatar
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold px-1">Account Name</label>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. real_person_99"
              className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-sm text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold px-1">Avatar URL</label>
            <input 
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-xs text-white outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold px-1">Activity Type</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-sm text-white outline-none"
            >
              <option value="request">Follow Request</option>
              <option value="follow">New Follower</option>
              <option value="like">Like Post</option>
              <option value="comment">Comment</option>
            </select>
          </div>

          {type === 'comment' && (
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 uppercase font-bold px-1">Comment Text</label>
              <input 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nice photo!"
                className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-sm text-white outline-none"
              />
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors mt-2"
          >
            Add to Activity
          </button>
        </form>
      </div>
    </div>
  );
};

export default ActivityModal;
