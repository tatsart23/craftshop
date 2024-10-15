import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem("user") || null);
  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const navigate = useNavigate();

  const loginAction = async (data) => {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      if (res.token !== null) {
        setUser(res.username);
        setToken(res.token);
        localStorage.setItem("site", res.token);
        localStorage.setItem("user", res.username);
        navigate("/");
        return
      }
      throw new Error(res.message);
    } catch (err) {
      console.error(err);
    }
  }

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("site");
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider value={{ user, token, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );

}

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
}