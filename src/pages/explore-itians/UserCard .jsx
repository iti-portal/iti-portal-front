// src/components/Explore/UserCard.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createConnection } from '../../services/usersApi';
import { Send, UserCheck } from 'lucide-react';
import { REACT_APP_API_ASSET_URL } from '../../services/apiConfig'; // Adjust the import path as necessary

const UserCard = ({ user, onConnectionSuccess, currentUser }) => {
  const navigate = useNavigate();
  const [connectionStatus, setConnectionStatus] = useState('idle'); // 'idle', 'connecting', 'sent'

  const handleProfileClick = () => {
    // This is the key line. It navigates to the specific user's profile page.
    navigate(`/profile/${user.id}`);
  };

  const handleConnect = async (e) => {
    // Stop the click from navigating to the profile page
    e.stopPropagation(); 
    
    setConnectionStatus('connecting');
    try {
      const message = `Hi ${user.first_name}! I'd like to connect with you.`;
      await createConnection(user.id, message);
      
      toast.success(`Connection request sent to ${user.first_name}!`);

      setConnectionStatus('sent');
      
      setTimeout(() => {
        if (onConnectionSuccess) {
          onConnectionSuccess(user.id);
        }
      }, 1500);

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send connection request.';
      toast.error(errorMessage);
      setConnectionStatus('idle');
    }
  };

  const isCurrentUserCompany = currentUser?.role === 'company';

  return (
    <div 
      className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 overflow-hidden group transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl cursor-pointer h-full"
      onClick={handleProfileClick} // Clicking anywhere on the card works
    >
      <div className="p-6 flex flex-col items-center text-center">
        {/* Avatar with Gradient Ring */}
        <div className="relative mb-4">
          <div className="p-1 rounded-full bg-gradient-to-tr from-[#901b20] to-[#203947] shadow-md">
            <img 
              src={`${REACT_APP_API_ASSET_URL}/` + user.image}
              alt={`${user.first_name} ${user.last_name}`}
              className="w-24 h-24 rounded-full object-cover border-4 border-white"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=901b20&color=fff&size=150`;
                e.target.onerror = null;
              }}
            />
          </div>
        </div>

        {/* User Info */}
        <h3 className="font-bold text-gray-800 text-lg group-hover:text-[#901b20] transition-colors">
          {user.first_name} {user.last_name}
        </h3>
        <p className="text-sm text-gray-600 font-medium">{user.track}</p>
        {user.intake && (
          <p className="text-xs text-gray-500 mt-1">Intake {user.intake}</p>
        )}
        
        {user.mutualConnections > 0 && (
          <p className="text-xs text-gray-500 mt-3 bg-gray-100 px-2 py-0.5 rounded-full">
            {user.mutualConnections} mutual connection{user.mutualConnections > 1 ? 's' : ''}
          </p>
        )}

        {/* Action Buttons */}
        <div className="w-full mt-6 space-y-2">
          {!isCurrentUserCompany && (
            <button 
              onClick={handleConnect}
              disabled={connectionStatus !== 'idle'}
              className={`w-full flex items-center justify-center py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md transform hover:scale-105
                ${connectionStatus === 'idle' ? 'bg-gradient-to-r from-[#901b20] to-[#a83236] text-white hover:shadow-lg' : ''}
                ${connectionStatus === 'connecting' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : ''}
                ${connectionStatus === 'sent' ? 'bg-green-100 text-green-700 cursor-default' : ''}
              `}
            >
              {connectionStatus === 'idle' && <><Send size={16} className="mr-2" /> Connect</>}
              {connectionStatus === 'connecting' && 'Sending...'}
              {connectionStatus === 'sent' && <><UserCheck size={16} className="mr-2" /> Request Sent</>}
            </button>
          )}

          {/* FIX: Add the onClick handler directly to the button */}
          <button 
            onClick={handleProfileClick}
            className="w-full py-2 px-4 rounded-lg text-sm font-semibold border border-gray-300 text-gray-700 bg-white/50 hover:border-[#901b20] hover:text-[#901b20] transition-all duration-300"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;