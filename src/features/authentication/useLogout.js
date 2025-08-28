import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logOut as logOutApi } from "../../services/apiAuth";
import { useNavigate } from "react-router";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    mutate: logout,
    error,
    isLoading,
  } = useMutation({
    mutationFn: logOutApi,
    onError: () => {
      alert("Error while Signing out");
    },
    onSuccess: () => {
      alert("Logged Out successfully");
      queryClient.invalidateQueries({ active: true });
      navigate("/login", { replace: true });
    },
  });
  return { logout, error, isLoading };
}
