import React, { createContext, useState, useContext, useEffect } from 'react';

const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@srmap.edu.in',
    password: 'admin123',
    name: 'Admin',
    role: 'admin',
  },
  {
    id: '2',
    email: 'trainer.crcs@srmap.edu.in',
    password: 'teacher123',
    name: 'Teacher User',
    role: 'teacher',
  },
];

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      setLoading(false);
      throw new Error('Invalid email or password');
    }

    const { password: _, ...userWithoutPassword } = user;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    setLoading(false);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    isTeacher: currentUser?.role === 'teacher',
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
