import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createList } from "../../services/apiUserList";

export function useCreateList({ owner_id }) {
  const queryClient = useQueryClient();
  const { isLoading: isCreating, mutate: createNewList } = useMutation({
    mutationFn: async ({ list_name, visibility }) => {
      const data = await createList({ list_name, owner_id, visibility });
      return data;
    },
    onMutate: () => {
      toast.loading("Creating new list..", { id: "create-list" });
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ["lists"],
      });
      toast.success("Created Succesfully", { id: "create-list" });
    },
    onError: (error) => {
      toast.error("Error while creating", { id: "create-list" });
    },
  });
  return { isCreating, createNewList };
}
