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
        // console.log('AuthContext: User object from localStorage in checkAuthStatus (initial set):', parsedUser);
        setUser(parsedUser); // Immediately set user from local storage
        
        // Try to fetch fresh profile data if token exists
        try {
          await refreshUserProfile(parsedUser);
        } catch (error) {
          console.warn('Could not refresh user profile:', error);
          // Keep the stored user data even if profile refresh fails
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
    const userToRefresh = userOverride || user;

    if (!userToRefresh?.role) {
      console.warn('refreshUserProfile called, but no user is available.');
      return;
    }

    try {
      let finalUpdatedUser = null;

      if (userToRefresh.role === USER_ROLES.COMPANY) {
        console.log('🔄 Refreshing as COMPANY...');
        const response = await fetchCompanyProfile();
        
        if (response.data) {
          finalUpdatedUser = { ...userToRefresh, profile: response.data };
        } else {
          console.warn('⚠️ Invalid company profile response:', response);
        }
      } else {
        console.log('🔄 Refreshing as STUDENT/ADMIN...');
        const response = await getUserProfile();
        
        if (response.data && response.data.user) {
          finalUpdatedUser = response.data.user;
        } else {
          console.warn('⚠️ Invalid user profile response:', response);
        }
      }

      if (finalUpdatedUser) {
        setUser(finalUpdatedUser);
        localStorage.setItem('user', JSON.stringify(finalUpdatedUser));
      }

    } catch (error) {
      console.error('❌ Error during API call in refreshUserProfile:', error);
      throw error;
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
      
      // Call logout API
      await logoutUser();
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Update state
      setIsAuthenticated(false);
      setUser(null);
      
      return { success: true };
    } catch (error) {
      console.error('Error during logout:', error);
      
      // Even if API call fails, clear local data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
      
      return { 
        success: false, 
        error: error.message || 'Logout failed' 
      };
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
