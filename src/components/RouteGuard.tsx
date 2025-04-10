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
  console.log('RouteGuard:', { user, allowedRoles });

  if (!user) {
    console.log('No user found, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log('User role not allowed:', { userRole: user.role, allowedRoles });
    // Redirect to the appropriate dashboard based on role
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  if (typeof children === 'function') {
    return <>{children({ user })}</>;
  }

  return <>{children}</>;
}
