import { useSession } from "../../contexts/SessionContext";

export function useUsername() {
  const { userProfile: profile, isLoading } = useSession();
  return {
    isLoading,
    profile,
    hasUsername: profile?.username?.length > 2,
  };
}
