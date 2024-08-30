import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const stringifyUserData = window.localStorage.getItem("userData");

    if (stringifyUserData) {
      try {
        const userData = JSON.parse(stringifyUserData);
        if (userData && userData.user) {
          setAuth(userData.user);
        } else {
          setAuth(null);
        }
      } catch (error) {
        console.error("Failed to parse userData from localStorage:", error);
        setAuth(null);
      }
    } else {
      setAuth(null);
    }

    const handleTokenExpired = () => {
      window.localStorage.removeItem("userData");
      window.localStorage.removeItem("userRole");
      setAuth(null);
      navigate("/login");
    };

    window.addEventListener("tokenExpired", handleTokenExpired);

    return () => {
      window.removeEventListener("tokenExpired", handleTokenExpired);
    };
  }, [navigate, location]);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const auth = useContext(AuthContext);
  return auth;
};
