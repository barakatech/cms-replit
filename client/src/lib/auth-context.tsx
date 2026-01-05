import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_CREDENTIALS = {
  email: 'admin@getbaraka.com',
  password: 'password123',
};

const AUTH_STORAGE_KEY = 'baraka_cms_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.email) {
          setIsAuthenticated(true);
          setUserEmail(data.email);
        }
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      setIsAuthenticated(true);
      setUserEmail(email);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ email }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    return {
      isAuthenticated: false,
      userEmail: null,
      login: () => false,
      logout: () => {},
    };
  }
  return context;
}

export { DEMO_CREDENTIALS };
