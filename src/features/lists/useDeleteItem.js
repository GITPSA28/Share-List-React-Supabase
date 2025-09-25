import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteItemFromList } from "../../services/apiUserList";
import toast from "react-hot-toast";

export function useDeleteItem({ item, list_id }) {
  const queryClient = useQueryClient();
  const { isLoading: isDeleting, mutate: deleteItem } = useMutation({
    mutationFn: () => deleteItemFromList({ item, list_id }),
    onMutate: () => {
      toast.loading("Deleting..", { id: "delete" });
    },
    onSuccess: ({ data }) => {
      toast.success("Deleted Succesfully", { id: "delete" });
      queryClient.invalidateQueries({ queryKey: ["user-lists"] });
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
    },
    onError: (error) => {
      toast.error("Error while Deleting", { id: "delete" });
    },
  });
  return { isDeleting, deleteItem };
}
