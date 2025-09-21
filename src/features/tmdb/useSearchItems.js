import { useQuery } from "@tanstack/react-query";
import { searchMovies, searchTvs } from "../../services/apiTmdb";
import { useSearchParams } from "react-router";

export function useSearchItems() {
  const [searchParams, SetSearchParams] = useSearchParams();

  // queryURI = encodeURI(query);
  const query = searchParams.get("query");
  const type = searchParams.get("type") || "movie";
  //   console.log(query);
  const {
    isLoading,
    data: itemResults,
    error,
  } = useQuery({
    queryKey: ["search-results", type, query],
    queryFn: () => {
      if (!query) return null;
      if (type === "movie") return searchMovies({ query });
      if (type === "tv") return searchTvs({ query });
    },
    retry: false,
  });

  return {
    isLoading,
    error,
    itemResults,
  };
}
