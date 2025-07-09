import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserCard = ({ user }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/profile/${user.id}`);
  };

  return (
    <div
      className="relative group bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl overflow-hidden"
      style={{ boxShadow: '0 4px 24px 0 rgba(32,57,71,0.07)' }}
    >
      {/* Gradient border ring */}
      <div className="relative mb-4">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#901b20] via-[#fbeee6] to-[#203947] opacity-60 blur-sm scale-110 z-0" />
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md relative z-10">
          <img
            src={user.image}
            alt={`${user.first_name} ${user.last_name}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=901b20&color=fff&size=150`;
            }}
          />
        </div>
      </div>
      <h3 className="font-bold text-xl text-gray-900 mb-1 tracking-tight">
        {user.first_name} {user.last_name}
      </h3>
      <p className="text-[#901b20] text-sm font-medium mb-2">@{user.username}</p>
      <div className="text-xs text-gray-500 mb-4 space-y-1">
        <p>
          <span className="font-semibold text-gray-700">Intake {user.intake}</span>
          <span className="mx-1">•</span>
          <span>{user.track}</span>
        </p>
        <p>
          <span className="font-semibold text-gray-700">{user.program?.toUpperCase()}</span>
          <span className="mx-1">•</span>
          <span>{user.branch}</span>
        </p>
      </div>
      <div className="flex space-x-2 w-full mt-auto">
        <button className="flex-1 bg-[#901b20] bg-gradient-to-br from-[#901b20] to-[#203947] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-[#7a1619] transition-colors">
          Connect
        </button>
        <button
          onClick={handleProfileClick}
          className="flex-1 border border-[#901b20] text-[#901b20] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#901b20] hover:text-white transition-colors shadow-sm"
        >
          Profile
        </button>
      </div>
    </div>
  );
};

export default UserCard;