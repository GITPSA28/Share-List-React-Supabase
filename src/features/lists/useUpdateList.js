import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateList } from "../../services/apiUserList";

export function useUpdateList({ list_id }) {
  const queryClient = useQueryClient();
  const { isLoading: isUpdating, mutate: updateListDetails } = useMutation({
    mutationFn: async ({ list_name, visibility }) => {
      const data = await updateList({ list_name, list_id, visibility });
      return data;
    },
    onMutate: () => {
      toast.loading("Updating new list..", { id: "update-list" });
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ["lists"],
      });
      toast.success("Updated Succesfully", { id: "update-list" });
    },
    onError: (error) => {
      toast.error("Error while Updating", { id: "update-list" });
    },
  });
  return { isUpdating, updateListDetails };
}
