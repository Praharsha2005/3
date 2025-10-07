'use client';

import { useState } from 'react';
import { useChat, Message } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import ChatBox from '../components/ChatBox';

export default function ChatPage() {
  const { conversations } = useChat();
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [selectedParticipantName, setSelectedParticipantName] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to access the chat.</p>
        </div>
      </div>
    );
  }

  const conversationParticipants = Object.keys(conversations);

  // Function to get participant name (in a real app, this would come from user data)
  const getParticipantName = (_participantId: string) => {
    // For now, we'll use a simple approach
    // In a real app, you would fetch user data based on participantId
    if (user) {
      if (user.userType === 'student') {
        // Student user - other participants are business professionals
        return 'Business Professional';
      } else {
        // Business user - other participants are students
        return 'Student Inventor';
      }
    }
    return 'Unknown User';
  };

  // Function to get the last message content
  const getLastMessage = (conversation: Message[]) => {
    if (conversation.length === 0) return '';
    const lastMessage = conversation[conversation.length - 1];
    return lastMessage.content.length > 30 
      ? lastMessage.content.substring(0, 30) + '...' 
      : lastMessage.content;
  };

  // Function to get formatted time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h1 className="text-3xl font-bold p-6 border-b">Messages</h1>
        
        {conversationParticipants.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-500 text-2xl">💬</span>
            </div>
            <p className="text-gray-500 text-lg">No conversations yet</p>
            <p className="text-gray-400 mt-2">Start a conversation from a project page or collaboration hub</p>
          </div>
        ) : (
          <div className="flex h-[calc(100vh-200px)]">
            {/* Conversations List */}
            <div className="w-1/3 border-r bg-gray-50 overflow-hidden">
              <div className="p-3 bg-white border-b">
                <h2 className="font-bold text-lg">Chats</h2>
              </div>
              <div className="overflow-y-auto h-full">
                {conversationParticipants.map(participantId => {
                  const conversation = conversations[participantId];
                  const lastMessage = conversation[conversation.length - 1];
                  const participantName = getParticipantName(participantId);
                  
                  // Get unread count for this conversation
                  const unreadCount = conversation.filter(
                    msg => msg.recipientId === user.id && !msg.read
                  ).length;
                  
                  return (
                    <div 
                      key={participantId}
                      className={`p-3 border-b cursor-pointer hover:bg-gray-100 flex items-center ${
                        selectedConversation === participantId ? 'bg-green-50 border-l-4 border-l-green-500' : 'bg-white'
                      }`}
                      onClick={() => {
                        setSelectedConversation(participantId);
                        setSelectedParticipantName(participantName);
                      }}
                    >
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-gray-500 text-sm">
                          {user.userType === 'student' ? '💼' : '🎓'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="font-medium truncate">{participantName}</span>
                          <span className="text-xs text-gray-500">
                            {formatTime(lastMessage.timestamp)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-gray-600 truncate">
                            {getLastMessage(conversation)}
                          </p>
                          {unreadCount > 0 && (
                            <span className="bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 ml-2">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Chat Box */}
            <div className="w-2/3 flex flex-col">
              {selectedConversation && selectedParticipantName ? (
                <ChatBox 
                  participantId={selectedConversation} 
                  participantName={selectedParticipantName} 
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 bg-gray-100">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-4">
                    <span className="text-gray-500 text-2xl">💬</span>
                  </div>
                  <p className="text-xl mb-2">Welcome to Sciencify Chat</p>
                  <p className="text-gray-400">Select a chat to start messaging</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}