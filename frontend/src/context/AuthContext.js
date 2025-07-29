import { createContext, useState, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("jwt_token"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:3002/user/loginUser", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("jwt_token", "Bearer " + data.token);
        setToken("Bearer " + data.token);
        setIsAuthenticated(true);
        return true;
      }

      console.log(data.message);
      localStorage.removeItem("jwt_token");
      setToken(null);
      setIsAuthenticated(false);
      return false;
    } catch (e) {
      //do something with the error...
      console.log(e);
      localStorage.removeItem("jwt_token");
      setToken(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("jwt_token");
  };

  const authContextValue = {
    token,
    login,
    logout,
    isAuthenticated,
  };
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
