/**
 * context/AuthContext.jsx — Authentication context provider.
 *
 * Manages current user state, login/logout/register actions,
 * and exposes the auth state tree to the entire component tree.
 */

import { createContext, useState, useEffect, useCallback } from 'react';
import { getMe, loginUser, registerUser, logoutUser } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const userData = await getMe();
      setUser(userData);
    } catch {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (credentials) => {
    const result = await loginUser(credentials);
    localStorage.setItem('token', result.token);
    setUser(result.user);
    return result;
  };

  const register = async (payload) => {
    const result = await registerUser(payload);
    localStorage.setItem('token', result.token);
    setUser(result.user);
    return result;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // proceed with local logout even if server call fails
    }
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
