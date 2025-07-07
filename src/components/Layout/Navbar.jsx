// import React, { useState, useRef, useEffect } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import { USER_ROLES } from '../../features/auth/types/auth.types';
// import Logo from '../Common/Logo';

// import { db, collection, onSnapshot } from '../../firebase';
// import NotificationDropdown from '../Common/Notifications/NotificationsDropdown';

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
//   const [logoutLoading, setLogoutLoading] = useState(false);
//   const [refreshingProfile, setRefreshingProfile] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user, logout, refreshUserProfile } = useAuth();
//   const desktopDropdownRef = useRef(null);
//   const mediumDropdownRef = useRef(null);
//   const smallDropdownRef = useRef(null);

//   const userId = user?.id;
//   const [notifications, setNotifications] = useState([]);

//   // Debug: Log user data
//   React.useEffect(() => {
    
//   }, [user]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const isClickInsideDropdown = 
//         (desktopDropdownRef.current && desktopDropdownRef.current.contains(event.target)) ||
//         (mediumDropdownRef.current && mediumDropdownRef.current.contains(event.target)) ||
//         (smallDropdownRef.current && smallDropdownRef.current.contains(event.target));
      
//       if (!isClickInsideDropdown) {
//         setProfileDropdownOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Fetch notifications from Firestore
//   useEffect(() => {
//     if (!userId) return; 
//     const unsubscribe = onSnapshot(collection
//       (db, "notifications", String(userId), "user_notifications"),
//       (snapshot) => {
//         const newNotifications = [];

//         snapshot.docChanges().forEach((change)=> {
//           if(change.type === "added") {
//             newNotifications.push(change.doc.data());
//           }
//         })

//         if (newNotifications.length > 0) {
//           setNotifications((prev) => [...prev, ...newNotifications]);
//         }
//       }
//     )
//     return () => unsubscribe();
//     }, [])
  

//   // Handle manual profile refresh
//   const handleRefreshProfile = async () => {
//     try {
//       setRefreshingProfile(true);
//       await refreshUserProfile();
//     } catch (error) {
//       console.error('Failed to refresh profile:', error);
//     } finally {
//       setRefreshingProfile(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       setLogoutLoading(true);
//       const result = await logout();
      
//       if (result.success) {
//         navigate('/login');
//       } else {
//         // Even if logout API fails, redirect to login
//         navigate('/login');
//       }
//     } catch (error) {
//       console.error('Logout error:', error);
//       // Force redirect to login even on error
//       navigate('/login');
//     } finally {
//       setLogoutLoading(false);
//       setMenuOpen(false);
//     }
//   };

//   // Function to determine if a path is active
//   const isActivePath = (path) => {
//     if (path === '/') {
//       return location.pathname === '/';
//     }
//     // Handle profile paths
//     if (path === '/profile') {
//       return location.pathname.startsWith('/student/profile') || location.pathname.startsWith('/profile');
//     }
//     // Handle admin paths
//     if (path === '/admin') {
//       return location.pathname.startsWith('/admin');
//     }
//     return location.pathname.startsWith(path);
//   };

//   // Function to get link classes based on active state
//   const getLinkClasses = (path, isDesktop = true) => {
//     const isActive = isActivePath(path);
    
//     if (isDesktop) {
//       return isActive 
//         ? "text-[#901b20] border-b-2 border-[#901b20] pb-1 whitespace-nowrap font-semibold"
//         : "text-gray-700 hover:text-[#901b20] whitespace-nowrap pb-1 border-b-2 border-transparent hover:border-[#901b20] transition-all duration-200";
//     } else {
//       // Mobile sidebar styles
//       return isActive
//         ? "text-[#901b20] font-semibold py-3 px-4 hover:bg-gray-100 border-l-4 border-[#901b20] bg-red-50"
//         : "text-gray-700 py-3 px-4 hover:bg-gray-100 hover:text-[#901b20] border-l-4 border-transparent";
//     }
//   };

