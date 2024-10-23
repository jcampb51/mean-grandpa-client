import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserProfile } from "../data/auth";

export function useUserQuery() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getUserProfile,
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  const setUserToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      document.cookie = `token=${newToken}; path=/;`;
      queryClient.invalidateQueries({ queryKey: ["user"] });
    } else {
      localStorage.removeItem("token");
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      queryClient.setQueryData(["user"], null);
    }
  };

  return {
    user,
    isLoading,
    error,
    setUserToken,
  };
}
