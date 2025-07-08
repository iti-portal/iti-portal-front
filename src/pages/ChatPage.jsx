import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';
import { useAuth } from '../contexts/AuthContext';

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const { user } = useAuth();
  const currentUserId = user ? user.id : null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
      />

      <div className="flex flex-col flex-1 bg-gray-50">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b bg-white shadow-sm">
              {selectedConversation.participant_avatar ? (
                <img
                  src={selectedConversation.participant_avatar}
                  alt={selectedConversation.participant_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-white">
                  {selectedConversation.participant_name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
              )}
              <h2 className="text-lg font-semibold text-gray-800">
                {selectedConversation.participant_name}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <ChatWindow
                conversation={selectedConversation}
                currentUserId={currentUserId}
                refreshFlag={refreshFlag}
              />
            </div>

            <div className="border-t bg-white">
              <MessageInput
                receiverId={selectedConversation.receiver_id}
                onSend={() => setRefreshFlag(f => !f)}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-400">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-[color:var(--iti-primary)] p-6 mb-4 shadow">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#fff">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 21l1.8-4A7.963 7.963 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome to ITI Chat</h2>
              <p className="text-gray-500">Select a user to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
