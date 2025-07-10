import React from 'react';
import { MessageCircle, UserPlus, UserMinus } from 'lucide-react';

const UserCard = ({ user, isConnected, onDisconnect }) => {
  const profile = user.profile || {};
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 bg-gray-200">
        <img 
          src={user.image || `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=901b20&color=fff&size=150`} 
          alt={`${user.first_name} ${user.last_name}`}
          className="w-full h-full object-cover"
        />
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-1">
        {user.first_name} {user.last_name}
      </h3>
      <p className="text-sm text-gray-600 mb-1">
        {profile.track || 'ITI Member'}
      </p>
      <p className="text-xs text-gray-500 mb-1">
        Intake {profile.intake || 'N/A'} • {profile.branch || 'Unknown'}
      </p>
      <p className="text-xs text-gray-400 mb-4">
        Connected since: {new Date(user.connected_at).toLocaleDateString()}
      </p>
      
      <div className="flex gap-2 w-full">
        {isConnected ? (
        <button 
            onClick={() => onDisconnect(user.id)}
            className="flex-1 flex items-center justify-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm py-2 px-4 rounded transition-colors"
        >
            <UserMinus className="w-4 h-4" />
            Remove
        </button>
        ) : (
        <button className="flex-1 flex items-center justify-center gap-1 bg-[#901b20] hover:bg-[#7a1519] text-white text-sm py-2 px-4 rounded transition-colors">
            <UserPlus className="w-4 h-4" />
            Connect
        </button>
        )}

      </div>
    </div>
  );
};

export default React.memo(UserCard);