import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteList } from "../../services/apiUserList";

export function useDeleteList() {
  const queryClient = useQueryClient();
  const { isLoading: isDeleting, mutate: deleteListById } = useMutation({
    mutationFn: deleteList,
    onMutate: () => {
      toast.loading("Deleting list..", { id: "delete-list" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lists"],
      });
      toast.success("Deleted Succesfully", { id: "delete-list" });
    },
    onError: (error) => {
      toast.error("Error while Deleting", { id: "delete-list" });
    },
  });
  return { isDeleting, deleteListById };
}
