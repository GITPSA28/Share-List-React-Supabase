import { useQuery } from "@tanstack/react-query";
import { getFriendsDetails } from "../../services/apiFriends";
import { useSession } from "../../contexts/SessionContext";

export function useFriends({ status }) {
  const {
    session: {
      user: { id: user_id },
    },
  } = useSession();
  const { isLoading, data, refetch, isRefetching, error, isRefetchError } =
    useQuery({
      queryKey: ["friends", status],
      queryFn: () => getFriendsDetails(user_id, status),
    });
  return {
    isLoading,
    friends: data,
    error,
    refetch,
    isRefetching,
    isRefetchError,
  };
}
