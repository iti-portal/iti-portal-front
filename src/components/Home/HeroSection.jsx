import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#203947] via-[#901b20] to-[#203947] text-white overflow-hidden min-h-screen flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#203947]/40 to-[#901b20]/40"></div>
      
      {/* Enhanced Floating Elements with better animations */}
      <div className="hero-particles"></div>
      <div className="absolute top-20 left-10 w-20 h-20 bg-[#901b20] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-[#203947] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-[#901b20] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-4000"></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-[#203947] rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-bounce-slow animation-delay-1000"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-24 lg:py-32 z-10">
        <div className="text-center">
          <div className="animate-fadeIn">
            <h1 className="text-5xl lg:text-8xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-orange-100 to-red-100">
              Build Your Future in
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#f59e0b] via-[#901b20] to-[#203947] animate-fadeInUp animation-delay-500">
                Technology
              </span>
            </h1>
          </div>
          
          <div className="animate-fadeInUp animation-delay-700">
            <p className="text-xl lg:text-2xl text-orange-100 mb-12 max-w-4xl mx-auto leading-relaxed">
              Join Egypt's premier technology community. Connect with opportunities, 
              showcase your achievements, and accelerate your career with ITI Portal.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fadeInUp animation-delay-1000">
            <Link 
              to="/register" 
              className="group relative px-8 py-4 bg-gradient-to-r from-[#901b20] to-[#203947] text-white rounded-xl font-semibold text-lg hover:from-[#7a1619] hover:to-[#1a2f3a] transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-[#901b20]/25 neon-glow"
            >
              <span className="relative z-10 flex items-center">
                Start Your Journey
                <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#901b20] to-[#203947] rounded-xl blur opacity-30 group-hover:opacity-60 transition-all duration-500"></div>
            </Link>
            
            <Link 
              to="/about" 
              className="group px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold text-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-500 glass-effect hover:border-[#901b20]"
            >
              <span className="flex items-center">
                Learn More
                <FaArrowRight className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </span>
            </Link>
          </div>
          
          {/* Enhanced Stats with better animations */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
            <div className="text-center animate-scaleIn animation-delay-1000 group hover:scale-110 transition-all duration-300">
              <div className="text-3xl lg:text-4xl font-bold text-[#f59e0b] group-hover:text-orange-200 transition-colors">10K+</div>
              <div className="text-orange-100 group-hover:text-white transition-colors">Active Students</div>
            </div>
            <div className="text-center animate-scaleIn animation-delay-1000 group hover:scale-110 transition-all duration-300">
              <div className="text-3xl lg:text-4xl font-bold text-[#901b20] group-hover:text-red-300 transition-colors">5K+</div>
              <div className="text-orange-100 group-hover:text-white transition-colors">Graduates</div>
            </div>
            <div className="text-center animate-scaleIn animation-delay-1000 group hover:scale-110 transition-all duration-300">
              <div className="text-3xl lg:text-4xl font-bold text-[#203947] group-hover:text-slate-300 transition-colors">200+</div>
              <div className="text-orange-100 group-hover:text-white transition-colors">Partner Companies</div>
            </div>
            <div className="text-center animate-scaleIn animation-delay-1000 group hover:scale-110 transition-all duration-300">
              <div className="text-3xl lg:text-4xl font-bold text-[#f59e0b] group-hover:text-orange-200 transition-colors">85%</div>
              <div className="text-orange-100 group-hover:text-white transition-colors">Employment Rate</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;