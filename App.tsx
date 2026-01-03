
import React, { useState, useEffect, useRef, useMemo } from 'react';
import ChatHeader from './components/ChatHeader';
import MessageBubble from './components/MessageBubble';
import MessageInput from './components/MessageInput';
import SettingsModal from './components/SettingsModal';
import ActivityModal from './components/ActivityModal';
import { Message, UserProfile, ViewState, ActivityItem } from './types';
import { geminiService } from './services/geminiService';

const INITIAL_THREADS: UserProfile[] = [
  {
    id: 'ai-1',
    name: 'Gemini AI',
    username: 'gemini.chat',
    avatar: 'https://picsum.photos/seed/gemini/200/200',
    isOnline: true,
    followers: '10M',
    posts: '42',
    personality: 'Friendly and helpful AI assistant.',
    language: 'Dutch',
    theme: 'instagram',
    lastMessage: 'Hey! Ik ben je AI vriend. 👋',
    messages: [{ id: '1', text: 'Hey! Ik ben je AI vriend op Instagram. Hoe gaat het? 👋', sender: 'ai', timestamp: new Date() }]
  },
  {
    id: 'ai-2',
    name: 'Tech Buddy',
    username: 'techie_bot',
    avatar: 'https://picsum.photos/seed/tech/200/200',
    isOnline: false,
    followers: '50k',
    posts: '120',
    personality: 'Nerdy and excited about gadgets.',
    language: 'English',
    theme: 'whatsapp',
    lastMessage: 'Did you see the new AI drop?',
    messages: [{ id: '1', text: 'Yo! Did you see the new AI drop? It is insane!', sender: 'ai', timestamp: new Date() }]
  }
];

