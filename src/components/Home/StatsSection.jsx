// src/components/Home/StatsSection.jsx

import React from 'react';

const StatItem = ({ number, label }) => (
  <div className="text-center">
    <div className="text-4xl lg:text-5xl font-bold mb-2 text-iti-accent">
      {number}
    </div>
    <div className="text-lg text-gray-600">
      {label}
    </div>
  </div>
);

const StatsSection = () => {
  const stats = [
    { number: "25K+", label: "Students & Alumni" },
    { number: "500+", label: "Partner Companies" },
    { number: "10K+", label: "Job Placements" },
    { number: "95%", label: "Success Rate" },
  ];

  return (
    <section className="py-20 px-4 bg-iti-primary text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Impact in Numbers</h2>
          <p className="text-xl text-gray-100">
            Real results from our thriving tech community
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
