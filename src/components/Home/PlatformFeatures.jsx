import React from 'react';
import { FaRocket, FaBriefcase, FaTrophy, FaUsers, FaArrowRight } from 'react-icons/fa';

const PlatformFeatures = ({ featuresRef, featuresClasses }) => {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-32 left-32 w-48 h-48 bg-[#f59e0b] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-500"></div>
      <div className="absolute bottom-32 right-32 w-40 h-40 bg-[#203947] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-2000"></div>
      
      <div ref={featuresRef} className={`max-w-7xl mx-auto px-4 relative z-10 ${featuresClasses}`}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-[#203947]/10 text-[#203947] rounded-full text-sm font-medium mb-6 animate-fadeIn">
            <FaRocket className="mr-2" />
            Platform Features
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 animate-fadeInUp animation-delay-200">
            Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#203947] via-[#901b20] to-[#f59e0b]">Features</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fadeInUp animation-delay-300">
            Everything you need to accelerate your technology career and connect with opportunities
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Job Opportunities */}
          <div className="group relative bg-gradient-to-br from-[#f59e0b]/5 to-orange-50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-[#f59e0b]/20 hover:scale-105 animate-fadeInUp animation-delay-500 h-80 flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f59e0b]/5 to-orange-50 rounded-3xl group-hover:from-[#f59e0b]/15 group-hover:to-orange-100 transition-all duration-500"></div>
            <div className="relative flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-[#f59e0b] to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 neon-glow">
                <FaBriefcase className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#f59e0b] transition-colors">Job Opportunities</h3>
              <p className="text-gray-600 leading-relaxed flex-grow">
                Connect with top companies and discover career opportunities tailored to your skills and interests.
              </p>
              <div className="mt-6 flex items-center text-[#f59e0b] font-medium group-hover:text-orange-600 transition-colors">
                <span>Explore Jobs</span>
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="group relative bg-gradient-to-br from-[#901b20]/5 to-red-50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-[#901b20]/20 hover:scale-105 animate-fadeInUp animation-delay-700 h-80 flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-[#901b20]/5 to-red-50 rounded-3xl group-hover:from-[#901b20]/15 group-hover:to-red-100 transition-all duration-500"></div>
            <div className="relative flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-[#901b20] to-red-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 neon-glow">
                <FaTrophy className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#901b20] transition-colors">Achievements</h3>
              <p className="text-gray-600 leading-relaxed flex-grow">
                Track your progress, celebrate accomplishments, and showcase your professional milestones.
              </p>
              <div className="mt-6 flex items-center text-[#901b20] font-medium group-hover:text-red-700 transition-colors">
                <span>View Achievements</span>
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Professional Network */}
          <div className="group relative bg-gradient-to-br from-[#203947]/5 to-slate-50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-[#203947]/20 hover:scale-105 animate-fadeInUp animation-delay-900 h-80 flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-[#203947]/5 to-slate-50 rounded-3xl group-hover:from-[#203947]/15 group-hover:to-slate-100 transition-all duration-500"></div>
            <div className="relative flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-[#203947] to-slate-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 neon-glow">
                <FaUsers className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#203947] transition-colors">Professional Network</h3>
              <p className="text-gray-600 leading-relaxed flex-grow">
                Connect with peers, mentors, and industry professionals to expand your career horizons.
              </p>
              <div className="mt-6 flex items-center text-[#203947] font-medium group-hover:text-slate-700 transition-colors">
                <span>Join Network</span>
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformFeatures;
