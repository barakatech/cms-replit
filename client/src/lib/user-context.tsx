import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { PRESENCE_COLORS } from '@shared/schema';

interface User {
  id: string;
  name: string;
  color: string;
  avatarUrl?: string;
}

interface UserContextType {
  user: User;
  setUserName: (name: string) => void;
}

const UserContext = createContext<UserContextType | null>(null);

function generateUserId(): string {
  const stored = localStorage.getItem('cms_user_id');
  if (stored) return stored;
  const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('cms_user_id', newId);
  return newId;
}

function getStoredUserName(): string {
  return localStorage.getItem('cms_user_name') || '';
}

function generateUserColor(userId: string): string {
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return PRESENCE_COLORS[hash % PRESENCE_COLORS.length];
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(() => {
    const id = generateUserId();
    const storedName = getStoredUserName();
    return {
      id,
      name: storedName || `Editor ${id.slice(-4)}`,
      color: generateUserColor(id),
    };
  });

  const setUserName = (name: string) => {
    localStorage.setItem('cms_user_name', name);
    setUser(prev => ({ ...prev, name }));
  };

  useEffect(() => {
    if (!getStoredUserName()) {
      const defaultName = `Editor ${user.id.slice(-4)}`;
      setUserName(defaultName);
    }
  }, [user.id]);

  return (
    <UserContext.Provider value={{ user, setUserName }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
