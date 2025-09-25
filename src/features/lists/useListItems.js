import { useQuery } from "@tanstack/react-query";
import { getListById } from "../../services/apiUserList";

export default function useListItems({ list_id }) {
  const {
    isLoading,
    isRefetching,
    data: list,
    error,
  } = useQuery({
    queryKey: ["list", "items", `${list_id}`],
    queryFn: () => getListById({ list_id }),
    retry: false,
  });

  return {
    isLoading,
    isRefetching,
    error,
    list,
  };
}
