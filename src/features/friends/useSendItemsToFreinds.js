import { useMutation } from "@tanstack/react-query";
import getListIdsOfFriendIds from "../../services/apiFriends";
import { useSession } from "../../contexts/SessionContext";
import { insertItemsFromListIds } from "../../services/apiUserList";

export function useSendItemsToFriends() {
  //   const queryClient = useQueryClient();
  const {
    session: {
      user: { id: user_id },
    },
  } = useSession();
  const { isLoading: isSending, mutate: sendItemsToFriendIds } = useMutation({
    mutationFn: async ({ value, type, friendIds }) => {
      const listIdsRes = await getListIdsOfFriendIds({
        owner_id: user_id,
        friendIds,
      });
      const listIds = listIdsRes.map((res) => res.list_id);
      const data = await insertItemsFromListIds({ value, type, listIds });
      return data;
    },
    onSuccess: ({ data }) => {
      alert("Sent Succesfully");
    },
    onError: (error) => {
      if (error.code === "23505") {
        alert("Sent already");
      } else {
        console.error(error);
      }
    },
  });
  return { isSending, sendItemsToFriendIds };
}
