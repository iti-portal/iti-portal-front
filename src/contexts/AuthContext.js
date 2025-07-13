import React, { createContext, useContext, useState, useEffect } from 'react';
import { logoutUser } from '../features/auth/services/authAPI';
import { getUserProfile } from '../services/profileService';

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
        console.log('AuthContext: User object from localStorage in checkAuthStatus (initial set):', parsedUser);
        setUser(parsedUser); // Immediately set user from local storage

        // Try to fetch fresh profile data if token exists, passing the parsedUser as prevUser
        try {
          const freshProfile = await refreshUserProfile(parsedUser);
          if (freshProfile) {
            // If refresh was successful and returned data, update the user state with fresh data
            setUser(freshProfile);
          }
        } catch (error) {
          console.warn('AuthContext: Could not refresh user profile after initial set:', error);
          // If refresh fails, the user state remains parsedUser, which is desired.
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

  const refreshUserProfile = async (prevUser = null) => {
    try {
      const profileResponse = await getUserProfile();
      if (profileResponse.success && profileResponse.data?.user) {
        let freshUserData = profileResponse.data.user;
        console.log('AuthContext: freshUserData from profile API:', freshUserData);
        // Ensure role is preserved if not present in fresh data
        if (!freshUserData.role && prevUser?.role) {
          freshUserData = { ...freshUserData, role: prevUser.role };
          console.log('AuthContext: Role preserved from prevUser:', freshUserData.role);
        } else if (freshUserData.role) {
          console.log('AuthContext: Fresh user data includes role:', freshUserData.role);
        } else {
          console.warn('AuthContext: Role missing from fresh user data and prevUser.role is undefined.');
        }
        setUser(freshUserData); // This updates the state
        localStorage.setItem('user', JSON.stringify(freshUserData));
        return freshUserData;
      } else {
        console.warn('⚠️ Invalid profile response:', profileResponse);
      }
    } catch (error) {
      console.error('❌ Error refreshing user profile:', error);
      throw error;
    }
  };

  const login = async (userData, token) => {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('AuthContext: User object after login call (login function):', userData);
      setUser(userData);
      setIsAuthenticated(true);
      // Try to fetch fresh profile data after login, preserving role if missing
      try {
        await refreshUserProfile(userData);
      } catch (error) {
        console.warn('Could not refresh profile after login:', error);
        // Keep the login data even if profile refresh fails
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
