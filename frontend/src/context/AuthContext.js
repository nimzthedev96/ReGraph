/* 
  Authentication context
  
  Context provider for managing global authentication state across the app.
  Also manages the JWT token returned from the backend API that is then used
  in all other API calls.
*/

import { createContext, useState, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email, password) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/user/loginUser",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("jwt_token", "Bearer " + data.token);
        setToken("Bearer " + data.token);
        setIsAuthenticated(true);
        return true;
      }

      localStorage.removeItem("jwt_token");
      setToken(null);
      setIsAuthenticated(false);
      return false;
    } catch (e) {
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
