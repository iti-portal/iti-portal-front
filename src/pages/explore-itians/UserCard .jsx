import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserCard = ({ user }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/profile/${user.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-4 border-gray-100">
        <img 
          src={user.image} 
          alt={`${user.first_name} ${user.last_name}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=901b20&color=fff&size=150`;
          }}
        />
      </div>
      
      <h3 className="font-semibold text-lg text-gray-900 mb-1">
        {user.first_name} {user.last_name}
      </h3>
      
      <p className="text-gray-600 text-sm mb-2">@{user.username}</p>
      
      <div className="text-xs text-gray-500 mb-4 space-y-1">
        <p>Intake {user.intake} • {user.track}</p>
        <p>{user.program?.toUpperCase()} • {user.branch}</p>
      </div>
      
      <div className="flex space-x-2 w-full">
        <button className="flex-1 bg-[#901b20] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#7a1619] transition-colors">
          Connect
        </button>
        <button 
          onClick={handleProfileClick}
          className="flex-1 border border-[#901b20] text-[#901b20] px-4 py-2 rounded text-sm font-medium hover:bg-[#901b20] hover:text-white transition-colors"
        >
          Profile
        </button>
      </div>
    </div>
  );
};

export default UserCard;