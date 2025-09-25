import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteItemUsingId } from "../../services/apiUserList";
import toast from "react-hot-toast";

export function useDeleteItem({ item_id }) {
  const queryClient = useQueryClient();
  const { isLoading: isDeleting, mutate: deleteItem } = useMutation({
    mutationFn: () => deleteItemUsingId({ item_id }),
    onMutate: () => {
      toast.loading("Deleting..", { id: "delete" });
    },
    onSuccess: () => {
      toast.success("Deleted Succesfully", { id: "delete" });
      queryClient.invalidateQueries({
        queryKey: ["user-lists"],
      });
      queryClient.invalidateQueries({
        queryKey: ["recommendations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["list"],
      });
    },
    onError: (error) => {
      toast.error("Error while Deleting", { id: "delete" });
    },
  });
  return { isDeleting, deleteItem };
}
