import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createConnection } from '../../services/usersApi';

const UserCard = ({ user, onConnectionSuccess, currentUser }) => {  // Add currentUser prop
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);  // New state to track connection status

  const handleProfileClick = () => {
    navigate(`/profile/${user.id}`);
  };

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      const message = `Hi ${user.first_name}! I'd like to connect with you.`;
      await createConnection(user.id, message);
      
      toast.success(`Connection request sent to ${user.first_name}!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setIsConnected(true);  // Set connection status to true
      if (onConnectionSuccess) {
        onConnectionSuccess(user.id);  // Notify parent component
      }
    } catch (error) {
      console.error('Connection error:', error);
      let errorMessage = 'Failed to send connection request';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Return null if connection was successful to hide the card
  if (isConnected) {
    return null;
  }

  // Check if current logged-in user is a company
  const isCurrentUserCompany = currentUser?.user_type === 'company' || 
                              currentUser?.type === 'company' || 
                              currentUser?.role === 'company' || 
                              currentUser?.account_type === 'company' ||
                              currentUser?.userType === 'company' ||
                              currentUser?.is_company === true ||
                              currentUser?.isCompany === true;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      {/* Cover image */}
      <div className="h-20 bg-gradient-to-r from-[#901b20] to-[#d1252b] relative">
        {/* Profile image */}
        <div className="absolute -bottom-8 left-4">
          <div className="w-16 h-16 rounded-full border-4 border-white bg-white overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
            <img 
              src={user.image || `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=901b20&color=fff&size=150`}
              alt={`${user.first_name} ${user.last_name}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=901b20&color=fff&size=150`;
                e.target.onerror = null;
              }}
            />
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="pt-10 pb-4 px-4">
        {/* Name and title */}
        <div className="mb-3">
          <h3 
            className="font-semibold text-gray-900 text-lg hover:text-[#901b20] cursor-pointer transition-colors"
            onClick={handleProfileClick}
          >
            {user.first_name} {user.last_name}
          </h3>
          <p className="text-gray-600 text-sm">
            {user.track}
          </p>
          {user.intake && (
            <p className="text-gray-500 text-xs mt-1">
              Intake {user.intake}
            </p>
          )}
        </div>
        
        {/* Mutual connections */}
        {user.mutualConnections > 0 && (
          <p className="text-xs text-gray-500 mb-3">
            {user.mutualConnections === 1 
              ? '1 mutual connection' 
              : `${user.mutualConnections} mutual connections`}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex space-x-2">
          {/* Only show connect button if current logged-in user is not a company */}
          {!isCurrentUserCompany && (
            <button 
              onClick={handleConnect}
              disabled={isConnecting}
              className={`flex-1 bg-[#901b20] text-white py-1.5 px-3 rounded-md text-sm font-medium hover:bg-[#7a1619] transition-colors duration-200 shadow-sm hover:shadow-md ${
                isConnecting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isConnecting ? 'Sending...' : 'Connect'}
            </button>
          )}
          <button 
            onClick={handleProfileClick}
            className={`border border-gray-300 text-gray-700 py-1.5 px-3 rounded-md text-sm font-medium hover:border-[#901b20] hover:text-[#901b20] transition-colors duration-200 ${
              isCurrentUserCompany ? 'flex-1' : 'flex-1'
            }`}
          >
            Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;