'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';

export default function ChatBox({ participantId, participantName }: { participantId: string; participantName: string }) {
  const { sendMessage, getConversation, markAsRead } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const conversation = getConversation(participantId);

  useEffect(() => {
    // Mark all messages from this participant as read
    conversation
      .filter(msg => msg.senderId === participantId && !msg.read)
      .forEach(msg => markAsRead(msg.id));
  }, [conversation, participantId, markAsRead]);

  useEffect(() => {
    // Scroll to bottom of chat
    scrollToBottom();
  }, [conversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      sendMessage(participantId, newMessage.trim());
      setNewMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = '40px';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Group messages by date
  const groupedMessages: { [date: string]: any[] } = {};
  conversation.forEach(message => {
    const dateKey = new Date(message.timestamp).toDateString();
    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = [];
    }
    groupedMessages[dateKey].push(message);
  });

  return (
    <div className="flex flex-col h-96 border rounded-lg bg-white">
      <div className="bg-green-600 text-white p-3 rounded-t-lg flex items-center">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center mr-3">
          <span className="text-gray-500 text-xs">👤</span>
        </div>
        <div>
          <h3 className="font-bold">{participantName}</h3>
          <p className="text-xs text-green-200">online</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 bg-gray-100">
        {conversation.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-4">
              <span className="text-gray-500 text-2xl">💬</span>
            </div>
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Send a message to start the conversation</p>
          </div>
        ) : (
          <div className="space-y-2">
            {Object.entries(groupedMessages).map(([date, messages]) => (
              <div key={date}>
                <div className="flex justify-center my-4">
                  <span className="bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded">
                    {formatDate(new Date(date))}
                  </span>
                </div>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex mb-2 ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === user?.id
                          ? 'bg-green-100 text-gray-800 rounded-br-none'
                          : 'bg-white text-gray-800 rounded-bl-none'
                      }`}
                    >
                      {message.senderId !== user?.id && (
                        <p className="text-xs font-bold text-green-600 mb-1">{message.senderName}</p>
                      )}
                      <p className="break-words">{message.content}</p>
                      <p
                        className={`text-xs mt-1 text-right ${
                          message.senderId === user?.id ? 'text-gray-500' : 'text-gray-400'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <form onSubmit={handleSendMessage} className="p-3 border-t bg-white rounded-b-lg">
        <div className="flex items-end">
          <textarea
            ref={textareaRef}
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            rows={1}
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="ml-2 bg-green-600 hover:bg-green-700 text-white rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}