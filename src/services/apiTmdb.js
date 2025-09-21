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
export async function searchTvs({ query, page = 1, adult = false }) {
  let baseURL = `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=${adult}&language=en-US&page=${page}`;
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

export async function getMovieDetails({ movie_id }) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${import.meta.env.VITE_TMDBAPI_KEY}`,
    );
    if (!res.ok) throw new Error(res.message);
    const data = res.json();
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
}
export async function getTvDetails({ tv_id }) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${tv_id}?api_key=${import.meta.env.VITE_TMDBAPI_KEY}`,
    );
    if (!res.ok) throw new Error(res.message);
    const data = res.json();
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
}
export async function getMovieWatchProviders({ movie_id }) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movie_id}/watch/providers?api_key=${import.meta.env.VITE_TMDBAPI_KEY}`,
    );
    if (!res.ok) throw new Error(res.message);
    const data = res.json();
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
}
export async function getTvWatchProviders({ tv_id }) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${tv_id}/watch/providers?api_key=${import.meta.env.VITE_TMDBAPI_KEY}`,
    );
    if (!res.ok) throw new Error(res.message);
    const data = res.json();
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
}
export async function getMovieCredits({ movie_id }) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${import.meta.env.VITE_TMDBAPI_KEY}`,
    );
    if (!res.ok) throw new Error(res.message);
    const data = res.json();
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
}
export async function getTvCredits({ tv_id }) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${tv_id}/credits?api_key=${import.meta.env.VITE_TMDBAPI_KEY}`,
    );
    if (!res.ok) throw new Error(res.message);
    const data = res.json();
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
}
async function getMovies() {
  let movieDetailsReq = items.map(async (movie) => {
    let res = await fetch(
      `https://api.themoviedb.org/3/movie/${movie.value}?api_key=${import.meta.env.VITE_TMDBAPI_KEY}`,
    );
    return res.json();
  });
  let movieDetailsRes = await Promise.allSettled(movieDetailsReq);
  let movieDetails = movieDetailsRes
    .filter((res) => res.status === "fulfilled")
    .map((res) => res.value);
  if (movieDetails.length > 0) {
    setMovies(movieDetails);
  }
}
