import { createContext, useContext, useState, useEffect } from 'react';

// Create context
const UserContext = createContext();

export function UserProvider({ children }) {
  const [token, setToken] = useState(null);
  const [isStaff, setIsStaff] = useState(false);

  // Function to set user token and staff status
  const setUserToken = (newToken, staffStatus = false) => {
    setToken(newToken);
    setIsStaff(staffStatus);
    // Store in localStorage to persist across sessions
    localStorage.setItem('token', newToken);
    localStorage.setItem('is_staff', staffStatus);
  };

  // Load token and staff status from localStorage on load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedIsStaff = localStorage.getItem('is_staff') === 'true'; // Retrieve as boolean
    if (storedToken) {
      setToken(storedToken);
      setIsStaff(storedIsStaff);
    }
  }, []);

  return (
    <UserContext.Provider value={{ token, isStaff, setUserToken }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use user context
export const useUserQuery = () => {
  return useContext(UserContext);
};