//   return (    <header className="w-full bg-white shadow-sm border-b px-2 sm:px-4 py-2 flex items-center justify-between relative">
//       {/* Logo - Always visible on left */}
//       <div className="flex items-center gap-1 sm:gap-2 font-bold text-sm sm:text-base lg:text-lg text-[#901b20] flex-shrink-0">
//         <Logo size="small" className="!mb-0 !mx-0 h-6 sm:h-8" />
//         <span className="whitespace-nowrap">ITI Portal</span>
//       </div>
//         {/* Desktop Navbar Content - Only for large screens (1024px+) */}
//       <div className="hidden lg:flex items-center gap-2 xl:gap-4 flex-1 justify-between ml-4 xl:ml-6">
//         <nav className="flex items-center gap-2 xl:gap-4 text-xs xl:text-sm font-medium">
//           <Link to="/" className={getLinkClasses('/')}>Home</Link>
//           <Link to="/student/profile" className={getLinkClasses('/profile')}>Profile</Link>
//           <Link to="/jobs" className={getLinkClasses('/jobs')}>Jobs</Link>
//           <Link to="/company" className={getLinkClasses('/company')}>Company</Link>
//           {user?.role === USER_ROLES.ADMIN && (
//             <Link to="/admin/dashboard" className={getLinkClasses('/admin')}>Admin</Link>
//           )}
//           <Link to="/network" className={getLinkClasses('/network')}>Network</Link>
//           <Link to="/achievements" className={getLinkClasses('/achievements')}>Achievements</Link>
//           <Link to="/articles" className={getLinkClasses('/articles')}>Articles</Link>
//         </nav>
//         <div className="flex items-center gap-2 xl:gap-4">
//           <input
//             type="text"
//             placeholder="Search ITI Portal..."
//             className="border border-[#901b20] rounded px-2 xl:px-3 py-1 text-xs xl:text-sm focus:outline-none focus:ring-2 focus:ring-[#901b20] w-32 xl:w-64"
//           />
//           <button className="bg-[#901b20] text-white px-2 xl:px-4 py-1 xl:py-2 rounded font-semibold hover:bg-[#a83236] transition text-xs xl:text-sm whitespace-nowrap">
//             Post Job
//           </button>






//           {/* <span className="material-icons text-gray-500 cursor-pointer text-lg xl:text-xl dropdown">notifications_none</span> */}
//           <NotificationDropdown notifications={notifications} />
          
          
          
          
          
          
          
          
          
          
//           <span className="material-icons text-gray-500 cursor-pointer text-lg xl:text-xl">settings</span>
//           <button
//             onClick={handleLogout}
//             disabled={logoutLoading}
//             className="material-icons text-gray-500 hover:text-[#901b20] cursor-pointer text-lg xl:text-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             title={logoutLoading ? 'Logging out...' : 'Logout'}
//           >
//             {logoutLoading ? 'hourglass_empty' : 'logout'}
//           </button>
//           <div className="relative" ref={desktopDropdownRef}>
//             <button
//               onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
//               className="focus:outline-none"
//             >            <img
//               src={user?.profile?.profile_picture || "/avatar.png"}
//               alt="User"
//               className="w-7 h-7 xl:w-9 xl:h-9 rounded-full border-2 border-[#901b20] object-cover cursor-pointer hover:border-[#a83236] transition-colors"
//             />
//             </button>
            
//             {/* Profile Dropdown */}
//             {profileDropdownOpen && (
//               <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
//                 <div className="px-4 py-2 border-b border-gray-200">
//                   <div className="font-semibold text-gray-800 text-sm">
//                     {user?.profile?.first_name && user?.profile?.last_name 
//                       ? `${user.profile.first_name} ${user.profile.last_name}` 
//                       : user?.name || 'Unknown User'}
//                   </div>
//                   <div className="text-xs text-gray-500">
//                     {user?.email || 'No email available'}
//                   </div>
//                 </div>
                
//                 <button 
//                   onClick={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();
                    
//                     setProfileDropdownOpen(false);
//                     navigate('/student/profile');
//                   }}
//                   className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
//                 >
//                   <span className="material-icons text-lg mr-3">person</span>
//                   View Profile
//                 </button>
                
//                 <button 
//                   onClick={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();
                    
//                     setProfileDropdownOpen(false);
//                     navigate('/my-achievements');
//                   }}
//                   className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
//                 >
//                   <span className="material-icons text-lg mr-3">emoji_events</span>
//                   My Achievements
//                 </button>
                
//                 <button 
//                   onClick={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();
                    
//                     setProfileDropdownOpen(false);
//                     navigate('/student/profile/edit');
//                   }}
//                   className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
//                 >
//                   <span className="material-icons text-lg mr-3">edit</span>
//                   Edit Profile
//                 </button>
                
