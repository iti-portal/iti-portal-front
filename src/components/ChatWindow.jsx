// import React, { useEffect, useRef, useState } from 'react';
// import { fetchMessages } from '../services/chatService';

// function formatTime(dateStr) {
//   const date = new Date(dateStr);
//   return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// }

// export default function ChatWindow({ conversation, currentUserId, refreshFlag }) {
//   const [messages, setMessages] = useState([]);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     if (conversation && conversation.id) {
//       fetchMessages(conversation.id).then(data => {
//         const sortedMessages = [...data].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
//         setMessages(sortedMessages);
//       });
//     }
//   }, [conversation, refreshFlag]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   return (
//     <div className="flex-1 p-6 overflow-y-auto bg-[#f9fafb] custom-scrollbar">
//       <div className="space-y-4">
//         {messages.map((msg) => {
//           const isCurrentUser = msg.sender_id === currentUserId;
//           return (
//             <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} animate-slide-down`}>
//               <div className={`max-w-[70%] p-3 rounded-2xl shadow ${isCurrentUser 
//                   ? 'bg-[color:var(--iti-primary)] text-white rounded-br-none' 
//                   : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}`}>
//                 <p className="whitespace-pre-line">{msg.body}</p>
//                 <p className="text-xs text-right text-gray-400 mt-1">{formatTime(msg.created_at)}</p>
//               </div>
//             </div>
//           );
//         })}
//         <div ref={messagesEndRef} />
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useRef, useState } from 'react';
import { fetchMessages } from '../services/chatService';

function getInitials(name) {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatWindow({ conversation, currentUserId, refreshFlag }) {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversation && conversation.id) {
      fetchMessages(conversation.id).then(data => {
        const sortedMessages = [...data].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        setMessages(sortedMessages);
      });
    }
  }, [conversation, refreshFlag]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#f9fafb] custom-scrollbar">
      <div className="space-y-4">
        {messages.map((msg) => {
          const isCurrentUser = msg.sender_id === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} animate-slide-down`}>
              <div className={`
                max-w-[70%] p-3 rounded-2xl shadow 
                ${isCurrentUser
                  ? 'bg-[color:var(--iti-primary)] text-white rounded-br-none'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}
              `}>
                <p className="whitespace-pre-line">{msg.body}</p>
                <p className="text-xs text-right text-gray-400 mt-1">{formatTime(msg.created_at)}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
