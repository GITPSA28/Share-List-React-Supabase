import { useQuery } from "@tanstack/react-query";
import { getFriendStatus } from "../services/apiFriends";

export function useFriendship({ friend_id }) {
  const { isLoading, data, refetch, isRefetching, error, isRefetchError } =
    useQuery({
      queryKey: ["friendship", friend_id],
      queryFn: () => getFriendStatus({ friend_id }),
    });
  return {
    isLoading,
    friendship: data,
    error,
    refetch,
    isRefetching,
    isRefetchError,
  };
}

// import { useState } from "react";
// import { getFriendStatus } from "../services/apiFriends";
// import { useUser } from "../features/authentication/useUser";

// export default function useFriendship({ friend_id }) {
//   const [friendship, setFriendship] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const {user,isLoading:isUserLoading} = useUser();

//   useEffect(() => {
//     async function getFriendship() {
//       try {
//         const friendshipRes = await getFriendStatus(friend_id, user_id);
//         if (friendshipRes) setFriendship(friendshipRes);
//       } catch (error) {
//         console.log(error);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     getFriendship();
//   }, []);
//   async function onStatusChange() {
//     setIsLoading(true);
//     const friendshipRes = await getFriendStatus(friend_id, user_id);
//     setFriendship(friendshipRes);
//     setIsLoading(false);
//   }
//   return { isLoading, friendship, onStatusChange };
// }
