import React, { createContext, useContext, useState, useMemo } from 'react';
import { login, SysUser } from '../../../ExamenIonic/src/api/examen';

type AuthState = {
  user: SysUser | null;
  loginWithCredentials: (user: string, pass: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<SysUser | null>(null);

  const loginWithCredentials = async (u: string, p: string) => {
    const me = await login(u, p);
    setUser(me);
    return !!me;
  };

  const logout = () => setUser(null);

  const value = useMemo(() => ({ user, loginWithCredentials, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
