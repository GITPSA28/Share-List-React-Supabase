import { useQuery } from "@tanstack/react-query";
import { getMovieDetails, getTvDetails } from "../../services/apiTmdb";

export default function useItemDetails({ value, type }) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["item", type, `${value}`],
    queryFn: async () => {
      let details;
      if (type === "tv") {
        details = await getTvDetails({ tv_id: value });
      } else if (type === "movie") {
        details = await getMovieDetails({ movie_id: value });
      }
      return details;
    },
    retry: false,
  });

  return {
    isLoading,
    error,
    data,
  };
}
