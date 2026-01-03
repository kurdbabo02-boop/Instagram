
export type ChatTheme = 'instagram' | 'whatsapp' | 'snapchat';
export type ViewState = 'HOME' | 'DMS' | 'CHAT' | 'ACTIVITY';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'read';
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  followers?: string;
  posts?: string;
  personality?: string;
  language?: string;
  theme: ChatTheme;
  lastMessage?: string;
  messages: Message[];
}

export interface ActivityItem {
  id: string;
  type: 'like' | 'follow' | 'comment' | 'request';
  user: {
    name: string;
    avatar: string;
  };
  time: string;
  content?: string;
}
