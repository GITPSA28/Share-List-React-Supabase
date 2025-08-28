import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    mutate: login,
    isLoading,
    error,
  } = useMutation({
    mutationFn: () => loginApi(),
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user.user);
      navigate("/home", { replace: true });
    },
    onError: (e) => console.error("Login failed :" + e.message),
  });
  return { login, isLoading, error };
}
