import React from 'react';
import { Link } from 'react-router-dom';
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
import { 
  HeroSection, 
  JobRecommendations, 
  MyAchievements, 
  RoleCard, 
  FeatureCard, 
  TestimonialCard, 
  StatsSection,
  ArticlesInsights,
  FeaturedCompanies,
  CommunityInsights
} from '../components/Home';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Job Recommendations Section */}
      <JobRecommendations />

      {/* My Progress Section */}
      <MyAchievements />

      {/* Articles & Insights Section */}
      <ArticlesInsights />

      {/* Featured Companies Section */}
      <FeaturedCompanies />

      {/* Community Insights Section */}
      <CommunityInsights />

      {/* User Roles Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Who We Serve</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform is designed for every member of the ITI community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
            
            <RoleCard
              icon={FaUsers}
              title="Staff"
              description="Manage programs, track student progress, and facilitate connections"
              linkTo="/register?role=staff"
              linkText="Join as Staff"
              borderColor="border-iti-primary"
              iconColor="text-iti-primary"
              bgColor="bg-red-100"
              textColor="text-iti-primary"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Platform Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to succeed in your tech career journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={FaLaptopCode}
              title="Portfolio Showcase"
              description="Display your projects, skills, and achievements in a professional portfolio"
              iconColor="text-blue-600"
              bgColor="bg-blue-100"
            />
            
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
            
            <FeatureCard
              icon={FaChartLine}
              title="Progress Analytics"
              description="Get insights into your learning journey and career growth"
              iconColor="text-purple-600"
              bgColor="bg-purple-100"
            />
            
            <FeatureCard
              icon={FaUsers}
              title="Professional Network"
              description="Connect with peers, mentors, and industry professionals"
              iconColor="text-indigo-600"
              bgColor="bg-indigo-100"
            />
            
            <FeatureCard
              icon={FaLaptopCode}
              title="Freelance Projects"
              description="Find freelance opportunities and build your independent career"
              iconColor="text-pink-600"
              bgColor="bg-pink-100"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Community Says</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="ITI Portal helped me land my dream job at a top tech company. The platform made it easy to showcase my projects and connect with recruiters."
              name="Ahmed Mohamed"
              role="Software Engineer"
            />
            
            <TestimonialCard
              quote="As a company, we've found amazing talent through ITI Portal. The students are well-prepared and passionate about technology."
              name="Sarah Hassan"
              role="HR Director"
            />
            
            <TestimonialCard
              quote="The alumni network on ITI Portal is incredible. I've been able to mentor students and grow my professional connections."
              name="Omar Khaled"
              role="Senior Developer"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-iti-primary to-iti-primary-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8">
            Join thousands of students, alumni, and companies building the future of tech in Egypt
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="inline-flex items-center px-8 py-4 bg-white text-iti-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Get Started Today
              <FaArrowRight className="ml-2" />
            </Link>
            <Link 
              to="/login" 
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-iti-primary transition-colors duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">ITI Portal</h3>
              <p className="text-gray-400">
                Connecting Egypt's tech community through education, career opportunities, and professional growth.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/students" className="hover:text-white transition-colors">Students</Link></li>
                <li><Link to="/alumni" className="hover:text-white transition-colors">Alumni</Link></li>
                <li><Link to="/companies" className="hover:text-white transition-colors">Companies</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ITI Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
