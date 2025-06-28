import { createContext, useContext, useState, useEffect } from "react";

import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // cargar user desde token si existe
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUser({ id: decoded.id, email: decoded.email });
    }
  }, []);

  const login = (token) => {
    const decoded = jwtDecode(token);
    localStorage.setItem("token", token);
    setUser({ id: decoded.id, email: decoded.email });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
