import { useQuery } from "@tanstack/react-query";
import { getUserLists } from "../../services/apiUserList";

export default function useUserLists({ user_id }) {
  const {
    isLoading,
    data: lists,
    error,
  } = useQuery({
    queryKey: ["lists", user_id],
    queryFn: () => getUserLists({ user_id }),
    retry: false,
  });

  return {
    isLoading,
    error,
    lists,
  };
}