//                 <button 
//                   onClick={() => {
//                     setProfileDropdownOpen(false);
//                     handleRefreshProfile();
//                   }}
//                   disabled={refreshingProfile}
//                   className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left disabled:opacity-50"
//                 >
//                   <span className="material-icons text-lg mr-3">
//                     {refreshingProfile ? 'hourglass_empty' : 'refresh'}
//                   </span>
//                   {refreshingProfile ? 'Refreshing...' : 'Refresh Profile'}
//                 </button>
                
//                 <div className="border-t border-gray-200 mt-2 pt-2">
//                   <button
//                     onClick={() => {
//                       setProfileDropdownOpen(false);
//                       handleLogout();
//                     }}
//                     disabled={logoutLoading}
//                     className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <span className="material-icons text-lg mr-3">
//                       {logoutLoading ? 'hourglass_empty' : 'logout'}
//                     </span>
//                     {logoutLoading ? 'Logging out...' : 'Logout'}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Medium Screen Content (768px-1024px) */}
//       <div className="hidden md:flex lg:hidden items-center gap-2 flex-1 justify-end">
//         <input
//           type="text"
//           placeholder="Search..."
//           className="border border-[#901b20] rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#901b20] w-20"
//         />
//         <span className="material-icons text-gray-500 cursor-pointer text-lg">notifications_none</span>
//         <button
//           onClick={handleLogout}
//           disabled={logoutLoading}
//           className="material-icons text-gray-500 hover:text-[#901b20] cursor-pointer text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           title={logoutLoading ? 'Logging out...' : 'Logout'}
//         >
//           {logoutLoading ? 'hourglass_empty' : 'logout'}
//         </button>
//         <div className="relative" ref={mediumDropdownRef}>
//           <button
//             onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
//             className="focus:outline-none"
//           >
//             <img
//               src={user?.profile?.profile_picture || "/avatar.png"}
//               alt="User"
//               className="w-7 h-7 rounded-full border-2 border-[#901b20] object-cover cursor-pointer hover:border-[#a83236] transition-colors"
//             />
//           </button>
          
//           {/* Profile Dropdown */}
//           {profileDropdownOpen && (
//             <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
//               <div className="px-4 py-2 border-b border-gray-200">
//                 <div className="font-semibold text-gray-800 text-sm">
//                   {user?.profile?.first_name && user?.profile?.last_name 
//                     ? `${user.profile.first_name} ${user.profile.last_name}` 
//                     : user?.name || 'Unknown User'}
//                 </div>
//                 <div className="text-xs text-gray-500">
//                   {user?.email || 'No email available'}
//                 </div>
//               </div>
              
//               <button 
//                 onClick={(e) => {
//                   e.preventDefault();
//                   e.stopPropagation();
                  
//                   setProfileDropdownOpen(false);
//                   navigate('/student/profile');
//                 }}
//                 className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
//               >
//                 <span className="material-icons text-lg mr-3">person</span>
//                 View Profile
//               </button>
              
//               <button 
//                 onClick={(e) => {
//                   e.preventDefault();
//                   e.stopPropagation();
                  
//                   setProfileDropdownOpen(false);
//                   navigate('/my-achievements');
//                 }}
//                 className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
//               >
//                 <span className="material-icons text-lg mr-3">emoji_events</span>
//                 My Achievements
//               </button>
              
//               <button 
//                 onClick={(e) => {
//                   e.preventDefault();
//                   e.stopPropagation();
                  
//                   setProfileDropdownOpen(false);
//                   navigate('/student/profile/edit');
//                 }}
//                 className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
//               >
//                 <span className="material-icons text-lg mr-3">edit</span>
//                 Edit Profile
//               </button>
              
//               <div className="border-t border-gray-200 mt-2 pt-2">
//                 <button
//                   onClick={() => {
//                     setProfileDropdownOpen(false);
//                     handleLogout();
//                   }}
//                   disabled={logoutLoading}
//                   className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <span className="material-icons text-lg mr-3">
//                     {logoutLoading ? 'hourglass_empty' : 'logout'}
//                   </span>
//                   {logoutLoading ? 'Logging out...' : 'Logout'}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Small Screen Content (640px-768px) */}
//       <div className="hidden sm:flex md:hidden items-center gap-2 flex-1 justify-end">
//         <span className="material-icons text-gray-500 cursor-pointer text-lg">notifications_none</span>
//         <button
//           onClick={handleLogout}
//           disabled={logoutLoading}
//           className="material-icons text-gray-500 hover:text-[#901b20] cursor-pointer text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           title={logoutLoading ? 'Logging out...' : 'Logout'}
//         >
//           {logoutLoading ? 'hourglass_empty' : 'logout'}
//         </button>
//         <div className="relative" ref={smallDropdownRef}>
//           <button
//             onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
//             className="focus:outline-none"
//           >
//             <img
//               src={user?.profile?.profile_picture || "/avatar.png"}
//               alt="User"
//               className="w-6 h-6 rounded-full border-2 border-[#901b20] object-cover cursor-pointer hover:border-[#a83236] transition-colors"
//             />
//           </button>
          
