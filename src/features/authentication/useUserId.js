import { useSession } from "../../contexts/SessionContext";

export default function useUserId() {
  const {
    session: {
      user: { id: user_id },
    },
    isLoading,
  } = useSession();
  return { user_id, isLoading };
}
