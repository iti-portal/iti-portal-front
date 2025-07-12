import React from 'react';
import { FaRocket, FaChartLine, FaLaptopCode, FaBriefcase, FaArrowRight } from 'react-icons/fa';

const AIRecommendations = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#203947] to-[#901b20] text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-[#f59e0b] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float animation-delay-2000"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 text-white rounded-full text-sm font-medium mb-6 animate-fadeIn backdrop-blur-sm border border-white/20">
            <FaRocket className="mr-2" />
            AI-Powered Recommendations
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 animate-fadeInUp animation-delay-200">
            Smart Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f59e0b] to-orange-300">Guidance</span>
          </h2>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto leading-relaxed animate-fadeInUp animation-delay-300">
            Our AI analyzes your skills, preferences, and career goals to provide personalized recommendations for courses, projects, and job opportunities
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skill Assessment */}
          <div className="group relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 animate-fadeInUp animation-delay-500">
            <div className="w-16 h-16 bg-gradient-to-br from-[#f59e0b] to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <FaChartLine className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#f59e0b] transition-colors">Skill Assessment</h3>
            <p className="text-orange-100 leading-relaxed mb-6">
              AI-powered analysis of your technical skills and competencies to identify strengths and areas for improvement
            </p>
            <div className="flex items-center text-[#f59e0b] font-medium group-hover:text-orange-300 transition-colors">
              <span>Take Assessment</span>
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Personalized Learning Path */}
          <div className="group relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 animate-fadeInUp animation-delay-700">
            <div className="w-16 h-16 bg-gradient-to-br from-[#901b20] to-red-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <FaLaptopCode className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#901b20] transition-colors">Learning Path</h3>
            <p className="text-orange-100 leading-relaxed mb-6">
              Customized learning journey with courses, projects, and milestones tailored to your career objectives
            </p>
            <div className="flex items-center text-[#901b20] font-medium group-hover:text-red-300 transition-colors">
              <span>Start Learning</span>
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Career Matching */}
          <div className="group relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 animate-fadeInUp animation-delay-900">
            <div className="w-16 h-16 bg-gradient-to-br from-[#203947] to-slate-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <FaBriefcase className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#203947] transition-colors">Career Matching</h3>
            <p className="text-orange-100 leading-relaxed mb-6">
              Smart job recommendations based on your skills, interests, and market demand in Egypt's tech sector
            </p>
            <div className="flex items-center text-[#203947] font-medium group-hover:text-slate-300 transition-colors">
              <span>Find Opportunities</span>
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* AI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="text-center group hover:scale-110 transition-all duration-300">
            <div className="text-3xl lg:text-4xl font-bold text-[#f59e0b] group-hover:text-orange-300 transition-colors">95%</div>
            <div className="text-orange-100 group-hover:text-white transition-colors">Accuracy Rate</div>
          </div>
          <div className="text-center group hover:scale-110 transition-all duration-300">
            <div className="text-3xl lg:text-4xl font-bold text-[#901b20] group-hover:text-red-300 transition-colors">2K+</div>
            <div className="text-orange-100 group-hover:text-white transition-colors">Career Paths</div>
          </div>
          <div className="text-center group hover:scale-110 transition-all duration-300">
            <div className="text-3xl lg:text-4xl font-bold text-[#203947] group-hover:text-slate-300 transition-colors">50+</div>
            <div className="text-orange-100 group-hover:text-white transition-colors">Skill Categories</div>
          </div>
          <div className="text-center group hover:scale-110 transition-all duration-300">
            <div className="text-3xl lg:text-4xl font-bold text-[#f59e0b] group-hover:text-orange-300 transition-colors">24/7</div>
            <div className="text-orange-100 group-hover:text-white transition-colors">AI Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIRecommendations;
