import { useQuery } from "@tanstack/react-query";
import { useSession } from "../../contexts/SessionContext";
import { getUsersRecommendations } from "../../services/apiUserList";

export default function useRecommendations() {
  const {
    session: {
      user: { id: user_id },
    },
  } = useSession();
  const {
    isLoading,
    data: items,
    error,
  } = useQuery({
    queryKey: ["recommendations"],
    queryFn: () => getUsersRecommendations({ user_id }),
    retry: false,
  });

  return {
    isLoading,
    error,
    items,
  };
}
