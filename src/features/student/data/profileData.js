// src/features/student/data/profileData.js

const dummyProfileData = {
  // Data from users, user_profiles, and student_details
  id: 1, // user_id
  email: 'sara.mohamed@example.com',
  role: 'student',
  status: 'approved',
  firstName: 'Sarah',
  lastName: 'Mohamed',
  username: 'sarah.mohamed',
  title: 'Full Stack Web Developer', 
  company: 'TechSolutions', 
  summary: 'A passionate web development student, actively seeking opportunities to apply my skills in building innovative solutions. I have a particular passion for front-end development using React and always strive to learn the latest technologies and deliver an excellent user experience.',
  phone: '+201001234567',
  whatsapp: '+201001234567',
  linkedin: 'https://www.linkedin.com/in/sarahmohamed-example/',
  github: 'https://github.com/sarahmohamed-example',
  portfolioUrl: 'https://sarahmohamed.netlify.app',
  profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60', // Profile picture from Unsplash
  coverPhoto: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y29kaW5nJTIwYmFubmVyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60', // Cover photo from Unsplash
  governorate: 'Cairo', // Can be named location
  availableForFreelance: true,

  // Data from student_details
  track: 'Full Stack Web Development (MERN)',
  intake: 'Intake 45',
  graduationDate: '2025-09-30', // Graduation date
  studentStatus: 'current',

  // Data from educations
  educations: [
    {
      id: 1,
      institution: 'Cairo University',
      degree: 'Bachelor',
      fieldOfStudy: 'Computer Engineering',
      startDate: '2019-09-01',
      endDate: '2023-06-30',
      description: 'Graduated with excellent grades, focusing on software development and data analysis. Graduation project was a hospital management system.',
    },
    {
      id: 2,
      institution: 'ITI (Information Technology Institute)',
      degree: 'Diploma',
      fieldOfStudy: 'Full Stack Web Development (MERN Stack)',
      startDate: '2024-01-15',
      endDate: '2025-09-30',
      description: 'Intensive web development program covering React.js, Node.js, Express.js, MongoDB.',
    },
  ],

  // Data from work_experiences
  workExperiences: [
    {
      id: 1,
      companyName: 'ITI Portal Project (Team Project)',
      position: 'Front-end Developer',
      description: 'Worked on developing the user interface for the ITI Portal project using React.js, including the profile page and interactive tab system.',
      startDate: '2024-09-01',
      endDate: null, // null means current
      isCurrent: true,
      location: 'Smart Village, Egypt',
    },
    {
      id: 2,
      companyName: 'ABC Solutions',
      position: 'Web Development Intern',
      description: 'Gained experience in developing basic user interfaces using HTML, CSS, JavaScript and assisting in client website maintenance.',
      startDate: '2023-07-01',
      endDate: '2023-09-30',
      isCurrent: false,
      location: 'Nasr City, Egypt',
    },
  ],

  // Data from user_skills (and linking to skills)
  skills: [
    { id: 1, name: 'React.js', proficiency: 'expert' },
    { id: 2, name: 'JavaScript (ES6+)', proficiency: 'advanced' },
    { id: 3, name: 'HTML5', proficiency: 'expert' },
    { id: 4, name: 'CSS3', proficiency: 'advanced' },
    { id: 5, name: 'Tailwind CSS', proficiency: 'advanced' },
    { id: 6, name: 'Node.js', proficiency: 'intermediate' },
    { id: 7, name: 'Express.js', proficiency: 'beginner' },
    { id: 8, name: 'MongoDB', proficiency: 'beginner' },
    { id: 9, name: 'Git & GitHub', proficiency: 'advanced' },
    { id: 10, name: 'Problem Solving', proficiency: 'advanced' },
    { id: 11, name: 'Communication', proficiency: 'advanced' },
  ],

  // Data from achievements (specifically for certificates)
  achievements: [
    {
      id: 1,
      type: 'certificate',
      title: 'React.js Masterclass',
      organization: 'Udemy',
      achievedAt: '2024-03-15',
      description: 'Comprehensive course covering advanced React patterns, hooks, and performance optimization techniques.',
      certificateUrl: 'https://udemy-certificate.s3.amazonaws.com/image/UC-123456.jpg',
      verified: true,
    },
    {
      id: 2,
      type: 'certificate',
      title: 'Web Development Bootcamp',
      organization: 'Coursera',
      achievedAt: '2023-12-10',
      description: 'Completed a comprehensive web development program covering front-end and back-end technologies.',
      certificateUrl: 'https://coursera.org/verify/ABC123XYZ',
      verified: true,
    },
    {
      id: 3,
      type: 'certificate',
      title: 'Responsive Web Design',
      organization: 'freeCodeCamp',
      achievedAt: '2023-08-20',
      description: 'Completed certification in responsive web design principles and implementation.',
      certificateUrl: 'https://freecodecamp.org/certification/user123/responsive-web-design',
      verified: true,
    },
  ],

  // Data from projects (student projects)
  projects: [
    {
      id: 1,
      title: 'E-commerce Website',
      description: 'Developed a full-stack e-commerce platform with React, Node.js, and MongoDB. Implemented features like user authentication, product catalog, shopping cart, and payment integration.',
      demoUrl: 'https://e-commerce-demo.netlify.app',
      githubUrl: 'https://github.com/sarahmohamed-example/e-commerce',
      imageUrl: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8ZSUyMGNvbW1lcmNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
      technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Redux', 'Stripe API'],
    },
    {
      id: 2,
      title: 'Weather App',
      description: 'Created a weather application that displays current weather conditions and forecasts based on user location or search. Uses OpenWeatherMap API for data.',
      demoUrl: 'https://weather-app-demo.netlify.app',
      githubUrl: 'https://github.com/sarahmohamed-example/weather-app',
      imageUrl: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8d2VhdGhlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
      technologies: ['JavaScript', 'HTML5', 'CSS3', 'OpenWeatherMap API'],
    },
    {
      id: 3,
      title: 'Task Management System',
      description: 'Built a task management application with drag-and-drop functionality, task categorization, due dates, and notifications. Implemented user authentication and data persistence.',
      demoUrl: 'https://task-manager-demo.netlify.app',
      githubUrl: 'https://github.com/sarahmohamed-example/task-manager',
      imageUrl: 'https://images.unsplash.com/photo-1540350394557-8d14678e7f91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8dGFzayUyMG1hbmFnZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
      technologies: ['React.js', 'Firebase', 'Material-UI', 'Context API'],
    },
  ],
};

export default dummyProfileData;
