import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const lastMessageTimestampRef = useRef(null);
  const intervalRef = useRef(null);
  const isInitialLoadRef = useRef(true);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const fetchInitialMessages = useCallback(async () => {
    if (!conversation?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchMessages(conversation.id);
      const sortedMessages = [...data].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      
      setMessages(sortedMessages);
      
      if (sortedMessages.length > 0) {
        lastMessageTimestampRef.current = sortedMessages[sortedMessages.length - 1].created_at;
      }
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error fetching initial messages:', err);
    } finally {
      setIsLoading(false);
    }
  }, [conversation?.id]);

  const fetchNewMessages = useCallback(async () => {
    if (!conversation?.id || !lastMessageTimestampRef.current) return;
    
    try {
      const data = await fetchMessages(conversation.id, lastMessageTimestampRef.current);
      
      if (data.length > 0) {
        const sortedMessages = [...data].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        
        setMessages(prevMessages => {
          // Prevent duplicates by checking if message already exists
          const existingIds = new Set(prevMessages.map(msg => msg.id));
          const newMessages = sortedMessages.filter(msg => !existingIds.has(msg.id));
          
          if (newMessages.length > 0) {
            lastMessageTimestampRef.current = sortedMessages[sortedMessages.length - 1].created_at;
            return [...prevMessages, ...newMessages];
          }
          
          return prevMessages;
        });
      }
    } catch (err) {
      console.error('Error fetching new messages:', err);
      // Don't set error state for polling failures to avoid UI disruption
    }
  }, [conversation?.id]);

  // Handle conversation changes and initial load
  useEffect(() => {
    // Clear previous state when conversation changes
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setMessages([]);
    setError(null);
    lastMessageTimestampRef.current = null;
    isInitialLoadRef.current = true;

    if (conversation?.id) {
      fetchInitialMessages();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [conversation?.id, fetchInitialMessages]);

  // Handle refresh flag changes
  useEffect(() => {
    if (refreshFlag && conversation?.id) {
      fetchInitialMessages();
    }
  }, [refreshFlag, fetchInitialMessages]);

  // Set up polling for new messages after initial load
  useEffect(() => {
    if (!isLoading && messages.length > 0 && conversation?.id) {
      intervalRef.current = setInterval(fetchNewMessages, 3000);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isLoading, messages.length, conversation?.id, fetchNewMessages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      // Only auto-scroll if this is the initial load or if user is near bottom
      if (isInitialLoadRef.current) {
        scrollToBottom();
        isInitialLoadRef.current = false;
      } else {
        // Check if user is near bottom before auto-scrolling
        const container = messagesEndRef.current?.parentElement?.parentElement;
        if (container) {
          const { scrollTop, scrollHeight, clientHeight } = container;
          const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
          
          if (isNearBottom) {
            scrollToBottom();
          }
        }
      }
    }
  }, [messages, scrollToBottom]);

  if (error) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center bg-[#f9fafb]">
        <div className="text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <button 
            onClick={fetchInitialMessages}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#f9fafb] custom-scrollbar">
      {isLoading && messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading messages...</div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => {
            const isCurrentUser = msg.sender_id === currentUserId;
            return (
              <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} message-appear`}>
                <div className={`
                  max-w-[70%] p-3 rounded-2xl shadow-md message-bubble transition-all duration-200
                  ${isCurrentUser
                    ? 'bg-iti-gradient text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}
                `}>
                  <p className="whitespace-pre-line">{msg.body}</p>
                  <p className={`text-xs text-right mt-1 ${isCurrentUser ? 'text-gray-300' : 'text-gray-400'}`}>
                    {formatTime(msg.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}