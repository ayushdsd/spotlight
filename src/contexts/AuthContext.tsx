import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  role: 'artist' | 'recruiter';
}

interface AuthContextType {
  user: User | null;
  login: (userData: { sub: string; name: string; email: string; picture?: string; role: 'artist' | 'recruiter'; token: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (userData: { sub: string; name: string; email: string; picture?: string; role: 'artist' | 'recruiter'; token: string }) => {
    try {
      // Transform Google user data into our User type
      const newUser: User = {
        id: userData.sub,
        name: userData.name,
        email: userData.email,
        picture: userData.picture,
        role: userData.role,
      };

      // Store data first
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', userData.token);
      
      // Update state
      setUser(newUser);
      
      // Wait a bit to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Navigate
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during login:', error);
      // Clear any partial data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
