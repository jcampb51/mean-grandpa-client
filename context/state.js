import { createContext, useContext, useState } from "react";
import { useUserQuery } from "./userQueries";

const AppContext = createContext();

export function AppWrapper({ children }) {
  const { user } = useUserQuery(); // Get user and token from the query hook

  return (
    <AppContext.Provider value={{ profile: user }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
