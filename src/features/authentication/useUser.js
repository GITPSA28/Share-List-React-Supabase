import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";
import { useSession } from "../../contexts/SessionContext";

export function useUser() {
  const {
    session: { user: userData },
  } = useSession();
  const { isLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      return userData;
    },
  });
  return {
    isLoading,
    user,
    isAuthenticated: user?.role === "authenticated",
  };
}
