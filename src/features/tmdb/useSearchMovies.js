import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "../../services/apiTmdb";
import { useSearchParams } from "react-router";

export function useSearchMovies() {
  const [searchParams, SetSearchParams] = useSearchParams();

  // queryURI = encodeURI(query);
  const query = searchParams.get("query");
  //   console.log(query);
  const {
    isLoading,
    data: movieResults,
    error,
  } = useQuery({
    queryKey: ["search-movie-results", query],
    queryFn: () => {
      if (!query) return null;
      return searchMovies({ query });
    },
    retry: false,
  });

  return {
    isLoading,
    error,
    movieResults,
  };
}
