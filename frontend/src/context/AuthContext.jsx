import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('rasa_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.data.success && (res.data.user.role === 'artist' || res.data.user.role === 'audience')) {
          setUser(res.data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Failed to verify session token:', err.message);
        const savedUser = localStorage.getItem('rasa_user_cache');
        if (savedUser) {
          try {
            const parsed = JSON.parse(savedUser);
            if (parsed.role === 'artist' || parsed.role === 'audience') {
              setUser(parsed);
            } else {
              logout();
            }
          } catch (e) {
            logout();
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('rasa_token', res.data.token);
      localStorage.setItem('rasa_user_cache', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('rasa_token', res.data.token);
      localStorage.setItem('rasa_user_cache', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('rasa_token');
    localStorage.removeItem('rasa_user_cache');
  };

  const updateUser = (updates) => {
    setUser(prev => {
      const merged = { ...prev, ...updates };
      localStorage.setItem('rasa_user_cache', JSON.stringify(merged));
      return merged;
    });
  };

  // Quick 1-click Demo logins for hackathon evaluation (TWO ROLES ONLY: Artist & Audience)
  const demoLogin = async (role = 'artist') => {
    if (role === 'audience') {
      return login('rahul@rasacue.art', 'Audience123!');
    }
    return login('ananya@rasacue.art', 'Artist123!');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        demoLogin,
        updateUser,
        isArtist: user?.role === 'artist',
        isAudience: user?.role === 'audience'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
