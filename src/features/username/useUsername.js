import { useQuery } from "@tanstack/react-query";
import { getUserProfileData } from "../../services/apiProfile";

export function useUsername() {
  const { isLoading, data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfileData,
  });
  return {
    isLoading,
    profile,
    hasUsername: profile?.username !== null,
  };
}
