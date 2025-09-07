import { useQuery } from "@tanstack/react-query";
import { getFriendStatus } from "../../services/apiFriends";
import { useSession } from "../../contexts/SessionContext";

export function useFriendship({ friend_id }) {
  const {
    session: {
      user: { id: user_id },
    },
  } = useSession();
  const { isLoading, data, refetch, isRefetching, error, isRefetchError } =
    useQuery({
      queryKey: ["friendship", friend_id],
      queryFn: () => getFriendStatus(user_id, friend_id),
    });
  return {
    isLoading,
    friendship: data,
    error,
    refetch,
    isRefetching,
    isRefetchError,
  };
}
