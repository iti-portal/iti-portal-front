import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaArrowRight } from 'react-icons/fa';

const CTASection = ({ ctaRef, ctaClasses }) => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#203947] via-[#901b20] to-[#203947] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      {/* Enhanced Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#f59e0b] rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-float"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#901b20] rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-float animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-float animation-delay-4000"></div>
      
      <div ref={ctaRef} className={`relative max-w-4xl mx-auto px-4 text-center z-10 ${ctaClasses}`}>
        <div className="animate-fadeIn">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 text-white rounded-full text-sm font-medium mb-8 backdrop-blur-sm border border-white/20">
            <FaRocket className="mr-2" />
            Join The Future
          </div>
          <h2 className="text-4xl lg:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-100 animate-fadeInUp animation-delay-200">
            Ready to Transform Your Career?
          </h2>
        </div>
        
        <div className="animate-fadeInUp animation-delay-400">
          <p className="text-xl lg:text-2xl text-orange-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of students, alumni, and companies building the future of technology in Egypt. 
            Your next breakthrough is just one click away.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fadeInUp animation-delay-600">
          <Link 
            to="/register" 
            className="group relative px-12 py-6 bg-gradient-to-r from-[#901b20] to-[#f59e0b] text-white rounded-2xl font-bold text-xl hover:from-[#7a1619] hover:to-orange-600 transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-[#901b20]/30 neon-glow"
          >
            <span className="relative z-10 flex items-center">
              Get Started Today
              <FaArrowRight className="ml-3 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#901b20] to-[#f59e0b] rounded-2xl blur opacity-30 group-hover:opacity-60 transition-all duration-500"></div>
          </Link>
          
          <Link 
            to="/login" 
            className="group px-12 py-6 border-2 border-white/30 text-white rounded-2xl font-bold text-xl hover:bg-white/10 backdrop-blur-sm transition-all duration-500 glass-effect hover:border-[#f59e0b] hover:scale-105"
          >
            <span className="flex items-center">
              Sign In
              <FaArrowRight className="ml-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </span>
          </Link>
        </div>
        
        {/* Trust indicators */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fadeInUp animation-delay-1000">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#f59e0b]">30+</div>
            <div className="text-orange-100 text-sm">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#901b20]">15K+</div>
            <div className="text-orange-100 text-sm">Alumni Network</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">500+</div>
            <div className="text-orange-100 text-sm">Career Success</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
