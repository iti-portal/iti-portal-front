// src/features/Student/Profile/components/edit/ContactInfoForm.js

import React, { useState, useEffect } from 'react';

function ContactInfoForm({ data, onUpdateAll }) {
  const [contactInfo, setContactInfo] = useState({
    email: data.email || '',
    phone: data.phone || '',
    whatsapp: data.whatsapp || '',
    linkedin: data.linkedin || '',
    github: data.github || '',
    portfolioUrl: data.portfolioUrl || '',
  });

  useEffect(() => {
    setContactInfo({
      email: data.email || '',
      phone: data.phone || '',
      whatsapp: data.whatsapp || '',
      linkedin: data.linkedin || '',
      github: data.github || '',
      portfolioUrl: data.portfolioUrl || '',
    });
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedInfo = { ...contactInfo, [name]: value };
    setContactInfo(updatedInfo);
    onUpdateAll(updatedInfo); 
  };

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Primary Contact Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Primary Contact Details</h3>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email" name="email" id="email" value={contactInfo.email} onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="john.doe@example.com"
            />
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mt-4">Phone Number</label>
            <input
              type="tel" name="phone" id="phone" value={contactInfo.phone} onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          {/* Professional Network */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Professional Network</h3>
            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">LinkedIn Profile</label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {/* LinkedIn Icon */}
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.953-.067-2.447-1.487-2.447-1.489 0-1.729 1.153-1.729 2.37V16.338H8.5V8.552h2.213v1.008h.03c.31-.592 1.056-1.21 2.16-1.21 2.32 0 2.748 1.537 2.748 3.53v4.457zM5.337 7.085a1.766 1.766 0 01-1.767-1.767c0-.974.793-1.767 1.767-1.767S7.104 4.344 7.104 5.318A1.766 1.766 0 015.337 7.085zM6.55 8.552H4.125V16.338H6.55V8.552z" clipRule="evenodd"></path></svg>
                </div>
                <input
                    type="url" name="linkedin" id="linkedin" value={contactInfo.linkedin} onChange={handleChange}
                    className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="https://linkedin.com/in/yourprofile"
                />
            </div>

            <label htmlFor="github" className="block text-sm font-medium text-gray-700 mt-4">GitHub Profile URL</label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {/* GitHub Icon */}
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 0C4.477 0 0 4.48 0 10c0 4.41 2.865 8.165 6.84 9.49.5.09.68-.21.68-.47v-1.63c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.6.07-.58.07-.58 1-.07 1.53.99 1.53.99.89 1.52 2.34 1.08 2.91.82.09-.64.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.08-2.65 0 0 .84-.27 2.75 1.02.79-.22 1.63-.33 2.47-.33.84 0 1.68.11 2.47.33 1.91-1.29 2.75-1.02 2.75-1.02.53 1.38.18 2.4.08 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V19c0 .26.18.56.68.47C17.135 18.165 20 14.41 20 10c0-5.52-4.477-10-10-10z" clipRule="evenodd"></path></svg>
                </div>
                <input
                    type="url" name="github" id="github" value={contactInfo.github} onChange={handleChange}
                    className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="https://github.com/yourusername"
                />
            </div>

            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mt-4">WhatsApp Number</label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {/* WhatsApp Icon */}
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 12.378a6.52 6.52 0 01-3.35 1.065 6.52 6.52 0 01-5.32-2.18c-2.92-2.93-2.92-7.68 0-10.602l.707-.707a.5.5 0 000-.707c-.195-.195-.512-.195-.707 0L8 1.18c-3.69-3.69-9.686-3.69-13.376 0-3.69 3.69-3.69 9.686 0 13.376 3.69 3.69 9.686 3.69 13.376 0L17.472 12.378zM10 18c-4.41 0-8-3.59-8-8 0-2.205.895-4.205 2.343-5.657l.707-.707a.5.5 0 000-.707c-.195-.195-.512-.195-.707 0L3.293 3.293C-1.098 7.683-1.098 14.317 3.293 18.707 7.683 23.098 14.317 23.098 18.707 18.707l.707-.707a.5.5 0 000-.707c-.195-.195-.512-.195-.707 0L14.657 20.343C13.105 21.895 11.005 22 8.5 22 5.59 22 3 19.41 3 16s2.59-6 6-6c1.657 0 3.105.672 4.192 1.758a.5.5 0 00.707 0 .5.5 0 000-.707C13.105 9.895 11.005 9 8.5 9 4.09 9 1 12.59 1 17s3.09 6 7.5 6c2.5 0 4.602-1.005 6.293-2.707l.707-.707a.5.5 0 000-.707c-.195-.195-.512-.195-.707 0L14.657 19.293C13.105 20.895 11.005 22 8.5 22z"></path></svg>
                </div>
                <input
                    type="tel" name="whatsapp" id="whatsapp" value={contactInfo.whatsapp} onChange={handleChange}
                    className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="+1 (555) 987-6543"
                />
            </div>
            
             <div className="flex items-center mt-4">
              <input
                id="availableForFreelance" name="availableForFreelance" type="checkbox"
                checked={contactInfo.availableForFreelance} onChange={handleChange}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="availableForFreelance" className="ml-2 block text-sm text-gray-900">
                Available for Freelance
              </label>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactInfoForm;