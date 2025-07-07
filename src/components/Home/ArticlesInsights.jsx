// src/components/Home/ArticlesInsights.jsx

import React, { useEffect, useState } from 'react';
import { FaCalendar, FaUser, FaArrowRight, FaEye, FaHeart } from 'react-icons/fa';
import { fetchAllArticles } from '../../services/articlesApi';

const ArticleCard = ({ title, excerpt, author, date, readTime, views, likes, image, category }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <div className="h-48 bg-gray-200 relative overflow-hidden">
      {image ? (
        <img src={image} alt={title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
          <span className="text-4xl text-gray-400">📰</span>
        </div>
      )}
      <div className="absolute top-4 left-4">
        <span className="bg-iti-primary text-white px-3 py-1 rounded-full text-xs font-medium">
          {category}
        </span>
      </div>
    </div>
    
    <div className="p-6">
      <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{excerpt}</p>
      
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <FaUser className="mr-1" />
            <span>{author}</span>
          </div>
          <div className="flex items-center">
            <FaCalendar className="mr-1" />
            <span>{date}</span>
          </div>
        </div>
        <span>{readTime}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center">
            <FaEye className="mr-1" />
            <span>{views}</span>
          </div>
          <div className="flex items-center">
            <FaHeart className="mr-1" />
            <span>{likes}</span>
          </div>
        </div>
        <button className="text-iti-primary hover:text-iti-primary-dark font-medium text-sm flex items-center">
          Read More
          <FaArrowRight className="ml-1 text-xs" />
        </button>
      </div>
    </div>
  </div>
);

const ArticlesInsights = () => {
  const [articles, setArticles] = useState([]);

  const staticArticles = [
    {
      title: "The Future of AI in Software Development",
      excerpt: "Exploring how artificial intelligence is revolutionizing the way we develop software and the skills developers need to stay relevant.",
      author: "Dr. Ahmed Hassan",
      date: "Dec 15, 2024",
      readTime: "5 min read",
      views: "1.2k",
      likes: "89",
      category: "Technology"
    },
    {
      title: "Building Your First React Native App",
      excerpt: "A comprehensive guide to getting started with React Native development, from setup to deployment.",
      author: "Sarah Mohamed",
      date: "Dec 12, 2024", 
      readTime: "8 min read",
      views: "950",
      likes: "67",
      category: "Tutorial"
    }
  ];

  useEffect(() => {
    const getArticles = async () => {
      try {
        const response = await fetchAllArticles();
        if (response.data && response.data.length > 0) {
          setArticles(response.data);
        } else {
          setArticles(staticArticles);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
        setArticles(staticArticles);
      }
    };

    getArticles();
  }, []);

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Latest Articles & Insights</h2>
            <p className="text-gray-600">Stay updated with the latest in technology and career development</p>
          </div>
          <button className="flex items-center text-iti-primary hover:text-iti-primary-dark font-medium">
            View All Articles
            <FaArrowRight className="ml-2" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article, index) => (
            <ArticleCard key={index} {...article} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticlesInsights;
