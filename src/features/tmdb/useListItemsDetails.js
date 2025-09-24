import { useQuery } from "@tanstack/react-query";
import { getTMDBDataFromList } from "../../services/apiTmdb";

export default function useListItemsDetails({ items, list_id }) {
  const {
    isLoading,
    data: listItems,
    error,
  } = useQuery({
    queryKey: ["list-details", list_id],
    queryFn: () => getTMDBDataFromList(items),
  });

  return {
    isLoading,
    error,
    listItems,
  };
}
