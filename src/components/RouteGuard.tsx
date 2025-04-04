import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  role: 'artist' | 'recruiter';
}

interface RouteGuardProps {
  children: ReactNode | ((props: { user: User }) => ReactNode);
  allowedRoles?: ('artist' | 'recruiter')[];
}

export default function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (typeof children === 'function') {
    return <>{children({ user })}</>;
  }

  return <>{children}</>;
}
