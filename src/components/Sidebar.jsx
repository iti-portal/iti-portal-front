import React, { useEffect, useState } from 'react';
import { fetchConnections, fetchConversations, startConversation } from '../services/chatService';
import { API_BASE_URL } from '../services/apiConfig';

const getInitials = (name) => {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
};

export default function Sidebar({ selectedConversation, onSelectConversation }) {
  const [connections, setConnections] = useState([]);
  const [conversations, setConversations] = useState([]);
  const currentUserId = Number(localStorage.getItem('user_id'));

  useEffect(() => {
    const loadData = async () => {
      const conn = await fetchConnections();
      const conv = await fetchConversations();
      setConnections(conn);
      setConversations(conv);
    };
    loadData();
  }, []);

  const getLastMessage = (userId) => {
    const convo = conversations.find(c =>
      (c.user_one_id === currentUserId && c.user_two?.id === userId) ||
      (c.user_two_id === currentUserId && c.user_one?.id === userId)
    );
    if (!convo || !Array.isArray(convo.messages) || convo.messages.length === 0) return null;
    return convo.messages[0];
  };

  const handleStartChat = async (user) => {
    const convo = await startConversation(user.id);
    onSelectConversation({
      ...convo,
      receiver_id: user.id,
      participant_name: user.full_name,
      participant_avatar: user.profile?.profile_picture
        ? `${API_BASE_URL}/storage/${user.profile.profile_picture}`
        : null,
    });
  };

  return (
    <aside className="w-80 bg-white border-r p-4 overflow-y-auto custom-scrollbar">
      <h2 className="text-xl font-bold text-[color:var(--iti-primary)] mb-4">Contacts</h2>
      <ul className="space-y-3">
        {connections.map(conn => {
          const user = conn.user;
          const profilePic = user.profile?.profile_picture
            ? `${API_BASE_URL}/storage/${user.profile.profile_picture}`
            : null;
          const lastMessage = getLastMessage(user.id);
          const isSentByMe = lastMessage?.sender_id === currentUserId;
          const isSelected = selectedConversation?.receiver_id === user.id;

          return (
            <li
              key={user.id}
              onClick={() => handleStartChat(user)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md ${
                isSelected ? 'bg-[color:var(--iti-secondary)]' : 'hover:bg-gray-50'
              }`}
            >
              {profilePic ? (
                <img src={profilePic} alt={user.full_name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[color:var(--iti-primary)] text-white flex items-center justify-center font-semibold">
                  {getInitials(user.full_name)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800 truncate">
                    {user.full_name}
                  </span>
                  {lastMessage && (
                    <span className="text-xs text-gray-400">
                      {formatDate(lastMessage.created_at)}
                    </span>
                  )}
                </div>
                {lastMessage && (
                  <div className="text-sm text-gray-500 truncate">
                    {isSentByMe ? 'You: ' : ''}
                    {lastMessage.body}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
