// src/features/Student/Profile/components/ProfileHeader.js

import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FaLinkedin, FaGithub, FaGlobe, FaWhatsapp, FaEnvelope, FaPhone } from 'react-icons/fa'; // Social media icons
import { IoLocationSharp } from 'react-icons/io5'; // Location icon
import { BsFillCalendarFill } from "react-icons/bs"; // Calendar icon

function ProfileHeader({ data }) {
  const navigate = useNavigate(); 

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options); // For English
  };

  const handleEditProfileClick = () => {
    navigate('/student/profile/edit'); 
  };

  return (
    <div className="relative bg-white rounded-lg shadow-md mb-6 overflow-hidden">
      {/* Cover Photo */}
      <div
        className="w-full h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${data.coverPhoto || 'https://via.placeholder.com/1200x300?text=Cover+Photo'})` }}
      ></div>

      {/* Profile Picture & Basic Info */}
      <div className="p-6 relative">
        <img
          src={data.profilePicture || 'https://via.placeholder.com/150/0000FF/FFFFFF?text=User'}
          alt={`${data.firstName} ${data.lastName}'s Profile`}
          className="w-32 h-32 rounded-full border-4 border-white absolute -top-16 left-6 shadow-md"
        />

        <div className="ml-40 pt-4"> {/* Space for the image */}
          <h1 className="text-3xl font-bold text-gray-900">{data.firstName} {data.lastName}</h1>
          <p className="text-xl text-gray-700 mt-1">{data.title} at {data.company}</p>
          <p className="text-gray-600 flex items-center mt-2">
            <IoLocationSharp className="mr-1 text-gray-500" /> {data.governorate}
          </p>
          <p className="text-gray-600 flex items-center mt-1">
            <BsFillCalendarFill className="mr-1 text-gray-500 text-sm" /> ITI Intake: {data.intake} | Graduation: {formatDate(data.graduationDate)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex space-x-3 justify-end">
          <button
            onClick={handleEditProfileClick} // <-- إضافة دالة النقر هنا
            className="bg-red-700 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out"
          >
            Edit Profile
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out">
            View Resume
          </button>
        </div>

        {/* Social Media Links */}
        <div className="mt-4 border-t pt-4 flex flex-wrap gap-4 text-gray-600">
          {data.linkedin && (
            <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-blue-700 transition duration-200">
              <FaLinkedin className="text-xl mr-1" /> LinkedIn
            </a>
          )}
          {data.github && (
            <a href={data.github} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-gray-900 transition duration-200">
              <FaGithub className="text-xl mr-1" /> GitHub
            </a>
          )}
          {data.portfolioUrl && (
            <a href={data.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-purple-700 transition duration-200">
              <FaGlobe className="text-xl mr-1" /> Portfolio
            </a>
          )}
           {data.whatsapp && (
            <a href={`https://wa.me/${data.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-green-600 transition duration-200">
              <FaWhatsapp className="text-xl mr-1" /> WhatsApp
            </a>
          )}
          {data.email && (
            <a href={`mailto:${data.email}`} className="flex items-center hover:text-red-600 transition duration-200">
              <FaEnvelope className="text-xl mr-1" /> {data.email}
            </a>
          )}
          {data.phone && (
            <a href={`tel:${data.phone}`} className="flex items-center hover:text-blue-500 transition duration-200">
              <FaPhone className="text-xl mr-1" /> {data.phone}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;