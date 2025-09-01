export async function getTMDBMovieLists({ type, region = "", page = 1 }) {
  let baseURL = `https://api.themoviedb.org/3/movie/${type}?language=en-US`;
  baseURL += `&page=${page}`;
  if (region) baseURL += `&region=${region}`;
  let res = await fetch(baseURL, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_TMDBAPI_ACCESS_TOKEN}`,
    },
  });
  let data = await res.json();
  return data;
}

export async function searchMovies({ query, page = 1, adult = false }) {
  let baseURL = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=${adult}&language=en-US&page=${page}`;
  let res = await fetch(baseURL, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_TMDBAPI_ACCESS_TOKEN}`,
    },
  });
  let data = await res.json();
  return data;
}