//           {/* Profile Dropdown */}
//           {profileDropdownOpen && (
//             <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
//               <div className="px-4 py-2 border-b border-gray-200">
//                 <div className="font-semibold text-gray-800 text-sm">
//                   {user?.profile?.first_name && user?.profile?.last_name 
//                     ? `${user.profile.first_name} ${user.profile.last_name}` 
//                     : user?.name || 'Unknown User'}
//                 </div>
//                 <div className="text-xs text-gray-500">
//                   {user?.email || 'No email available'}
//                 </div>
//               </div>
              
//               <button 
//                 onClick={(e) => {
//                   e.preventDefault();
//                   e.stopPropagation();
                  
//                   setProfileDropdownOpen(false);
//                   navigate('/student/profile');
//                 }}
//                 className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
//               >
//                 <span className="material-icons text-lg mr-3">person</span>
//                 View Profile
//               </button>
              
//               <button 
//                 onClick={(e) => {
//                   e.preventDefault();
//                   e.stopPropagation();
                  
//                   setProfileDropdownOpen(false);
//                   navigate('/my-achievements');
//                 }}
//                 className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
//               >
//                 <span className="material-icons text-lg mr-3">emoji_events</span>
//                 My Achievements
//               </button>
              
//               <button 
//                 onClick={(e) => {
//                   e.preventDefault();
//                   e.stopPropagation();
                  
//                   setProfileDropdownOpen(false);
//                   navigate('/student/profile/edit');
//                 }}
//                 className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
//               >
//                 <span className="material-icons text-lg mr-3">edit</span>
//                 Edit Profile
//               </button>
              
//               <div className="border-t border-gray-200 mt-2 pt-2">
//                 <button
//                   onClick={() => {
//                     setProfileDropdownOpen(false);
//                     handleLogout();
//                   }}
//                   disabled={logoutLoading}
//                   className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <span className="material-icons text-lg mr-3">
//                     {logoutLoading ? 'hourglass_empty' : 'logout'}
//                   </span>
//                   {logoutLoading ? 'Logging out...' : 'Logout'}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
      
//       {/* Hamburger for mobile and tablet screens */}
//       <button
//         className="lg:hidden ml-1 sm:ml-2 p-1 sm:p-2 rounded focus:outline-none flex-shrink-0"
//         onClick={() => setMenuOpen(!menuOpen)}
//         aria-label="Toggle menu"
//       >
//         <span className="material-icons text-xl sm:text-2xl text-[#901b20]">{menuOpen ? 'close' : 'menu'}</span>
//       </button>      {/* Mobile/Tablet Sidebar Menu */}
//       {menuOpen && (
//         <>
//           {/* Sidebar */}
//           <div className={`fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl flex flex-col lg:hidden z-50 transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//             {/* Header with logo and close button */}
//             <div className="flex justify-between items-center p-4 border-b border-gray-200">
//               <div className="flex items-center gap-2 font-bold text-base text-[#901b20]">
//                 <Logo size="small" className="!mb-0 !mx-0 h-6" />
//                 <span>ITI Portal</span>
//               </div>
//               <button
//                 onClick={() => setMenuOpen(false)}
//                 className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
//                 aria-label="Close menu"
//               >
//                 <span className="material-icons text-xl text-[#901b20]">close</span>
//               </button>
//             </div>
            
