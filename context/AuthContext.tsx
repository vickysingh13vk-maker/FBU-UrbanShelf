import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role, Permission } from '../types';
import { USERS, ROLES } from '../data';

interface AuthContextType {
  user: User | null;
  role: Role | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (module: string, action: 'view' | 'create' | 'edit' | 'delete') => boolean;
  isAuthenticated: boolean;
  markOnboardingComplete: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      const userRole = ROLES.find(r => r.id === parsedUser.roleId);
      if (userRole) setRole(userRole);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = USERS.find(u => u.email === email && u.password === password);
    if (foundUser) {
      if (foundUser.status !== 'Active') {
        throw new Error('Your account is suspended. Please contact admin.');
      }
      // Preserve onboarding status from previous sessions
      const onboardingStore = JSON.parse(localStorage.getItem('fbu_onboarding_data') || '{}');
      const hasCompletedOnboarding = foundUser.onboardingCompleted || !!onboardingStore[foundUser.id];
      const userToSave = {
        ...foundUser,
        onboardingCompleted: hasCompletedOnboarding,
      };
      setUser(userToSave);
      const userRole = ROLES.find(r => r.id === foundUser.roleId);
      if (userRole) setRole(userRole);
      localStorage.setItem('auth_user', JSON.stringify(userToSave));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('auth_user');
  };

  const markOnboardingComplete = () => {
    if (user) {
      const updated = { ...user, onboardingCompleted: true };
      setUser(updated);
      localStorage.setItem('auth_user', JSON.stringify(updated));
    }
  };

  const hasPermission = (module: string, action: 'view' | 'create' | 'edit' | 'delete'): boolean => {
    if (!role) return false;
    const modulePermission = role.permissions.find(p => p.module === module);
    if (!modulePermission) return false;
    return modulePermission[action];
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      login,
      logout,
      hasPermission,
      isAuthenticated: !!user,
      markOnboardingComplete,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
