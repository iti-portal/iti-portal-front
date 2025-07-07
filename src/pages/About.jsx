import React from 'react';
import Navbar from '../components/Layout/Navbar';

const About = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[#203947]/10 text-[#203947] rounded-full text-sm font-medium mb-6">
              <span className="material-icons text-lg mr-2">info</span>
              About ITI Portal
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#901b20] to-[#203947]">ITI Portal</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Connecting Egypt's tech talent with opportunities and knowledge for over 30 years
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                ITI Portal is Egypt's premier platform for technology education and career development. 
                We bridge the gap between academic learning and industry demands, creating opportunities 
                for students, alumni, and companies to connect and grow together.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Through our comprehensive platform, we empower the next generation of tech leaders 
                while fostering innovation and collaboration within Egypt's thriving technology ecosystem.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#203947]/10 to-[#901b20]/10 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#901b20] mb-2">30+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#203947] mb-2">50K+</div>
                  <div className="text-gray-600">Alumni</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#901b20] mb-2">500+</div>
                  <div className="text-gray-600">Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#203947] mb-2">95%</div>
                  <div className="text-gray-600">Employment Rate</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose ITI Portal?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-[#901b20] to-[#203947] rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <span className="material-icons text-white">school</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-3">Quality Education</h3>
                <p className="text-gray-600 text-sm">
                  Industry-aligned curriculum designed by experts to meet market demands
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-[#203947] to-[#901b20] rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <span className="material-icons text-white">work</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-3">Career Opportunities</h3>
                <p className="text-gray-600 text-sm">
                  Direct connections with leading companies and exclusive job opportunities
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-[#901b20] to-[#203947] rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <span className="material-icons text-white">group</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-3">Strong Network</h3>
                <p className="text-gray-600 text-sm">
                  Join a thriving community of tech professionals and industry leaders
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
