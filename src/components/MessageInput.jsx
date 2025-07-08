import React, { useState, useRef } from 'react';
import { sendMessage } from '../services/chatService';

export default function MessageInput({ receiverId, onSend }) {
  const [body, setBody] = useState('');
  const textareaRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;

    try {
      await sendMessage({ receiver_id: receiverId, body });
      setBody('');
      onSend();
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleChange = (e) => {
    setBody(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <form onSubmit={handleSend} className="bg-white border-t px-4 py-3 flex items-end gap-3 shadow-sm">
      <textarea
        ref={textareaRef}
        value={body}
        onChange={handleChange}
        rows={1}
        placeholder="Type your message..."
        className="flex-1 text-base resize-none p-2 rounded-lg border focus:outline-none focus:ring bg-gray-50 shadow-inner transition"
        maxLength={500}
      />
      <button
        type="submit"
        disabled={!body.trim()}
        className="bg-[color:var(--iti-primary)] hover:bg-[color:var(--iti-primary-dark)] text-white px-4 py-2 rounded-xl shadow transition disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}
