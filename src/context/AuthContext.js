import { createContext, useContext, useState } from 'react';
import { readStorage, writeStorage } from '../utils/storage';

const AuthContext = createContext(null);
const KEY = 'marquee_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStorage(KEY, null));

  const login = (username) => {
    const next = { username: username.trim() };
    setUser(next);
    writeStorage(KEY, next);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(KEY);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}