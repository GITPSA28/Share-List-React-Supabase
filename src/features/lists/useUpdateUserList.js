import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteItemFromList,
  insertItemsFromListIds,
} from "../../services/apiUserList";
import toast from "react-hot-toast";

export function useUpdateListItems({ item }) {
  const queryClient = useQueryClient();
  const { isLoading: isUpdating, mutate: updateList } = useMutation({
    mutationFn: async ({ value, type, lists }) => {
      const reqs = lists.map((list) => {
        if (list.checked)
          return insertItemsFromListIds({
            value,
            type,
            listIds: [list.list_id],
          });
        else return deleteItemFromList({ item: value, list_id: list.list_id });
      });
      const data = await Promise.allSettled(reqs);
      return data;
    },
    onMutate: () => {
      toast.loading("Updating List...", { id: "update" });
    },
    onSuccess: ({ data }) => {
      toast.success("Updated Succesfully", { id: "update" });
      queryClient.invalidateQueries({ queryKey: ["user-lists", item] });
    },
    onError: (error) => {
      toast.error("Error while Updating", { id: "update" });
      queryClient.invalidateQueries({ queryKey: ["user-lists", item] });
    },
  });
  return { isUpdating, updateList };
}
