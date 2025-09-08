import { useSession } from "../../contexts/SessionContext";
import { useFriends } from "./useFriends";

export default function useFriendList({ user_id } = {}) {
  const session = useSession();
  if (!user_id) {
    console.log(session);
    user_id = session?.session?.user?.id;
  }
  const { friends, isLoading } = useFriends({ status: "accepted" });
  let friendList = friends?.map((friendRes) => {
    if (friendRes.user_id === user_id) return friendRes.friend;
    else return friendRes.user;
  });
  return { friendList, isLoading };
}
