import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import Logo from '../components/Common/Logo';
import { 
  FaGraduationCap, 
  FaBuilding, 
  FaUserGraduate, 
  FaUsers, 
  FaTrophy, 
  FaChartLine, 
  FaLaptopCode, 
  FaBriefcase,
  FaArrowRight,
  FaFacebook, 
  FaTwitter, 
  FaLinkedin,
  FaRocket,
  FaQuoteRight
} from 'react-icons/fa';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { 
  HeroSection, 
  PopularAchievements, 
  ArticlesInsights,
  AIRecommendations,
  WhoWeServe,
  PlatformFeatures,
  TestimonialCard,
  CTASection,
  Footer
} from '../components/Home';

const Home = () => {
  // Counter animation hook
  const useCounter = (end, duration = 2000, start = 0) => {
    const [count, setCount] = useState(start);
    const [isVisible, setIsVisible] = useState(false);
    const countRef = useRef(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        },
        { threshold: 0.1 }
      );

      if (countRef.current) {
        observer.observe(countRef.current);
      }

      return () => observer.disconnect();
    }, [isVisible]);

    useEffect(() => {
      if (!isVisible) return;

      let startTime;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        setCount(Math.floor(progress * (end - start) + start));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }, [isVisible, end, duration, start]);

    return [count, countRef];
  };

  // Counter hooks for stats
  const [studentsCount, studentsRef] = useCounter(10000, 2000);
  const [graduatesCount, graduatesRef] = useCounter(5000, 2000);
  const [companiesCount, companiesRef] = useCounter(200, 2000);
  const [employmentRate, employmentRef] = useCounter(85, 2000);

  // Counter hooks for CTA section
  const [yearsCount, yearsRef] = useCounter(30, 2000);
  const [alumniCount, alumniCtaRef] = useCounter(15000, 2000);
  const [successCount, successRef] = useCounter(500, 2000);

  // Counter hooks for AI Recommendations section
  const [accuracyRate, accuracyRef] = useCounter(95, 2000);
  const [careerPaths, careerPathsRef] = useCounter(2000, 2000);
  const [skillCategories, skillCategoriesRef] = useCounter(50, 2000);
  const [aiSupport, aiSupportRef] = useCounter(24, 2000);

  // Scroll animations for different sections
  const { ref: achievementsRef, animationClasses: achievementsClasses } = useScrollAnimation({
    animationType: 'fadeInUp',
    delay: 100,
    threshold: 0.01  // Lower threshold so it triggers earlier
  });

  const { ref: articlesRef, animationClasses: articlesClasses } = useScrollAnimation({
    animationType: 'fadeInUp',
    delay: 200,
    threshold: 0.01  // Lower threshold so it triggers earlier
  });

  const { ref: rolesRef, animationClasses: rolesClasses } = useScrollAnimation({
    animationType: 'fadeInUp',
    delay: 0
  });

  const { ref: featuresRef, animationClasses: featuresClasses } = useScrollAnimation({
    animationType: 'fadeInUp',
    delay: 100
  });

  const { ref: testimonialsRef, animationClasses: testimonialsClasses } = useScrollAnimation({
    animationType: 'fadeInUp',
    delay: 200
  });

  const { ref: ctaRef, animationClasses: ctaClasses } = useScrollAnimation({
    animationType: 'scaleIn',
    delay: 0
  });

  const { ref: footerRef, animationClasses: footerClasses } = useScrollAnimation({
    animationType: 'fadeInUp',
    delay: 100
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Modern Hero Section */}
      <section className="relative bg-gradient-to-br from-[#203947] via-[#901b20] to-[#203947] text-white overflow-hidden min-h-screen flex items-center">
        <div className="relative max-w-7xl mx-auto px-4 py-24 lg:py-32 z-10">
          <div className="text-center">
            <div className="animate-fadeIn">
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-8 text-white leading-tight">
                Build Your Future in
                <span className="block text-3xl md:text-5xl lg:text-7xl font-extrabold text-yellow-400 mt-4 mb-2 drop-shadow-lg leading-tight">
                  Technology
                </span>
              </h1>
            </div>
            
            <div className="animate-fadeInUp animation-delay-700">
              <p className="text-base md:text-lg lg:text-2xl text-orange-100 mb-10 max-w-4xl mx-auto leading-relaxed font-medium">
                Join Egypt's premier technology community. Connect with opportunities, 
                showcase your achievements, and accelerate your career with ITI Portal.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fadeInUp animation-delay-1000">
              <Link 
                to="/register" 
                className="group relative px-10 py-4 bg-gradient-to-r from-[#901b20] to-[#203947] text-white rounded-xl font-semibold text-lg hover:from-[#7a1619] hover:to-[#1a2f3a] transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-[#901b20]/30"
              >
                <span className="relative z-10 flex items-center">
                  Start Your Journey
                  <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
              
              <Link 
                to="/about" 
                className="group px-10 py-4 border-2 border-white/40 text-white rounded-xl font-semibold text-lg hover:bg-white/15 backdrop-blur-sm transition-all duration-500 hover:border-[#901b20] hover:scale-105 shadow-lg"
              >
                <span className="flex items-center">
                  Learn More
                  <FaArrowRight className="ml-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </span>
              </Link>
            </div>
            
            {/* Enhanced Stats with counter animations */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
              <div ref={studentsRef} className="text-center group hover:scale-105 transition-all duration-300">
                <div className="text-xl lg:text-3xl font-bold text-[#f59e0b] group-hover:text-orange-200 transition-colors">
                  {studentsCount.toLocaleString()}+
                </div>
                <div className="text-orange-100 text-base lg:text-lg group-hover:text-white transition-colors">Active Students</div>
              </div>
              <div ref={graduatesRef} className="text-center group hover:scale-105 transition-all duration-300">
                <div className="text-xl lg:text-3xl font-bold text-white group-hover:text-orange-200 transition-colors">
                  {graduatesCount.toLocaleString()}+
                </div>
                <div className="text-orange-100 text-base lg:text-lg group-hover:text-white transition-colors">Graduates</div>
              </div>
              <div ref={companiesRef} className="text-center group hover:scale-105 transition-all duration-300">
                <div className="text-xl lg:text-3xl font-bold text-orange-200 group-hover:text-orange-100 transition-colors">
                  {companiesCount}+
                </div>
                <div className="text-orange-100 text-base lg:text-lg group-hover:text-white transition-colors">Partner Companies</div>
              </div>
              <div ref={employmentRef} className="text-center group hover:scale-105 transition-all duration-300">
                <div className="text-xl lg:text-3xl font-bold text-[#f59e0b] group-hover:text-orange-200 transition-colors">
                  {employmentRate}%
                </div>
                <div className="text-orange-100 text-base lg:text-lg group-hover:text-white transition-colors">Employment Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Recommendations Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 via-blue-50 to-slate-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 bg-[#203947]/10 text-[#203947] rounded-full text-xs font-medium mb-4 backdrop-blur-sm border border-[#203947]/20">
              <FaRocket className="mr-2 text-sm" />
              AI-Powered Recommendations
            </div>
            <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">
              Smart Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#901b20] to-[#f59e0b]">Guidance</span>
            </h2>
            <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Our AI analyzes your skills, preferences, and career goals to provide personalized recommendations for courses, projects, and job opportunities
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Skill Assessment */}
            <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[#f59e0b] to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-all duration-300">
                <FaChartLine className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#f59e0b] transition-colors">Skill Assessment</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                AI-powered analysis of your technical skills and competencies to identify strengths and areas for improvement
              </p>
              <div className="flex items-center text-[#f59e0b] font-medium text-sm group-hover:text-orange-600 transition-colors">
                <span>Take Assessment</span>
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform text-xs" />
              </div>
            </div>

            {/* Personalized Learning Path */}
            <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[#901b20] to-red-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-all duration-300">
                <FaLaptopCode className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#901b20] transition-colors">Learning Path</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Customized learning journey with courses, projects, and milestones tailored to your career objectives
              </p>
              <div className="flex items-center text-[#901b20] font-medium text-sm group-hover:text-red-700 transition-colors">
                <span>Start Learning</span>
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform text-xs" />
              </div>
            </div>

            {/* Career Matching */}
            <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[#203947] to-slate-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-all duration-300">
                <FaBriefcase className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#203947] transition-colors">Career Matching</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Smart job recommendations based on your skills, interests, and market demand in Egypt's tech sector
              </p>
              <div className="flex items-center text-[#203947] font-medium text-sm group-hover:text-slate-700 transition-colors">
                <span>Find Opportunities</span>
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform text-xs" />
              </div>
            </div>
          </div>

          {/* AI Stats with animated counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 max-w-2xl mx-auto">
            <div ref={accuracyRef} className="text-center group hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-lg lg:text-xl font-bold text-[#f59e0b] group-hover:text-orange-600 transition-colors">
                {accuracyRate}%
              </div>
              <div className="text-gray-600 text-xs group-hover:text-gray-700 transition-colors">Accuracy Rate</div>
            </div>
            <div ref={careerPathsRef} className="text-center group hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-lg lg:text-xl font-bold text-[#901b20] group-hover:text-red-700 transition-colors">
                {careerPaths.toLocaleString()}+
              </div>
              <div className="text-gray-600 text-xs group-hover:text-gray-700 transition-colors">Career Paths</div>
            </div>
            <div ref={skillCategoriesRef} className="text-center group hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-lg lg:text-xl font-bold text-[#203947] group-hover:text-slate-700 transition-colors">
                {skillCategories}+
              </div>
              <div className="text-gray-600 text-xs group-hover:text-gray-700 transition-colors">Skill Categories</div>
            </div>
            <div ref={aiSupportRef} className="text-center group hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-lg lg:text-xl font-bold text-[#f59e0b] group-hover:text-orange-600 transition-colors">
                {aiSupport}/7
              </div>
              <div className="text-gray-600 text-xs group-hover:text-gray-700 transition-colors">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Popular Achievements Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 relative overflow-hidden">
        
        <div ref={achievementsRef} className={`max-w-7xl mx-auto px-4 relative z-10 ${achievementsClasses}`}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[#901b20]/10 text-[#901b20] rounded-full text-sm font-medium mb-6 animate-fadeIn">
              <FaTrophy className="mr-2" />
              Community Achievements
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 animate-fadeInUp animation-delay-200">
              Popular <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#901b20] via-[#f59e0b] to-[#203947]">Achievements</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fadeInUp animation-delay-300">
              Celebrate outstanding accomplishments from our thriving tech community and get inspired by their success stories
            </p>
          </div>
          <div className="animate-fadeInUp animation-delay-500">
            <PopularAchievements />
          </div>
        </div>
      </section>

      {/* Modern Articles Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        
        <div ref={articlesRef} className={`max-w-7xl mx-auto px-4 relative z-10 ${articlesClasses}`}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[#203947]/10 text-[#203947] rounded-full text-sm font-medium mb-6 animate-fadeIn">
              <FaLaptopCode className="mr-2" />
              Tech Insights
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 animate-fadeInUp animation-delay-200">
              Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#203947] via-[#901b20] to-[#f59e0b]">Insights</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fadeInUp animation-delay-300">
              Stay ahead with cutting-edge technology trends, career insights, and industry knowledge from thought leaders
            </p>
          </div>
          <div className="animate-fadeInUp animation-delay-500">
            <ArticlesInsights />
          </div>
        </div>
      </section>

      {/* Featured Companies Section */}
      {/* <FeaturedCompanies /> */}

      {/* Community Insights Section */}
      {/* <CommunityInsights /> */}

      {/* Modern Who We Serve Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-red-50 to-slate-50 relative overflow-hidden">
        
        <div ref={rolesRef} className={`max-w-7xl mx-auto px-4 relative z-10 ${rolesClasses}`}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[#f59e0b]/10 text-[#901b20] rounded-full text-sm font-medium mb-6 animate-fadeIn">
              <FaUsers className="mr-2" />
              Our Community
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 animate-fadeInUp animation-delay-200">
              Who We <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#901b20] via-[#f59e0b] to-[#203947]">Empower</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fadeInUp animation-delay-300">
              Our platform serves every member of Egypt's technology ecosystem, fostering growth and collaboration
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Student Card */}
            <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 border border-[#901b20]/20 hover:scale-105 animate-fadeInUp animation-delay-500 hover:rotate-1">
              <div className="absolute inset-0 bg-gradient-to-br from-[#901b20]/5 to-[#901b20]/10 rounded-3xl group-hover:from-[#901b20]/15 group-hover:to-[#901b20]/20 transition-all duration-700"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-[#901b20] to-[#7a1619] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 shadow-lg group-hover:shadow-xl">
                  <FaGraduationCap className="text-white text-2xl group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#901b20] transition-colors duration-500">Students</h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                  Build your profile, showcase projects, and connect with opportunities in Egypt's fastest-growing tech sector.
                </p>
                <Link 
                  to="/register?role=student"
                  className="inline-flex items-center text-[#901b20] font-semibold hover:text-[#7a1619] transition-colors group/link"
                >
                  Join as Student
                  <FaArrowRight className="ml-2 text-sm group-hover/link:translate-x-2 group-hover/link:scale-110 transition-all duration-300" />
                </Link>
              </div>
            </div>

            {/* Alumni Card */}
            <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 border border-[#f59e0b]/20 hover:scale-105 animate-fadeInUp animation-delay-700 hover:-rotate-1">
              <div className="absolute inset-0 bg-gradient-to-br from-[#f59e0b]/5 to-[#f59e0b]/10 rounded-3xl group-hover:from-[#f59e0b]/15 group-hover:to-[#f59e0b]/20 transition-all duration-700"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-[#f59e0b] to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 shadow-lg group-hover:shadow-xl">
                  <FaUserGraduate className="text-white text-2xl group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#f59e0b] transition-colors duration-500">Alumni</h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                  Mentor the next generation, share your expertise, and expand your professional network.
                </p>
                <Link 
                  to="/register?role=alumni"
                  className="inline-flex items-center text-[#f59e0b] font-semibold hover:text-orange-600 transition-colors group/link"
                >
                  Join as Alumni
                  <FaArrowRight className="ml-2 text-sm group-hover/link:translate-x-2 group-hover/link:scale-110 transition-all duration-300" />
                </Link>
              </div>
            </div>

            {/* Companies Card */}
            <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 border border-[#203947]/20 hover:scale-105 animate-fadeInUp animation-delay-900 hover:rotate-1">
              <div className="absolute inset-0 bg-gradient-to-br from-[#203947]/5 to-[#203947]/10 rounded-3xl group-hover:from-[#203947]/15 group-hover:to-[#203947]/20 transition-all duration-700"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-[#203947] to-slate-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 shadow-lg group-hover:shadow-xl">
                  <FaBuilding className="text-white text-2xl group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#203947] transition-colors duration-500">Companies</h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                  Discover exceptional talent, post opportunities, and build your dream tech team.
                </p>
                <Link 
                  to="/register?role=company"
                  className="inline-flex items-center text-[#203947] font-semibold hover:text-slate-700 transition-colors group/link"
                >
                  Join as Company
                  <FaArrowRight className="ml-2 text-sm group-hover/link:translate-x-2 group-hover/link:scale-110 transition-all duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Platform Features Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        
        <div ref={featuresRef} className={`max-w-7xl mx-auto px-4 relative z-10 ${featuresClasses}`}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[#203947]/10 text-[#203947] rounded-full text-sm font-medium mb-6 animate-fadeIn">
              <FaRocket className="mr-2" />
              Platform Features
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 animate-fadeInUp animation-delay-200">
              Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#203947] via-[#901b20] to-[#f59e0b]">Features</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fadeInUp animation-delay-300">
              Everything you need to accelerate your technology career and connect with opportunities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Job Opportunities */}
            <div className="group relative bg-gradient-to-br from-[#f59e0b]/5 to-orange-50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 border border-[#f59e0b]/20 hover:scale-105 animate-fadeInUp animation-delay-500 hover:rotate-1">
              <div className="absolute inset-0 bg-gradient-to-br from-[#f59e0b]/5 to-orange-50 rounded-3xl group-hover:from-[#f59e0b]/15 group-hover:to-orange-100 transition-all duration-700"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-[#f59e0b] to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 shadow-lg group-hover:shadow-xl">
                  <FaBriefcase className="text-white text-2xl group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#f59e0b] transition-colors duration-500">Job Opportunities</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Connect with top companies and discover career opportunities tailored to your skills and interests.
                </p>
                <div className="mt-6 flex items-center text-[#f59e0b] font-medium group-hover:text-orange-600 transition-colors">
                  <span>Explore Jobs</span>
                  <FaArrowRight className="ml-2 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="group relative bg-gradient-to-br from-[#901b20]/5 to-red-50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 border border-[#901b20]/20 hover:scale-105 animate-fadeInUp animation-delay-700 hover:-rotate-1">
              <div className="absolute inset-0 bg-gradient-to-br from-[#901b20]/5 to-red-50 rounded-3xl group-hover:from-[#901b20]/15 group-hover:to-red-100 transition-all duration-700"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-[#901b20] to-red-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 shadow-lg group-hover:shadow-xl">
                  <FaTrophy className="text-white text-2xl group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#901b20] transition-colors duration-500">Achievements</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Track your progress, celebrate accomplishments, and showcase your professional milestones.
                </p>
                <div className="mt-6 flex items-center text-[#901b20] font-medium group-hover:text-red-700 transition-colors">
                  <span>View Achievements</span>
                  <FaArrowRight className="ml-2 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
            </div>

            {/* Professional Network */}
            <div className="group relative bg-gradient-to-br from-[#203947]/5 to-slate-50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 border border-[#203947]/20 hover:scale-105 animate-fadeInUp animation-delay-900 hover:rotate-1">
              <div className="absolute inset-0 bg-gradient-to-br from-[#203947]/5 to-slate-50 rounded-3xl group-hover:from-[#203947]/15 group-hover:to-slate-100 transition-all duration-700"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-[#203947] to-slate-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 shadow-lg group-hover:shadow-xl">
                  <FaUsers className="text-white text-2xl group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#203947] transition-colors duration-500">Professional Network</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Connect with peers, mentors, and industry professionals to expand your career horizons.
                </p>
                <div className="mt-6 flex items-center text-[#203947] font-medium group-hover:text-slate-700 transition-colors">
                  <span>Join Network</span>
                  <FaArrowRight className="ml-2 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100 relative overflow-hidden">
        
        <div ref={testimonialsRef} className={`max-w-7xl mx-auto px-4 relative z-10 ${testimonialsClasses}`}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 bg-[#203947]/10 text-[#203947] rounded-full text-sm font-medium mb-4 backdrop-blur-sm border border-[#203947]/20">
              <FaUsers className="mr-2 text-sm" />
              Success Stories
            </div>
            <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4 animate-fadeInUp animation-delay-200">
              Success <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#901b20] to-[#f59e0b]">Stories</span>
            </h2>
            <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fadeInUp animation-delay-300">
              Hear from our thriving community of innovators and tech leaders who transformed their careers
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2 hover:scale-105 hover:rotate-1 animate-fadeInUp animation-delay-500">
              <div className="absolute inset-0 bg-gradient-to-br from-[#901b20]/5 to-[#203947]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#901b20] to-[#203947] rounded-2xl flex items-center justify-center text-white font-bold text-base group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                    M
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900 text-base group-hover:text-[#901b20] transition-colors duration-300">Mohammed Essam</h4>
                    <p className="text-gray-600 text-sm">Backend Developer</p>
                    <p className="text-[#203947] text-xs font-medium">Microsoft</p>
                  </div>
                </div>
                <blockquote className="text-gray-700 leading-relaxed text-sm mb-4 group-hover:text-gray-800 transition-colors duration-300">
                  "ITI Portal helped me master microservices architecture and land my backend role at a Fortune 500 company. The system design challenges were particularly valuable."
                </blockquote>
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 group-hover:scale-110 transition-transform duration-300">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current hover:scale-125 transition-transform duration-200" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                  <FaQuoteRight className="text-[#901b20]/30 text-lg group-hover:text-[#901b20]/50 group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
              {/* Animated corner accent */}
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-gradient-to-br from-[#901b20]/20 to-[#203947]/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700"></div>
            </div>

            {/* Testimonial 2 */}
            <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2 hover:scale-105 hover:rotate-1 animate-fadeInUp animation-delay-700">
              <div className="absolute inset-0 bg-gradient-to-br from-[#901b20]/5 to-[#203947]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#203947] to-[#901b20] rounded-2xl flex items-center justify-center text-white font-bold text-base group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                    N
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900 text-base group-hover:text-[#901b20] transition-colors duration-300">Nihal Zain</h4>
                    <p className="text-gray-600 text-sm">Frontend Developer</p>
                    <p className="text-[#203947] text-xs font-medium">Orange</p>
                  </div>
                </div>
                <blockquote className="text-gray-700 leading-relaxed text-sm mb-4 group-hover:text-gray-800 transition-colors duration-300">
                  "Through ITI Portal, I found backend developers who truly understand scalable systems. Their database optimization skills saved our project months of development time."
                </blockquote>
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 group-hover:scale-110 transition-transform duration-300">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current hover:scale-125 transition-transform duration-200" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                  <FaQuoteRight className="text-[#901b20]/30 text-lg group-hover:text-[#901b20]/50 group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
              {/* Animated corner accent */}
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-gradient-to-br from-[#901b20]/20 to-[#203947]/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700"></div>
            </div>

            {/* Testimonial 3 */}
            <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2 hover:scale-105 hover:rotate-1 animate-fadeInUp animation-delay-900">
              <div className="absolute inset-0 bg-gradient-to-br from-[#901b20]/5 to-[#203947]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#901b20] to-[#203947] rounded-2xl flex items-center justify-center text-white font-bold text-base group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                    O
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900 text-base group-hover:text-[#901b20] transition-colors duration-300">Omar Morad</h4>
                    <p className="text-gray-600 text-sm">Backend Developer</p>
                    <p className="text-[#203947] text-xs font-medium">Vodafone</p>
                  </div>
                </div>
                <blockquote className="text-gray-700 leading-relaxed text-sm mb-4 group-hover:text-gray-800 transition-colors duration-300">
                  "The backend community on ITI Portal helped me transition from junior to lead developer. The API design workshops transformed my career trajectory."
                </blockquote>
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 group-hover:scale-110 transition-transform duration-300">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current hover:scale-125 transition-transform duration-200" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                  <FaQuoteRight className="text-[#901b20]/30 text-lg group-hover:text-[#901b20]/50 group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
              {/* Animated corner accent */}
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-gradient-to-br from-[#901b20]/20 to-[#203947]/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#203947] via-[#901b20] to-[#203947] text-white relative overflow-hidden">
        <div ref={ctaRef} className={`relative max-w-4xl mx-auto px-4 text-center z-10 ${ctaClasses}`}>
          <div className="animate-fadeIn">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 text-white rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300">
              <FaRocket className="mr-2 text-sm animate-pulse" />
              Join The Future
            </div>
            <h2 className="text-2xl lg:text-4xl font-bold mb-6 text-white animate-fadeInUp animation-delay-200 hover:scale-105 transition-transform duration-300">
              Ready to Transform Your Career?
            </h2>
          </div>
          
          <div className="animate-fadeInUp animation-delay-400">
            <p className="text-base lg:text-lg text-orange-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students, alumni, and companies building the future of technology in Egypt. 
              Your next breakthrough is just one click away.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fadeInUp animation-delay-600">
            <Link 
              to="/register" 
              className="group relative px-10 py-4 bg-gradient-to-r from-[#901b20] to-[#f59e0b] text-white rounded-xl font-semibold text-lg hover:from-[#7a1619] hover:to-orange-600 transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 shadow-xl hover:shadow-[#901b20]/40 animate-pulse hover:animate-none"
            >
              <span className="relative z-10 flex items-center">
                Get Started Today
                <FaArrowRight className="ml-3 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#7a1619] to-orange-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <Link 
              to="/login" 
              className="group px-10 py-4 border-2 border-white/40 text-white rounded-xl font-semibold text-lg hover:bg-white/15 backdrop-blur-sm transition-all duration-500 hover:border-[#f59e0b] hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-white/25"
            >
              <span className="flex items-center">
                Sign In
                <FaArrowRight className="ml-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
              </span>
            </Link>
          </div>
          
          {/* Trust indicators with animated counters */}
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto animate-fadeInUp animation-delay-1000">
            <div ref={yearsRef} className="text-center group hover:scale-110 transition-all duration-300 cursor-pointer">
              <div className="text-lg font-bold text-[#f59e0b] group-hover:text-orange-300 transition-colors duration-300">
                {yearsCount}+
              </div>
              <div className="text-orange-100 text-xs group-hover:text-white transition-colors duration-300">Years Experience</div>
            </div>
            <div ref={alumniCtaRef} className="text-center group hover:scale-110 transition-all duration-300 cursor-pointer">
              <div className="text-lg font-bold text-white group-hover:text-[#f59e0b] transition-colors duration-300">
                {alumniCount.toLocaleString()}+
              </div>
              <div className="text-orange-100 text-xs group-hover:text-white transition-colors duration-300">Alumni Network</div>
            </div>
            <div ref={successRef} className="text-center group hover:scale-110 transition-all duration-300 cursor-pointer">
              <div className="text-lg font-bold text-orange-200 group-hover:text-orange-100 transition-colors duration-300">
                {successCount}+
              </div>
              <div className="text-orange-100 text-xs group-hover:text-white transition-colors duration-300">Career Success</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer ref={footerRef} className={`bg-[#203947] text-white py-8 border-t border-[#901b20]/20 relative overflow-hidden ${footerClasses}`}>
        {/* Large Logo on the Left */}
        <div className="absolute left-0 top-0 bottom-0 flex items-center justify-start pl-8 opacity-100">
          <Logo className="h-32 w-auto" />
        </div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          {/* Main Content */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6 ml-0 md:ml-40">
            {/* Brand and Description */}
            <div className="flex-1 text-center md:text-left animate-fadeInUp">
              <div className="mb-3">
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#f59e0b] to-[#901b20]">
                  ITI Portal
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
                Connecting Egypt's tech talent with opportunities and knowledge. 30+ years of excellence in technology education.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex-1 animate-fadeInUp animation-delay-200">
              <h3 className="text-lg font-bold text-white mb-3 text-center md:text-left">Quick Links</h3>
              <ul className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-[#f59e0b] transition-colors duration-300 text-sm group">
                    <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">Home</span>
                  </Link>
                </li>
                <li>
                  <Link to="/achievements" className="text-gray-300 hover:text-[#f59e0b] transition-colors duration-300 text-sm group">
                    <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">Achievements</span>
                  </Link>
                </li>
                <li>
                  <Link to="/articles" className="text-gray-300 hover:text-[#f59e0b] transition-colors duration-300 text-sm group">
                    <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">Articles</span>
                  </Link>
                </li>
                <li>
                  <Link to="/jobs" className="text-gray-300 hover:text-[#f59e0b] transition-colors duration-300 text-sm group">
                    <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">Jobs</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="flex-shrink-0 animate-fadeInUp animation-delay-400">
              <h3 className="text-lg font-bold text-white mb-3 text-center">Follow Us</h3>
              <div className="flex justify-center space-x-3">
                <a 
                  href="https://www.facebook.com/ITI.eg" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group w-9 h-9 bg-gradient-to-br from-[#901b20] to-[#7a1619] rounded-lg flex items-center justify-center text-white hover:from-[#7a1619] hover:to-[#5a0f12] transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg"
                >
                  <FaFacebook className="text-base group-hover:scale-110 transition-transform" />
                </a>
                <a 
                  href="https://x.com/iti_channel" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group w-9 h-9 bg-gradient-to-br from-[#203947] to-slate-700 rounded-lg flex items-center justify-center text-white hover:from-slate-700 hover:to-slate-800 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg"
                >
                  <FaTwitter className="text-base group-hover:scale-110 transition-transform" />
                </a>
                <a 
                  href="https://www.linkedin.com/school/information-technology-institute-iti-/?originalSubdomain=eg" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group w-9 h-9 bg-gradient-to-br from-[#f59e0b] to-orange-600 rounded-lg flex items-center justify-center text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg"
                >
                  <FaLinkedin className="text-base group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 pt-4 text-center animate-fadeInUp animation-delay-600 ml-0 md:ml-40">
            <p className="text-gray-400 text-xs">
              © {new Date().getFullYear()} Information Technology Institute. All rights reserved. Built with ❤️ for Egypt's tech community.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;