import React, { createContext, useState, ReactNode, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { AxiosResponse } from "axios";

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
}
export interface User {
  email: string;
}
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {}
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = async () => {
    setIsLoggedIn(false);
    await axiosClient.post("/auth/logout");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = (await axiosClient.get("/auth/user")) as AxiosResponse<{
          data: User;
          success: boolean;
        }>;
        setUser(res.data.data);
        setIsLoggedIn(true);
      } catch (err) {
        setUser(null);
        setIsLoggedIn(false);
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
