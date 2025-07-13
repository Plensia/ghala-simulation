import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START': return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS': return { ...state, user: action.payload, loading: false, error: null };
    case 'AUTH_FAILURE': return { ...state, user: null, loading: false, error: action.payload };
    case 'LOGOUT': return { ...state, user: null, loading: false, error: null };
    case 'CLEAR_ERROR': return { ...state, error: null };
    default: return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      dispatch({ type: 'AUTH_SUCCESS', payload: JSON.parse(user) });
    } else {
      dispatch({ type: 'AUTH_FAILURE', payload: 'No session found' });
    }
  }, []);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.login(credentials);
      const { token, merchant } = response.data || { token: 'mock-token', merchant: { businessName: 'Test Merchant', email: 'test@ghala.com' } };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(merchant));
      dispatch({ type: 'AUTH_SUCCESS', payload: merchant });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.response?.data?.error || 'Login failed' });
      return { success: false, error: error.response?.data?.error };
    }
  };

  const logout = () => {
    authAPI.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <AuthContext.Provider value={{ ...state, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};