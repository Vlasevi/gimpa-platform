import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'coordinadora' | 'profesor' | 'estudiante';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole | null;
  user: User | null;
  setAuth: (user: User, role: UserRole) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_AUTH = true; // TODO(prod): Set to false for production
const STORAGE_KEY = 'auth_session';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Rehydrate session from localStorage on mount
  useEffect(() => {
    if (MOCK_AUTH) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const { user: storedUser, role: storedRole } = JSON.parse(stored);
          setUser(storedUser);
          setRole(storedRole);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing stored auth:', error);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } else {
      // TODO(prod): Fetch current session from backend
      // fetch('/api/me')
      //   .then(res => res.json())
      //   .then(data => {
      //     if (data.user && data.role) {
      //       setAuth(data.user, data.role);
      //     }
      //   })
      //   .catch(console.error);
    }
  }, []);

  const setAuth = (newUser: User, newRole: UserRole) => {
    setUser(newUser);
    setRole(newRole);
    setIsAuthenticated(true);

    if (MOCK_AUTH) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user: newUser, role: newRole })
      );
    }
  };

  const clearAuth = () => {
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);

    if (MOCK_AUTH) {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, user, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
