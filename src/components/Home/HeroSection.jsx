// src/components/Home/HeroSection.jsx

import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-iti-primary to-iti-primary-dark text-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Welcome Back to Your 
              <span className="block text-iti-accent">Tech Journey</span>
            </h1>
            <p className="text-xl text-gray-100 leading-relaxed">
              Welcome back! Explore opportunities, track your progress, and connect with Egypt's tech community. 
              Your journey to success continues here.
            </p>
          </div>
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-2xl">
              <div className="space-y-4">
                <div className="h-4 bg-white/20 rounded"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-20 bg-white/20 rounded"></div>
                  <div className="h-20 bg-white/20 rounded"></div>
                  <div className="h-20 bg-white/20 rounded"></div>
                </div>
                <div className="h-6 bg-white/20 rounded w-3/4"></div>
                <div className="h-6 bg-white/20 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;