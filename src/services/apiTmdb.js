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
