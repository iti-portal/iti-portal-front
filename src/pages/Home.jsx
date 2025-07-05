import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Common/Logo';
import { 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  AtSymbolIcon,        // Alternative for email
  LinkIcon,            // Alternative for LinkedIn
  CodeBracketIcon      // Alternative for GitHub
} from '@heroicons/react/24/outline';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

// Social media icons (using available alternatives)
import { 
  ArrowTopRightOnSquareIcon as ShareIcon 
} from '@heroicons/react/24/outline';

import { 
  FaGraduationCap, 
  FaBuilding, 
  FaUserGraduate, 
  FaUsers, 
  FaTrophy, 
  FaChartLine, 
  FaLaptopCode, 
  FaBriefcase,
  FaArrowRight
} from 'react-icons/fa';
import Navbar from '../components/Layout/Navbar';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { 
  HeroSection, 
  JobRecommendations, 
  PopularAchievements, 
  RoleCard, 
  FeatureCard, 
  TestimonialCard, 
  StatsSection,
  ArticlesInsights,
  // FeaturedCompanies,
  // CommunityInsights
} from '../components/Home';

const Home = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Job Recommendations Section */}
      <JobRecommendations />

      {/* Popular Achievements Section */}
      <div ref={achievementsRef} className={achievementsClasses}>
        <PopularAchievements />
      </div>

      {/* Articles & Insights Section */}
      <div ref={articlesRef} className={articlesClasses}>
        <ArticlesInsights />
      </div>

      {/* Featured Companies Section */}
      {/* <FeaturedCompanies /> */}

      {/* Community Insights Section */}
      {/* <CommunityInsights /> */}

      {/* User Roles Section */}
      <section ref={rolesRef} className={`py-20 px-4 ${rolesClasses}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Who We Serve</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform is designed for every member of the ITI community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center align-center">
            <RoleCard
              icon={FaGraduationCap}
              title="Students"
              description="Build your profile, showcase projects, and connect with opportunities"
              linkTo="/register?role=student"
              linkText="Join as Student"
              borderColor="border-blue-500"
              iconColor="text-blue-600"
              bgColor="bg-blue-100"
              textColor="text-blue-600"
            />
            
            <RoleCard
              icon={FaUserGraduate}
              title="Alumni"
              description="Mentor students, share experiences, and grow your professional network"
              linkTo="/register?role=alumni"
              linkText="Join as Alumni"
              borderColor="border-green-500"
              iconColor="text-green-600"
              bgColor="bg-green-100"
              textColor="text-green-600"
            />
            
            <RoleCard
              icon={FaBuilding}
              title="Companies"
              description="Discover talented developers and post job opportunities"
              linkTo="/register?role=company"
              linkText="Join as Company"
              borderColor="border-purple-500"
              iconColor="text-purple-600"
              bgColor="bg-purple-100"
              textColor="text-purple-600"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className={`py-20 px-4 bg-gray-50 ${featuresClasses}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Platform Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to succeed in your tech career journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* <FeatureCard
              icon={FaLaptopCode}
              title="Portfolio Showcase"
              description="Display your projects, skills, and achievements in a professional portfolio"
              iconColor="text-blue-600"
              bgColor="bg-blue-100"
            /> */}
            
            <FeatureCard
              icon={FaBriefcase}
              title="Job Opportunities"
              description="Connect with top companies and discover career opportunities"
              iconColor="text-green-600"
              bgColor="bg-green-100"
            />
            
            <FeatureCard
              icon={FaTrophy}
              title="Achievements"
              description="Track your progress and celebrate your accomplishments"
              iconColor="text-yellow-600"
              bgColor="bg-yellow-100"
            />
            
            {/* <FeatureCard
              icon={FaChartLine}
              title="Progress Analytics"
              description="Get insights into your learning journey and career growth"
              iconColor="text-purple-600"
              bgColor="bg-purple-100"
            /> */}
            
            <FeatureCard
              icon={FaUsers}
              title="Professional Network"
              description="Connect with peers, mentors, and industry professionals"
              iconColor="text-indigo-600"
              bgColor="bg-indigo-100"
            />
            
            {/* <FeatureCard
              icon={FaLaptopCode}
              title="Freelance Projects"
              description="Find freelance opportunities and build your independent career"
              iconColor="text-pink-600"
              bgColor="bg-pink-100"
            /> */}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials */}
      <section ref={testimonialsRef} className={`py-20 px-4 ${testimonialsClasses}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Community Says</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="ITI Portal helped me master microservices architecture and land my backend role at a Fortune 500 company. The system design challenges were particularly valuable."
              name="Mohammed Essam"
              role="Backend Developer"
            />
            
            <TestimonialCard
              quote="Through ITI Portal, I found backend developers who truly understand scalable systems. Their database optimization skills saved our project months of development time"
              name="Nihal Zain"
              role="Frontend Developer"
            />
            
            <TestimonialCard
              quote="The backend community on ITI Portal helped me transition from junior to lead developer. The API design workshops transformed my career trajectory."
              name="Omar Morad"
              role="Backend Developer"
            />
          </div>
        </div>
      </section>

<footer className="bg-gray-800 text-white py-12 px-4 border-t border-gray-200">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Column - Logo and Description */}
      <div className="space-y-4">
        <div className="flex items-center">
          <Logo className="h-12 w-auto" />
          <span className="ml-3 text-2xl font-bold text-white">Information Technology Institute</span>
        </div>
        <p className="text-gray-300">
          Connecting Egypt's tech talent with opportunities and knowledge. Over 30 years, ITI has continuously updated its training portfolio through close monitoring of future global tech trends and alignment with the country's national and mega projects. This strategic approach has helped sustain an 85% employment rate for graduates even before their graduation.
        </p>
      </div>

      {/* Middle Column - Quick Links */}
<div className="md:pl-8">
  <h3 className="text-lg font-bold text-white mb-4">QUICK LINKS</h3>
  <ul className="space-y-3">
    <li>
      <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
    </li>
    <li>
      <Link to="/achievements" className="text-gray-300 hover:text-white">Achievements</Link>
    </li>
    <li>
      <Link to="/articles" className="text-gray-300 hover:text-white">Articles</Link>
    </li>
    <li>
      <Link to="" className="text-gray-300 hover:text-white">Jobs</Link>
    </li>
  </ul>
</div>

      {/* Right Column - Contact Info */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">KEEP IN TOUCH</h3>
        <div className="flex space-x-4 mt-4">
          <a href="https://www.facebook.com/ITI.eg" target='_blanck' className="text-gray-300 hover:text-white">
            <FaFacebook className="h-6 w-6" />
          </a>
          <a href="https://www.linkedin.com/school/information-technology-institute-iti-/?originalSubdomain=eg" target='_blanck' className="text-gray-300 hover:text-white">
            <FaTwitter className="h-6 w-6" />
          </a>
          <a href="https://x.com/iti_channel" target='_blanck' className="text-gray-300 hover:text-white">
            <FaLinkedin className="h-6 w-6" />
          </a>
        </div>
      </div>
    </div>

    {/* Copyright */}
    <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
      <p>© {new Date().getFullYear()} Information Technology Institute. All rights reserved.</p>
    </div>
  </div>
</footer>

    </div>
  );
};

export default Home;