import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-iti-primary to-iti-primary-dark text-white py-16 md:py-24 lg:py-32 px-4 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-iti-accent mix-blend-screen"></div>
        <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-white mix-blend-screen"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="space-y-6 lg:space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Welcome Back to Your 
              <span className="block text-iti-accent mt-2 lg:mt-3 animate-fadeIn">Tech Journey</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-100 leading-relaxed max-w-2xl">
              Welcome back! Explore opportunities, track your progress, and connect with Egypt's tech community. 
              Your journey to success continues here.
            </p>
            <div className="flex gap-4 pt-2">
              <button className="bg-iti-accent hover:bg-iti-accent-dark text-iti-primary-dark font-medium px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                Get Started
              </button>
              <button className="border-2 border-white/30 hover:border-iti-accent text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 hover:text-iti-accent">
                Learn More
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 lg:p-8 shadow-2xl border border-white/20 transform transition-all hover:scale-[1.02] duration-500">
              <div className="space-y-5">
                <div className="h-4 bg-white/20 rounded-full animate-pulse"></div>
                <div className="grid grid-cols-3 gap-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-white/20 rounded-lg animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                  ))}
                </div>
                <div className="h-6 bg-white/20 rounded-full w-3/4 animate-pulse"></div>
                <div className="h-6 bg-white/20 rounded-full w-1/2 animate-pulse"></div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-iti-accent rounded-full opacity-70 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;