import React from 'react';
import Navbar from '../components/Layout/Navbar';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const About = () => {
  const communityMembers = [
    { name: "Nihal Zain", image: "/avatars/nihal.jpg" },
    { name: "Omar Morad", image: "/avatars/omar.jpg" },
    { name: "Mohammed Essam", image: "/avatars/mohammed.jpg" },
    { name: "Mohammed Rajab", image: "/avatars/mohamed.jpg" },
    { name: "Fatma Ali", image: "/avatars/fatma.jpg" },
    { name: "Aml Mohsen", image: "/avatars/aml.jpg" },
    { name: "Rafat Ali", image: "/avatars/rafat.jpg" },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplaySpeed: 3000,
  };

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-20"
      >
        <div className="max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-[#203947]/10 text-[#203947] rounded-full text-sm font-medium mb-6"
            >
              <span className="material-icons text-lg mr-2">info</span>
              About ITI Portal
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#901b20] to-[#203947]">ITI Portal</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Connecting Egypt's tech talent with opportunities and knowledge for over 30 years
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
            }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                ITI Portal is Egypt's premier platform for technology education and career development. 
                We bridge the gap between academic learning and industry demands, creating opportunities 
                for students, alumni, and companies to connect and grow together.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Through our comprehensive platform, we empower the next generation of tech leaders 
                while fostering innovation and collaboration within Egypt's thriving technology ecosystem.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="bg-gradient-to-br from-[#203947]/10 to-[#901b20]/10 rounded-2xl p-8"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#901b20] mb-2">30+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#203947] mb-2">50K+</div>
                  <div className="text-gray-600">Alumni</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#901b20] mb-2">500+</div>
                  <div className="text-gray-600">Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#203947] mb-2">95%</div>
                  <div className="text-gray-600">Employment Rate</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose ITI Portal?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[{
                icon: 'school',
                title: 'Quality Education',
                desc: 'Industry-aligned curriculum designed by experts to meet market demands',
                color: 'from-[#901b20] to-[#203947]'
              }, {
                icon: 'work',
                title: 'Career Opportunities',
                desc: 'Direct connections with leading companies and exclusive job opportunities',
                color: 'from-[#203947] to-[#901b20]'
              }, {
                icon: 'group',
                title: 'Strong Network',
                desc: 'Join a thriving community of tech professionals and industry leaders',
                color: 'from-[#901b20] to-[#203947]'
              }].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-lg"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                    <span className="material-icons text-white">{item.icon}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ✅ Community Slider Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-20"
          >
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
              Meet Our Community
            </h2>
            <div className="max-w-md mx-auto">
              <Slider {...sliderSettings}>
                {communityMembers.map((member, i) => (
                  <div key={i} className="flex flex-col items-center justify-center text-center px-4 min-h-[180px]">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full object-cover mb-4 shadow-lg ring-4 ring-white block mx-auto align-middle"
                      style={{ display: 'block', margin: '0 auto' }}
                    />
                    <p className="text-gray-800 font-semibold text-lg mt-0">{member.name}</p>
                  </div>
                ))}
              </Slider>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default About;
