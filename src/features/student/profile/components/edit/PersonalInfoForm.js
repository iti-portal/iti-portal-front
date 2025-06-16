// src/features/Student/Profile/components/edit/PersonalInfoForm.js

import React, { useState, useEffect } from 'react';

function PersonalInfoForm({ data, onUpdateAll }) {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: data.firstName,
    lastName: data.lastName,
    title: data.title,
    company: data.company,
    summary: data.summary, // About Me
    profilePicture: data.profilePicture,
    governorate: data.governorate, // Location
  });


  useEffect(() => {
    setPersonalInfo({
      firstName: data.firstName,
      lastName: data.lastName,
      title: data.title,
      company: data.company,
      summary: data.summary,
      profilePicture: data.profilePicture,
      governorate: data.governorate,
    });
  }, [data]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedInfo = { ...personalInfo, [name]: value };
    setPersonalInfo(updatedInfo);
    onUpdateAll(updatedInfo); 
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedInfo = { ...personalInfo, profilePicture: reader.result };
        setPersonalInfo(updatedInfo);
        onUpdateAll(updatedInfo); 
      };
      reader.readAsDataURL(file); 
    }
  };


  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
        <p className="text-gray-600 text-sm mb-4">Update your profile details and preferences.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Profile Picture */}
          <div className="md:col-span-1 flex flex-col items-center justify-center space-y-3">
            <img
              src={personalInfo.profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-red-500 shadow-md"
            />
            <label htmlFor="profilePictureInput" className="cursor-pointer">
              <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                <svg className="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path></svg>
                Upload New Photo
              </span>
              <input
                id="profilePictureInput"
                name="profilePictureInput"
                type="file"
                className="sr-only" 
                onChange={handleProfilePictureChange}
                accept="image/*" 
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">JPG or PNG, max 2MB. For best results, use a square image.</p>
          </div>

          {/* Full Name */}
          <div className="md:col-span-1">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Full Name *</label>
            <input
              type="text" name="firstName" id="firstName" value={personalInfo.firstName} onChange={handleChange}
              placeholder="First Name"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <input
              type="text" name="lastName" id="lastName" value={personalInfo.lastName} onChange={handleChange}
              placeholder="Last Name"
              className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Current Job Title */}
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Current Job Title *</label>
            <input
              type="text" name="title" id="title" value={personalInfo.title} onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Location */}
          <div className="md:col-span-2">
            <label htmlFor="governorate" className="block text-sm font-medium text-gray-700">Location</label>
            {/* ممكن نستخدم dropdown للـ governorates في المستقبل */}
            <input
              type="text" name="governorate" id="governorate" value={personalInfo.governorate} onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., San Francisco, CA"
            />
          </div>
        </div>
      </div>

      {/* About Me (Short Bio) */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">About Me (Short Bio)</h2>
        <p className="text-gray-600 text-sm mb-4">Passionate about building intuitive and performant web applications.</p>
        <textarea
          name="summary"
          id="summary"
          rows="5"
          value={personalInfo.summary}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-y"
          placeholder="Craft a compelling bio that highlights your skills, experience, and aspirations."
          maxLength={300} 
        ></textarea>
        <div className="text-right text-xs text-gray-500 mt-2">
          {personalInfo.summary.length} / 300 characters
        </div>
      </div>
    </div>
  );
}

export default PersonalInfoForm;