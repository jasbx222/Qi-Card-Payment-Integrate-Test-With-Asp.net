import { createContext, useContext, useState, type ReactNode } from 'react';
import { authApi, setToken, getToken } from '../api/client';
import type { LoginResponse } from '../api/types';

interface AuthState {
  token: string | null;
  userName: string | null;
  phoneNumber: string | null;
  roles: string[];
  isAdmin: boolean;
  login: (phone: string, password: string) => Promise<LoginResponse>;
  register: (username: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTok] = useState(getToken);
  const [userName, setUserName] = useState<string | null>(
    localStorage.getItem('orbita_user') || null
  );
  const [phoneNumber, setPhone] = useState<string | null>(
    localStorage.getItem('orbita_phone') || null
  );
  const [roles, setRoles] = useState<string[]>(
    JSON.parse(localStorage.getItem('orbita_roles') || '[]')
  );

  const login = async (phone: string, password: string) => {
    const res = await authApi.login(phone, password);
    if (!res.isSuccess || !res.token) throw new Error(res.message || 'فشل تسجيل الدخول');
    setToken(res.token);
    setTok(res.token);
    setUserName(res.userName || null);
    setPhone(res.phoneNumber || null);
    setRoles(res.roles || []);
    localStorage.setItem('orbita_user', res.userName || '');
    localStorage.setItem('orbita_phone', res.phoneNumber || '');
    localStorage.setItem('orbita_roles', JSON.stringify(res.roles || []));
    return res;
  };

  const register = async (username: string, phone: string, password: string) => {
    await authApi.register(username, phone, password);
  };

  const logout = () => {
    setToken(null);
    setTok(null);
    setUserName(null);
    setPhone(null);
    setRoles([]);
    localStorage.removeItem('orbita_user');
    localStorage.removeItem('orbita_phone');
    localStorage.removeItem('orbita_roles');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userName,
        phoneNumber,
        roles,
        isAdmin: roles.includes('Admin'),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth outside provider');
  return ctx;
}
