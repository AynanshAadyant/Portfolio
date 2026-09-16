import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminApi } from '../api/admin';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin_token'));

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getMe();
      if (res?.authenticated) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setToken(null);
        localStorage.removeItem('admin_token');
      }
    } catch {
      setIsAuthenticated(false);
      setToken(null);
      localStorage.removeItem('admin_token');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await adminApi.login(password);
      if (res.token) {
        localStorage.setItem('admin_token', res.token);
        setToken(res.token);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Authentication token not received.' };
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Invalid admin password. Please try again.';
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    try {
      await adminApi.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('admin_token');
      setToken(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        token,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export default AdminAuthContext;
