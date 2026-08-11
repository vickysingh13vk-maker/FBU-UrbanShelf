import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Where to send a user who lands on a route their role doesn't own.
const ROLE_HOME: Record<string, string> = {
  'Sales Rep': '/sales/dashboard',
  'Sales Manager': '/sales-manager/dashboard',
  Supplier: '/supplier/dashboard',
};

interface Props {
  roles: string[];
  children: React.ReactNode;
}

// Guards a route to specific roleNames. Admin always passes. Unauthenticated
// users render nothing here — Layout's own effect already redirects to /login.
export const RequireRole: React.FC<Props> = ({ roles, children }) => {
  const { user } = useAuth();
  if (!user) return null;
  if (user.roleName === 'Admin' || (user.roleName && roles.includes(user.roleName))) {
    return <>{children}</>;
  }
  return <Navigate to={ROLE_HOME[user.roleName ?? ''] ?? '/'} replace />;
};
