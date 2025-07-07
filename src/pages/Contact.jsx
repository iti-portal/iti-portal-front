import React, { useState } from 'react';
import Navbar from '../components/Layout/Navbar';
import { addContact } from '../services/contactUsService';

const Contact = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    error: false,
    message: ''
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: false, error: false, message: '' });

    try {
      const response = await addContact(formData);
      if (response.success) {
        setSubmitStatus({ success: true, error: false, message: 'Your message has been sent successfully!' });
        setFormData({ full_name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus({ success: false, error: true, message: response.message || 'An unexpected error occurred.' });
      }
    } catch (error) {
      setSubmitStatus({ success: false, error: true, message: error.message || 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[#203947]/10 text-[#203947] rounded-full text-sm font-medium mb-6">
              <span className="material-icons text-lg mr-2">contact_mail</span>
              Get In Touch
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#901b20] to-[#203947]">Us</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] transition-colors"
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] transition-colors"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] transition-colors"
                    placeholder="What is this about?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] transition-colors"
                    placeholder="Tell us more about your inquiry..."
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#901b20] to-[#203947] text-white py-3 px-6 rounded-lg font-semibold hover:from-[#a83236] hover:to-[#2a4a5a] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
              {submitStatus.message && (
                <div className={`mt-4 text-center p-3 rounded-lg ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {submitStatus.message}
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#901b20] to-[#203947] rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="material-icons text-white">location_on</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                      <p className="text-gray-600">Information Technology Institute (ITI)<br />Smart Village, Giza, Egypt</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#203947] to-[#901b20] rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="material-icons text-white">phone</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                      <p className="text-gray-600">+20 2 3539 0100</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#901b20] to-[#203947] rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="material-icons text-white">email</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-600">info@iti.gov.eg</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Office Hours</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday - Thursday</span>
                    <span className="font-semibold text-gray-900">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Friday - Saturday</span>
                    <span className="font-semibold text-gray-900">Closed</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#203947]/10 to-[#901b20]/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Follow Us</h2>
                <p className="text-gray-600 mb-6">Stay connected with us on social media for the latest updates and news.</p>
                <div className="flex space-x-4">
                  <a href="https://www.facebook.com/ITI.eg" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gradient-to-br from-[#901b20] to-[#203947] rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform">
                    <span className="material-icons">facebook</span>
                  </a>
                  <a href="https://x.com/iti_channel" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gradient-to-br from-[#203947] to-[#901b20] rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform">
                    <span className="material-icons">alternate_email</span>
                  </a>
                  <a href="https://www.linkedin.com/school/information-technology-institute-iti-/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gradient-to-br from-[#901b20] to-[#203947] rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform">
                    <span className="material-icons">business</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