//             {/* Navigation Links */}
//             <nav className="flex flex-col py-4 flex-1 overflow-y-auto">
//               <Link to="/" className={getLinkClasses('/', false)} onClick={() => setMenuOpen(false)}>
//                 <span className="material-icons text-lg mr-3 align-middle">home</span>
//                 Home
//               </Link>
//               <Link to="/student/profile" className={getLinkClasses('/profile', false)} onClick={() => setMenuOpen(false)}>
//                 <span className="material-icons text-lg mr-3 align-middle">person</span>
//                 Profile
//               </Link>
//               <Link to="/jobs" className={getLinkClasses('/jobs', false)} onClick={() => setMenuOpen(false)}>
//                 <span className="material-icons text-lg mr-3 align-middle">work</span>
//                 Jobs
//               </Link>
//               <Link to="/company" className={getLinkClasses('/company', false)} onClick={() => setMenuOpen(false)}>
//                 <span className="material-icons text-lg mr-3 align-middle">business</span>
//                 Company
//               </Link>
//               {user?.role === USER_ROLES.ADMIN && (
//                 <Link to="/admin/dashboard" className={getLinkClasses('/admin', false)} onClick={() => setMenuOpen(false)}>
//                   <span className="material-icons text-lg mr-3 align-middle">admin_panel_settings</span>
//                   Admin
//                 </Link>
//               )}
//               <Link to="/network" className={getLinkClasses('/network', false)} onClick={() => setMenuOpen(false)}>
//                 <span className="material-icons text-lg mr-3 align-middle">group</span>
//                 Network
//               </Link>              <Link to="/achievements" className={getLinkClasses('/achievements', false)} onClick={() => setMenuOpen(false)}>
//                 <span className="material-icons text-lg mr-3 align-middle">emoji_events</span>
//                 Achievements
//               </Link>
//               <Link to="/my-achievements" className={getLinkClasses('/my-achievements', false)} onClick={() => setMenuOpen(false)}>
//                 <span className="material-icons text-lg mr-3 align-middle">star</span>
//                 My Achievements
//               </Link>
//               <Link to="/articles" className={getLinkClasses('/articles', false)} onClick={() => setMenuOpen(false)}>
//                 <span className="material-icons text-lg mr-3 align-middle">article</span>
//                 Articles
//               </Link>
//             </nav>
            
//             {/* Search and Actions */}
//             <div className="p-4 border-t border-gray-200 space-y-3">
//               <input
//                 type="text"
//                 placeholder="Search ITI Portal..."
//                 className="border border-[#901b20] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#901b20] w-full"
//               />
//               <button className="bg-[#901b20] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#a83236] transition text-sm w-full">
//                 <span className="material-icons text-lg mr-2 align-middle">add</span>
//                 Post Job
//               </button>
//             </div>
            
//             {/* User Section */}
//             <div className="p-4 border-t border-gray-200 bg-gray-50">
//               <div className="flex items-center gap-3 mb-3">
//                 <Link to="/student/profile" onClick={() => setMenuOpen(false)}>
//                   <img
//                     src={user?.profile?.profile_picture || "/avatar.png"}
//                     alt="User"
//                     className="w-10 h-10 rounded-full border-2 border-[#901b20] object-cover cursor-pointer hover:border-[#a83236] transition-colors"
//                   />
//                 </Link>
//                 <div className="flex-1">
//                   <div className="font-semibold text-gray-800 text-sm">
//                     {user?.profile?.first_name && user?.profile?.last_name 
//                       ? `${user.profile.first_name} ${user.profile.last_name}` 
//                       : user?.name || 'User'}
//                   </div>
//                   <div className="text-xs text-gray-500">
//                     {user?.email || 'No email available'}
//                   </div>
//                 </div>
//               </div>
//               <div className="flex items-center justify-around pt-2 border-t border-gray-200">
//                 <button className="flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-200">
//                   <span className="material-icons text-gray-500">notifications_none</span>
//                   <span className="text-xs text-gray-600">Notifications</span>
//                 </button>
//                 <button className="flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-200">
//                   <span className="material-icons text-gray-500">settings</span>
//                   <span className="text-xs text-gray-600">Settings</span>
//                 </button>
//                 <button 
//                   onClick={handleLogout}
//                   disabled={logoutLoading}
//                   className="flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <span className="material-icons text-gray-500">
//                     {logoutLoading ? 'hourglass_empty' : 'logout'}
//                   </span>
//                   <span className="text-xs text-gray-600">
//                     {logoutLoading ? 'Logging out...' : 'Logout'}
//                   </span>
//                 </button>
//               </div>
//             </div>
//           </div>
          
//           {/* Overlay */}
//           <div 
//             className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
//             onClick={() => setMenuOpen(false)}
//           />
//         </>
//       )}
//     </header>
//   );
// };

// export default Navbar;