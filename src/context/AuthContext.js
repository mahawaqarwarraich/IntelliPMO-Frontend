import { createContext, useContext, useState, useEffect } from 'react';
import { TOKEN_KEY } from '../api/client.js';

const AUTH_USER_KEY = 'authUser';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // On load: restore user from localStorage if we have saved auth
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.token && parsed.role) {
          setUserState(parsed);
          localStorage.setItem(TOKEN_KEY, parsed.token);
        }
      }
    } catch (e) {
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
    setIsReady(true);
  }, []);

  const login = (userData) => {
    const { id, token, role } = userData;
    if (!id || !token || !role) return;
    const u = { id, token, role };
    setUserState(u);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(u));
    localStorage.setItem(TOKEN_KEY, token);
  };

  const logout = () => {
    setUserState(null);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  // when access backedn api, it return 401, then we call logout that clear
  // user and navigate to login page

  const value = { user, login, logout, isReady };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
