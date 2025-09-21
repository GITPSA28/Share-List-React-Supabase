import {
  getCustomUserLists,
  getItemInList,
  getUserLists,
} from "../../services/apiUserList";
import { useSession } from "../../contexts/SessionContext";
import { useEffect, useState } from "react";

export default function useItemInUsersList({ item, custom = false }) {
  const {
    session: {
      user: { id: user_id },
    },
  } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [lists, setLists] = useState([]);
  useEffect(() => {
    async function getLists() {
      try {
        setIsLoading(true);
        let userLists;
        if (!custom) {
          userLists = await getUserLists({ user_id });
        } else {
          userLists = await getCustomUserLists({ user_id });
        }
        const lists = await getItemInList({ item, lists: userLists });
        setLists(lists);
      } catch (error) {
        setError(error.message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    }
    getLists();
  }, []);

  return { lists, error, isLoading };
}
