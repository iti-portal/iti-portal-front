import React from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaUserGraduate, FaBuilding, FaUsers, FaArrowRight } from 'react-icons/fa';

const WhoWeServe = ({ rolesRef, rolesClasses }) => {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-red-50 to-slate-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-40 right-40 w-44 h-44 bg-[#901b20] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
      <div className="absolute bottom-40 left-40 w-36 h-36 bg-[#203947] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-2000"></div>
      
      <div ref={rolesRef} className={`max-w-7xl mx-auto px-4 relative z-10 ${rolesClasses}`}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-[#f59e0b]/10 text-[#901b20] rounded-full text-sm font-medium mb-6 animate-fadeIn">
            <FaUsers className="mr-2" />
            Our Community
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 animate-fadeInUp animation-delay-200">
            Who We <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#901b20] via-[#f59e0b] to-[#203947]">Empower</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fadeInUp animation-delay-300">
            Our platform serves every member of Egypt's technology ecosystem, fostering growth and collaboration
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Student Card */}
          <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-[#901b20]/20 gradient-border hover:scale-105 animate-slideInLeft animation-delay-500">
            <div className="absolute inset-0 bg-gradient-to-br from-[#901b20]/5 to-[#901b20]/10 rounded-3xl group-hover:from-[#901b20]/10 group-hover:to-[#901b20]/15 transition-all duration-500"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-[#901b20] to-[#7a1619] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 neon-glow">
                <FaGraduationCap className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#901b20] transition-colors">Students</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Build your profile, showcase projects, and connect with opportunities in Egypt's fastest-growing tech sector.
              </p>
              <Link 
                to="/register?role=student"
                className="inline-flex items-center text-[#901b20] font-semibold hover:text-[#7a1619] transition-colors group/link"
              >
                Join as Student
                <FaArrowRight className="ml-2 text-sm group-hover/link:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          {/* Alumni Card */}
          <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-[#f59e0b]/20 gradient-border hover:scale-105 animate-scaleIn animation-delay-700">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f59e0b]/5 to-[#f59e0b]/10 rounded-3xl group-hover:from-[#f59e0b]/10 group-hover:to-[#f59e0b]/15 transition-all duration-500"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-[#f59e0b] to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 neon-glow">
                <FaUserGraduate className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#f59e0b] transition-colors">Alumni</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Mentor the next generation, share your expertise, and expand your professional network.
              </p>
              <Link 
                to="/register?role=alumni"
                className="inline-flex items-center text-[#f59e0b] font-semibold hover:text-orange-600 transition-colors group/link"
              >
                Join as Alumni
                <FaArrowRight className="ml-2 text-sm group-hover/link:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          {/* Companies Card */}
          <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-[#203947]/20 gradient-border hover:scale-105 animate-slideInRight animation-delay-900">
            <div className="absolute inset-0 bg-gradient-to-br from-[#203947]/5 to-[#203947]/10 rounded-3xl group-hover:from-[#203947]/10 group-hover:to-[#203947]/15 transition-all duration-500"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-[#203947] to-slate-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 neon-glow">
                <FaBuilding className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#203947] transition-colors">Companies</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Discover exceptional talent, post opportunities, and build your dream tech team.
              </p>
              <Link 
                to="/register?role=company"
                className="inline-flex items-center text-[#203947] font-semibold hover:text-slate-700 transition-colors group/link"
              >
                Join as Company
                <FaArrowRight className="ml-2 text-sm group-hover/link:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeServe;
