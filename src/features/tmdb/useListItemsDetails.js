import { useQuery } from "@tanstack/react-query";
import { getTMDBDataFromList } from "../../services/apiTmdb";

export default function useListItemsDetails({ items, list_id }) {
  const {
    isLoading,
    data: listItems,
    error,
    isRefetching,
  } = useQuery({
    queryKey: ["list", "details", list_id],
    queryFn: () => getTMDBDataFromList(items),
    retry: false,
  });

  return {
    isLoading,
    error,
    listItems,
    isRefetching,
  };
}
