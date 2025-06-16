/**
 * Mock achievements data for development
 * This data simulates API responses for achievements
 */

import { ACHIEVEMENT_TYPES } from '../types/achievementTypes';

export const allMockAchievements = [
  {
    id: '1',
    type: ACHIEVEMENT_TYPES.PROJECT,
    title: 'E-commerce Web Application',
    description: 'Built a full-stack e-commerce platform with React, Node.js, and MongoDB',
    start_date: '2024-01-15',
    end_date: '2024-05-20',
    url: 'https://github.com/user/ecommerce',
    image: '/api/placeholder/400/200',
    tags: ['React', 'Node.js', 'MongoDB'],
    status: 'published',
    user: {
      name: 'Ahmed Hassan',
      avatar: '/avatar.png',
      role: 'Frontend Developer'
    }
  },
  {
    id: '11',
    type: ACHIEVEMENT_TYPES.PROJECT,
    title: 'Personal Portfolio Website',
    description: 'Created a responsive portfolio website showcasing work and achievements',
    start_date: '2024-02-10',
    end_date: '2024-03-15',
    url: 'https://portfolio-example.com',
    image: '/api/placeholder/400/200',
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    status: 'published',
    user: {
      name: 'Leila Omar',
      avatar: '/avatar.png',
      role: 'UI Designer'
    }
  },
  {
    id: '12',
    type: ACHIEVEMENT_TYPES.CERTIFICATE,
    title: 'Front-End Web Development',
    description: 'Specialized certification in modern front-end web development practices',
    organization: 'ITI',
    issue_date: '2024-01-28',
    url: 'https://certificate-example.com',
    status: 'published',
    user: {
      name: 'Mostafa Ibrahim',
      avatar: '/avatar.png',
      role: 'Student'
    }
  },
  {
    id: '13',
    type: ACHIEVEMENT_TYPES.JOB,
    title: 'UI/UX Designer',
    description: 'Leading design efforts for web and mobile applications',
    organization: 'Creative Studios',
    position: 'UI/UX Designer',
    start_date: '2023-11-15',
    employment_type: 'full-time',
    status: 'published',
    user: {
      name: 'Sarah Ahmed',
      avatar: '/avatar.png',
      role: 'Designer'
    }
  },
  {
    id: '2',
    type: ACHIEVEMENT_TYPES.JOB,
    title: 'Frontend Developer',
    description: 'Developed user interfaces for web applications using modern frameworks',
    organization: 'Tech Solutions Inc.',
    position: 'Frontend Developer',
    start_date: '2024-03-01',
    employment_type: 'full-time',
    status: 'published',
    user: {
      name: 'Layla Ibrahim',
      avatar: '/avatar.png',
      role: 'UI/UX Designer'
    }
  },
  {
    id: '3',
    type: ACHIEVEMENT_TYPES.CERTIFICATE,
    title: 'AWS Certified Solutions Architect',
    description: 'Professional certification in cloud architecture and AWS services',
    organization: 'Amazon Web Services',
    issue_date: '2024-02-15',
    url: 'https://aws.amazon.com/certification/',
    status: 'published',
    user: {
      name: 'Mohamed Ali',
      avatar: '/avatar.png',
      role: 'Cloud Engineer'
    }
  },  {
    id: '4a',
    type: ACHIEVEMENT_TYPES.PROJECT,
    title: 'Mobile Health App',
    description: 'Developed a health tracking application for iOS and Android using React Native',
    start_date: '2023-11-10',
    end_date: '2024-04-05',
    url: 'https://github.com/user/health-app',
    image: '/api/placeholder/400/200',
    tags: ['React Native', 'Firebase', 'Redux'],
    status: 'published',
    user: {
      name: 'Nour Ahmed',
      avatar: '/avatar.png',
      role: 'Mobile Developer'
    }
  },
  {
    id: '5',
    type: ACHIEVEMENT_TYPES.AWARD,
    title: 'Best Innovation Award',
    description: 'Recognized for creating an innovative solution at the national hackathon',
    organization: 'TechInnovate 2024',
    received_date: '2024-01-20',
    status: 'published',
    user: {
      name: 'Yasmin Mahmoud',
      avatar: '/avatar.png',
      role: 'Software Engineer'
    }
  },
  {
    id: '6',
    type: ACHIEVEMENT_TYPES.CERTIFICATE,
    title: 'Google Professional Data Engineer',
    description: 'Advanced certification in data engineering and cloud-based data solutions',
    organization: 'Google Cloud',
    issue_date: '2024-03-10',
    url: 'https://cloud.google.com/certification/data-engineer',
    status: 'published',
    user: {
      name: 'Karim Hassan',
      avatar: '/avatar.png',
      role: 'Data Engineer'
    }
  },  {
    id: '7a',
    type: ACHIEVEMENT_TYPES.PROJECT,
    title: 'AI-Powered Chatbot',
    description: 'Created a customer service chatbot using natural language processing technologies',
    start_date: '2024-02-01',
    end_date: '2024-06-15',
    url: 'https://github.com/user/chatbot',
    image: '/api/placeholder/400/200',
    tags: ['Python', 'NLP', 'Machine Learning'],
    status: 'published',
    user: {
      name: 'Fatima Saleh',
      avatar: '/avatar.png',
      role: 'AI Engineer'
    }
  },
  {
    id: '8',
    type: ACHIEVEMENT_TYPES.JOB,
    title: 'Backend Developer',
    description: 'Designed and implemented scalable APIs and database solutions',
    organization: 'DataFlow Systems',
    position: 'Backend Developer',
    start_date: '2023-09-01',
    employment_type: 'full-time',
    status: 'published',
    user: {
      name: 'Omar Khalid',
      avatar: '/avatar.png',
      role: 'Backend Engineer'
    }
  },
  {
    id: '9',
    type: ACHIEVEMENT_TYPES.AWARD,
    title: 'Best Graduate Project',
    description: 'Received award for outstanding graduation project in computer science',
    organization: 'Cairo University',
    received_date: '2023-07-05',
    status: 'published',
    user: {
      name: 'Hala Nasser',
      avatar: '/avatar.png',
      role: 'Recent Graduate'
    }
  },  {
    id: '10',
    type: ACHIEVEMENT_TYPES.CERTIFICATE,
    title: 'Microsoft Azure Administrator',
    description: 'Certified in deploying and managing Azure infrastructure services',
    organization: 'Microsoft',
    issue_date: '2024-01-18',
    url: 'https://learn.microsoft.com/certifications',
    status: 'published',
    user: {
      name: 'Amir Samir',
      avatar: '/avatar.png',
      role: 'Cloud Administrator'
    }
  },
  {
    id: '14',
    type: ACHIEVEMENT_TYPES.AWARD,
    title: 'Top Performer - Web Development Track',
    description: 'Awarded for exceptional performance in the web development track',
    organization: 'ITI Competition 2024',
    received_date: '2024-02-28',
    status: 'published',
    user: {
      name: 'Hassan Mohamed',
      avatar: '/avatar.png',
      role: 'Student'
    }
  },
  {
    id: '15',
    type: ACHIEVEMENT_TYPES.PROJECT,
    title: 'Task Management Application',
    description: 'Developed a task management application with offline support',
    start_date: '2023-12-01',
    end_date: '2024-01-20',
    url: 'https://github.com/user/task-manager',
    image: '/api/placeholder/400/200',
    tags: ['React', 'Redux', 'IndexedDB'],
    status: 'published',
    user: {
      name: 'Nada Ali',
      avatar: '/avatar.png',
      role: 'Software Developer'
    }
  },
  {
    id: '16',
    type: ACHIEVEMENT_TYPES.JOB,
    title: 'Mobile App Developer',
    description: 'Developing innovative mobile applications for iOS and Android',
    organization: 'Mobile Tech Solutions',
    position: 'Mobile Developer',
    start_date: '2023-10-01',
    employment_type: 'full-time',
    status: 'published',
    user: {
      name: 'Youssef Sameh',
      avatar: '/avatar.png',
      role: 'Mobile Developer'
    }
  }
];