const MOCK_ACTIVITIES: ActivityItem[] = [
  { id: 'a1', type: 'like', user: { name: 'techie_bot', avatar: 'https://picsum.photos/seed/tech/200/200' }, time: '2h', content: 'liked your photo.' },
  { id: 'a2', type: 'follow', user: { name: 'art_lover', avatar: 'https://picsum.photos/seed/art/200/200' }, time: '4h' },
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [threads, setThreads] = useState<UserProfile[]>(INITIAL_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>(MOCK_ACTIVITIES);
  const [isTyping, setIsTyping] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeThread = useMemo(() => 
    threads.find(t => t.id === activeThreadId) || threads[0], 
  [threads, activeThreadId]);

  useEffect(() => {
    if (scrollRef.current && view === 'CHAT') {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeThread.messages, isTyping, view]);

  const handleSaveSettings = (updated: UserProfile) => {
    setThreads(prev => prev.map(t => t.id === updated.id ? updated : t));
    setIsSettingsOpen(false);
    
    const newInstruction = `Your name is ${updated.name}. You are chatting on ${updated.theme}.
    Language: ${updated.language}. 
    Personality: ${updated.personality}. 
    Adopt the slang and vibe of ${updated.theme}.`;
    
    geminiService.updateSystemInstruction(newInstruction);
  };

  const addMockChat = () => {
    const id = `mock-${Date.now()}`;
    const names = ['Luna', 'Max', 'Sophie', 'Bram', 'Emma'];
    const selectedName = names[Math.floor(Math.random() * names.length)];
    const newProfile: UserProfile = {
      id,
      name: selectedName,
      username: `${selectedName.toLowerCase()}_${Math.floor(Math.random() * 100)}`,
      avatar: `https://picsum.photos/seed/${id}/200/200`,
      isOnline: true,
      followers: '1.2k',
      posts: '12',
      personality: 'Random incoming request personality.',
      language: 'Dutch',
      theme: 'instagram',
      lastMessage: 'Hey, heb je even? 📨',
      messages: [{ id: 'm1', text: 'Hey, heb je even? Ik zag je profiel langskomen!', sender: 'ai', timestamp: new Date() }]
    };
    setThreads([newProfile, ...threads]);
  };

  const addActivity = (activity: ActivityItem) => {
    setActivities([activity, ...activities]);
  };

  const createNewChat = () => {
    const newId = `ai-${Date.now()}`;
    const newProfile: UserProfile = {
      id: newId,
      name: 'New Friend',
      username: `user_${Math.floor(Math.random() * 1000)}`,
      avatar: `https://picsum.photos/seed/${newId}/200/200`,
      isOnline: true,
      followers: '0',
      posts: '0',
      personality: 'A new friendly AI.',
      language: 'Dutch',
      theme: 'instagram',
      lastMessage: 'Start a conversation!',
      messages: []
    };
    setThreads([newProfile, ...threads]);
    setActiveThreadId(newId);
    setView('CHAT');
    setIsSettingsOpen(true);
  };

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = { id: Date.now().toString(), text, sender: 'user', timestamp: new Date() };
    
    setThreads(prev => prev.map(t => {
      if (t.id === activeThread.id) {
        return { ...t, messages: [...t.messages, userMessage], lastMessage: text };
      }
      return t;
    }));

    setIsTyping(true);

    try {
      const response = await geminiService.sendMessage(text);
      const aiMessage: Message = { id: (Date.now() + 1).toString(), text: response, sender: 'ai', timestamp: new Date() };
      
      setThreads(prev => prev.map(t => {
        if (t.id === activeThread.id) {
          return { ...t, messages: [...t.messages, aiMessage], lastMessage: response };
        }
        return t;
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const HomeView = () => (
    <div className="flex flex-col h-full bg-black">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-900 bg-black">
        <h1 className="text-2xl font-bold tracking-tighter italic font-serif">Instagram</h1>
        <div className="flex items-center space-x-6 text-xl">
          <button onClick={() => setView('ACTIVITY')} className="relative">
            <i className="fa-regular fa-heart"></i>
            {activities.length > MOCK_ACTIVITIES.length && (
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-black animate-pulse"></div>
            )}
          </button>
          <button onClick={() => setView('DMS')}>
            <i className="fa-brands fa-facebook-messenger"></i>
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4">
        <div className="flex p-4 space-x-4 border-b border-zinc-900 overflow-x-auto scrollbar-hide">
          <div className="flex flex-col items-center space-y-1">
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
              <div className="w-full h-full rounded-full border-2 border-black overflow-hidden bg-zinc-800">
                <img src="https://picsum.photos/seed/me/100/100" alt="me" />
              </div>
            </div>
            <span className="text-[10px] text-zinc-400">Your Story</span>
          </div>
          {threads.slice(0, 5).map(t => (
            <div key={t.id} className="flex flex-col items-center space-y-1">
              <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
                <div className="w-full h-full rounded-full border-2 border-black overflow-hidden">
                  <img src={t.avatar} alt={t.name} />
                </div>
              </div>
              <span className="text-[10px] text-zinc-400">{t.username}</span>
            </div>
          ))}
        </div>

        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-3">
            <div className="flex items-center justify-between px-3">
              <div className="flex items-center space-x-2">
                <img src={`https://picsum.photos/seed/user${i}/100/100`} className="w-8 h-8 rounded-full" alt="" />
                <span className="text-sm font-bold">user_trending_{i}</span>
              </div>
              <i className="fa-solid fa-ellipsis"></i>
            </div>
            <img src={`https://picsum.photos/seed/post${i}/600/600`} className="w-full aspect-square object-cover" alt="" />
            <div className="px-3 space-y-2">
              <div className="flex items-center justify-between text-xl">
                <div className="flex items-center space-x-4">
                  <i className="fa-regular fa-heart"></i>
                  <i className="fa-regular fa-comment"></i>
                  <i className="fa-regular fa-paper-plane"></i>
                </div>
                <i className="fa-regular fa-bookmark"></i>
              </div>
              <p className="text-sm font-bold">1,234 likes</p>
              <p className="text-sm"><span className="font-bold mr-2">user_trending_{i}</span>Exploring the future with AI... #tech #vibes</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-around py-3 border-t border-zinc-900 bg-black">
        <button onClick={() => setView('HOME')}><i className={`fa-solid fa-house text-xl ${view === 'HOME' ? 'text-white' : 'text-zinc-500'}`}></i></button>
        <i className="fa-solid fa-magnifying-glass text-xl text-zinc-500"></i>
        <i className="fa-regular fa-square-plus text-xl text-zinc-500"></i>
        <i className="fa-solid fa-clapperboard text-xl text-zinc-500"></i>
        <img src="https://picsum.photos/seed/me/100/100" className="w-7 h-7 rounded-full border border-zinc-700" alt="" />
      </div>
    </div>
  );

  const ActivityView = () => (
    <div className="flex flex-col h-full bg-black">
      <div className="flex items-center px-4 py-3 border-b border-zinc-900">
        <button onClick={() => setView('HOME')} className="text-xl mr-6"><i className="fa-solid fa-arrow-left"></i></button>
        <h2 
          className="text-xl font-bold cursor-pointer select-none active:opacity-50" 
          onDoubleClick={() => setIsActivityModalOpen(true)}
          title="Double click to configure activity"
        >
          Activity
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 scrollbar-hide">
        <div className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <i className="fa-solid fa-lock text-zinc-500"></i>
             <span className="text-xs font-semibold text-zinc-400">Account is Private</span>
          </div>
          <span className="text-[10px] text-zinc-600">Only followers can see your posts</span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Follow Requests</h3>
            <span className="text-blue-500 text-sm font-bold">See All</span>
          </div>
          <div className="flex items-center justify-between group cursor-pointer" onDoubleClick={() => setIsActivityModalOpen(true)}>
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
                <i className="fa-solid fa-user-plus text-xl text-white"></i>
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Follow Requests</span>
                <span className="text-sm text-zinc-500">Approve or ignore requests</span>
              </div>
            </div>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        </div>
        
        <div className="space-y-4 pb-20">
          <h3 className="font-bold">New</h3>
          {activities.length === 0 && (
            <p className="text-zinc-500 text-sm text-center py-10 italic">No new activity. Double click the title to add some!</p>
          )}
          {activities.map(a => (
            <div key={a.id} className="flex items-center justify-between animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <img src={a.user.avatar} className="w-11 h-11 rounded-full border border-zinc-800 object-cover" alt="" />
                <p className="text-sm truncate">
                  <span className="font-bold">{a.user.name}</span> {a.content || (a.type === 'follow' ? 'started following you.' : a.type === 'request' ? 'requested to follow you.' : '')}
                  <span className="text-zinc-500 ml-1">{a.time}</span>
                </p>
              </div>
              {(a.type === 'follow' || a.type === 'request') ? (
                <div className="flex space-x-2 shrink-0 ml-2">
                  <button 
                    onClick={() => setActivities(prev => prev.filter(x => x.id !== a.id))}
                    className="bg-blue-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold"
                  >
                    Confirm
                  </button>
                  <button 
                    onClick={() => setActivities(prev => prev.filter(x => x.id !== a.id))}
                    className="bg-zinc-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <img src="https://picsum.photos/seed/post1/100/100" className="w-11 h-11 rounded object-cover border border-zinc-800 shrink-0 ml-2" alt="" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const DMListView = () => (
    <div className="flex flex-col h-full bg-black">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-900">
        <div className="flex items-center space-x-8">
          <button onClick={() => setView('HOME')} className="text-xl"><i className="fa-solid fa-arrow-left"></i></button>
          <span 
            className="text-xl font-bold cursor-pointer select-none active:opacity-50" 
            onDoubleClick={addMockChat}
            title="Double click to add mock chat"
          >
            Direct
          </span>
        </div>
        <div className="flex items-center space-x-6 text-xl">
          <i className="fa-solid fa-video"></i>
          <button onClick={createNewChat} className="text-blue-500"><i className="fa-solid fa-pen-to-square"></i></button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="bg-zinc-900 rounded-xl flex items-center px-3 py-2 space-x-3 border border-zinc-800 focus-within:border-zinc-700 transition-colors">
          <i className="fa-solid fa-magnifying-glass text-zinc-500"></i>
          <input type="text" placeholder="Search" className="bg-transparent outline-none text-sm w-full placeholder-zinc-500" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="font-bold">Messages</span>
          <span className="text-blue-500 font-semibold text-sm">Requests ({threads.length > 2 ? threads.length - 2 : 1})</span>
        </div>
        <div className="space-y-1">
          {threads.map(t => (
            <div 
              key={t.id} 
              onClick={() => { setActiveThreadId(t.id); setView('CHAT'); }}
              className="flex items-center px-4 py-3 space-x-3 hover:bg-zinc-900/50 transition-colors cursor-pointer group"
            >
              <div className="relative shrink-0">
                <img src={t.avatar} className="w-14 h-14 rounded-full border border-zinc-800 object-cover" alt="" />
                {t.isOnline && <div className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-green-500 border-4 border-black rounded-full"></div>}
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <span className="font-semibold text-white truncate">{t.name}</span>
                <span className={`text-sm truncate ${t.id.startsWith('mock') ? 'text-white font-bold' : 'text-zinc-500'}`}>
                  {t.lastMessage} · {t.id.includes('mock') ? 'Just now' : '2h'}
                </span>
              </div>
              <i className="fa-solid fa-camera text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity"></i>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ChatView = () => (
    <div className={`flex flex-col h-full relative ${activeThread.theme === 'whatsapp' ? 'whatsapp-bg' : 'bg-black'}`}>
      <ChatHeader 
        profile={activeThread} 
        onOpenSettings={() => setIsSettingsOpen(true)} 
        onBack={() => setView('DMS')} 
      />
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide flex flex-col space-y-2">
        {activeThread.theme === 'instagram' && (
          <div className="flex flex-col items-center justify-center py-8 mb-4 cursor-pointer hover:bg-zinc-900/20 rounded-xl transition-colors" onClick={() => setIsSettingsOpen(true)}>
            <img src={activeThread.avatar} className="w-20 h-20 rounded-full border border-zinc-700 mb-3 object-cover shadow-lg" alt="Avatar" />
            <h2 className="text-xl font-bold text-white">{activeThread.name}</h2>
            <p className="text-sm text-zinc-500">@{activeThread.username} · Instagram</p>
            <p className="text-xs text-zinc-500 mt-1">{activeThread.followers} followers · {activeThread.posts} posts</p>
            <button className="mt-4 px-6 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-bold transition-colors">View Profile</button>
          </div>
        )}

        {activeThread.messages.map((msg, index) => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            theme={activeThread.theme}
            isFirst={index === 0 || activeThread.messages[index - 1].sender !== msg.sender}
            isLast={index === activeThread.messages.length - 1 || activeThread.messages[index + 1].sender !== msg.sender}
          />
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 mt-2">
            <div className={`${activeThread.theme === 'whatsapp' ? 'bg-[#202c33]' : 'bg-zinc-800'} px-4 py-3 rounded-2xl`}>
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <MessageInput onSendMessage={handleSendMessage} isTyping={isTyping} theme={activeThread.theme} />
    </div>
  );

  return (
    <div className="h-screen w-screen bg-[#121212] flex items-center justify-center p-0 md:p-4 font-sans antialiased">
      <div className="w-full h-full max-w-md bg-black shadow-2xl relative overflow-hidden border-x border-zinc-900 rounded-none md:rounded-[40px] flex flex-col">
        {view === 'HOME' && <HomeView />}
        {view === 'ACTIVITY' && <ActivityView />}
        {view === 'DMS' && <DMListView />}
        {view === 'CHAT' && <ChatView />}

        {isSettingsOpen && (
          <SettingsModal 
            profile={activeThread} 
            onSave={handleSaveSettings} 
            onClose={() => setIsSettingsOpen(false)} 
          />
        )}

        {isActivityModalOpen && (
          <ActivityModal 
            onAdd={addActivity} 
            onClose={() => setIsActivityModalOpen(false)} 
          />
        )}
      </div>
    </div>
  );
};

export default App;
