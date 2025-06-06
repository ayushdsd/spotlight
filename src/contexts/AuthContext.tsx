import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- USER INTERFACE ---
export interface User {
  id: string;
  _id?: string; // Add for backend compatibility
  name: string;
  email: string;
  picture?: string;
  role: 'artist' | 'recruiter';
  token?: string; // Add for backend compatibility
  portfolioLink?: string; // Add portfolioLink for artist sidebar
}

interface AuthContextType {
  user: User | null;
  login: (userData: { sub: string; name: string; email: string; picture?: string; role: 'artist' | 'recruiter'; token: string }) => Promise<void>;
  logout: () => void;
  setPortfolioLink: (link: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (!storedUser || !token) {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (error) {
      console.error('Error reading user data from localStorage:', error);
      return null;
    }
  });

  const navigate = useNavigate();

  // Verify token on mount and periodically
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          logout();
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Token verification failed');
        }
      } catch (error) {
        console.error('Token verification error:', error);
        logout();
      }
    };

    verifyToken();
    const interval = setInterval(verifyToken, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const login = async (userData: { sub: string; name: string; email: string; picture?: string; role: 'artist' | 'recruiter'; token: string }) => {
    try {
      if (!userData.token) {
        throw new Error('No token provided');
      }

      console.log('Login data received:', userData);

      // Transform Google user data into our User type
      const newUser: User = {
        id: userData.sub,
        name: userData.name,
        email: userData.email,
        picture: userData.picture,
        role: userData.role,
        token: userData.token, // Ensure token is included in user object
      };

      // Store data in localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', userData.token);
      
      // Update state
      setUser(newUser);
      
      console.log('User logged in successfully:', newUser);
      console.log('Navigating to:', userData.role === 'artist' ? '/artist/dashboard' : '/recruiter/dashboard');

      // Navigate based on role
      if (userData.role === 'artist') {
        navigate('/artist/dashboard');
      } else {
        navigate('/recruiter/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  // Update user data and localStorage
  const updateUser = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  // Add a method to update portfolioLink for the logged-in user
  const setPortfolioLink = (link: string) => {
    if (user) {
      const updatedUser = { ...user, portfolioLink: link };
      updateUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setPortfolioLink }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
