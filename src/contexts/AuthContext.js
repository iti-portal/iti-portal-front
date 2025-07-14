import React, { createContext, useContext, useState, useEffect } from 'react';
import { logoutUser } from '../features/auth/services/authAPI';
import { getUserProfile } from '../services/profileService';
import { fetchCompanyProfile } from '../services/company-profileApi';
import { USER_ROLES } from '../features/auth/types/auth.types';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        setIsAuthenticated(true);
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser); // Immediately set user from local storage for quick UI feedback

        // Try to fetch fresh profile data. The refreshUserProfile function will handle updating the state.
        try {
          await refreshUserProfile(parsedUser);
        } catch (error) {
          console.warn('AuthContext: Could not refresh user profile on initial load:', error);
          // If refresh fails, the user state remains the one from localStorage, which is desired.
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserProfile = async (userOverride = null) => {
    // Determine the user object to work with, prioritizing the direct parameter
    const userToRefresh = userOverride || user;

    if (!userToRefresh?.role) {
      console.warn('AuthContext: refreshUserProfile called, but no user is available.');
      return null; // Return null to indicate no update was made
    }

    try {
      let finalUpdatedUser = null;

      // COMBINED LOGIC: Use role-aware fetching from Code A
      if (userToRefresh.role === USER_ROLES.COMPANY) {
        console.log('AuthContext: Refreshing profile for a COMPANY user...');
        const response = await fetchCompanyProfile();
        
        // The company profile API returns the profile directly in `response.data`
        if (response.data) {
          // Merge the fresh profile data into the existing user object
          finalUpdatedUser = { ...userToRefresh, profile: response.data };
        } else {
          console.warn('⚠️ Invalid company profile response:', response);
        }
      } else {
        console.log('AuthContext: Refreshing profile for a STUDENT/ADMIN user...');
        const response = await getUserProfile();
        
        if (response.success && response.data?.user) {
          let freshUserData = response.data.user;
          
          // COMBINED LOGIC: Use defensive role preservation from Code B
          if (!freshUserData.role && userToRefresh?.role) {
            freshUserData.role = userToRefresh.role;
            console.log('AuthContext: Role preserved from previous user state:', freshUserData.role);
          }
          finalUpdatedUser = freshUserData;
        } else {
          console.warn('⚠️ Invalid user profile response:', response);
        }
      }

      if (finalUpdatedUser) {
        console.log('AuthContext: Fresh user data prepared:', finalUpdatedUser);
        setUser(finalUpdatedUser);
        localStorage.setItem('user', JSON.stringify(finalUpdatedUser));
        return finalUpdatedUser; // Return the fresh data so the caller knows it succeeded
      }
      return null; // Return null if no update was made

    } catch (error) {
      console.error('❌ Error during API call in refreshUserProfile:', error);
      throw error; // Propagate error to the caller
    }
  };

  const login = async (userData, token) => {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      
      // Try to fetch fresh profile data after login
      try {
        await refreshUserProfile(userData);
      } catch (error) {
        console.warn('Could not refresh profile after login:', error);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if API call fails, ensure user is logged out on the client-side
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
      return { success: false, error: error.message || 'Logout failed' };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuthStatus,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};