import { createContext, useContext, useState, ReactNode } from 'react';
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
  login: (userData: { sub: string; name: string; email: string; picture?: string; role: 'artist' | 'recruiter'; token: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate();

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
      
      // Navigate after state is updated
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/auth');
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
