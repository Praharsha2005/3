'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface ChatContextType {
  messages: Message[];
  conversations: { [key: string]: Message[] }; // key is conversationId (studentId-businessId)
  sendMessage: (recipientId: string, content: string) => void;
  getConversation: (participantId: string) => Message[];
  markAsRead: (messageId: string) => void;
  getUnreadCount: (participantId: string) => number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Load messages from localStorage on initial load
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsedMessages.map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Error parsing stored messages:', error);
        localStorage.removeItem('chatMessages');
      }
    }
  }, []);

  useEffect(() => {
    // Save messages to localStorage whenever they change
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = (recipientId: string, content: string) => {
    if (!user) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      recipientId,
      content,
      timestamp: new Date(),
      read: false,
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const getConversation = (participantId: string) => {
    if (!user) return [];
    
    return messages
      .filter(msg => 
        (msg.senderId === user.id && msg.recipientId === participantId) ||
        (msg.senderId === participantId && msg.recipientId === user.id)
      )
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );
  };

  const getUnreadCount = (participantId: string) => {
    if (!user) return 0;
    
    return messages.filter(msg => 
      msg.recipientId === user.id && 
      msg.senderId === participantId && 
      !msg.read
    ).length;
  };

  // Group messages by conversation
  const conversations: { [key: string]: Message[] } = {};
  if (user) {
    messages.forEach(msg => {
      const otherParticipantId = msg.senderId === user.id ? msg.recipientId : msg.senderId;
      if (!conversations[otherParticipantId]) {
        conversations[otherParticipantId] = [];
      }
      conversations[otherParticipantId].push(msg);
    });
    
    // Sort each conversation by timestamp
    Object.keys(conversations).forEach(participantId => {
      conversations[participantId].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    });
  }

  const value = {
    messages,
    conversations,
    sendMessage,
    getConversation,
    markAsRead,
    getUnreadCount,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}