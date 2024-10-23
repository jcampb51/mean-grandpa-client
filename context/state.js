import { createContext, useContext, useEffect, useState } from "react";
import { getUserProfile } from "../data/auth";
import { useRouter } from "next/router";

const AppContext = createContext();

export function AppWrapper({ children }) {
  const [profile, setProfile] = useState({});
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const authRoutes = ["/login", "/register"];
    if (token) {
      localStorage.setItem("token", token);

      document.cookie = `token=${token}; path=/;`;

      if (!authRoutes.includes(router.pathname)) {
        getUserProfile().then((profileData) => {
          if (profileData) {
            setProfile(profileData);
          }
        });
      }
    } else {
      setProfile({}); // Clear profile when token is removed
    }
  }, [token, router.pathname]);

  return (
    <AppContext.Provider value={{ profile, token, setToken, setProfile }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
