import { useQuery } from "@tanstack/react-query";
import { getUserLists } from "../../services/apiUserList";
import { useSession } from "../../contexts/SessionContext";

export default function useUsersList() {
  const {
    session: {
      user: { id: user_id },
    },
  } = useSession();
  const {
    data: lists,
    error,
    isLoading,
  } = useQuery({
    queryFn: async () => getUserLists({ user_id }),
    queryKey: ["user-lists"],
  });

  return { lists, error, isLoading };
}
