import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "../../services/apiProfile";

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  const { isLoading: isUpdating, mutate: updateUserProfileData } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: ({ data }) => {
      console.log("User account updated successfuly");
      queryClient.setQueryData(["user-profile"], data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { isUpdating, updateUserProfileData };
}
