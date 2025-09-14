import { useMutation } from "@tanstack/react-query";
import getListIdsOfFriendIds from "../../services/apiFriends";
import { useSession } from "../../contexts/SessionContext";
import { insertItemsFromListIds } from "../../services/apiUserList";
import toast from "react-hot-toast";

export function useSendItemsToFriends() {
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
    onMutate: () => {
      toast.loading("Sending..", { id: "send" });
    },
    onSuccess: ({ data }) => {
      toast.success("Sent Succesfully", { id: "send" });
    },
    onError: (error) => {
      console.log(error);
      if (error.code === "23505") {
        toast.error("Sent already", { id: "send" });
      } else {
        toast.error("Error while sending", { id: "send" });
      }
    },
  });
  return { isSending, sendItemsToFriendIds };
}
