import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getUserProfileDataByUserName } from "../services/apiProfile";
import FullscreenSpinner from "../ui/FullscreenSpinner";
import supabase from "../services/supabase";
import Spinner from "../ui/Spinner";

export default function Profile() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function getData() {
      const data = await getUserProfileDataByUserName({ username });
      if (!data) {
        setIsLoading(false);
        return;
      }
      setUserData(data);
      setIsLoading(false);
      console.log(data);
    }
    setIsLoading(true);
    getData();
  }, []);
  if (isLoading) return <FullscreenSpinner />;
  return (
    <div className="bg-base-100 flex flex-col items-center justify-center pt-8">
      <div className="flex w-sm flex-col gap-5">
        <div className="flex flex-col items-center gap-2">
          {userData.avatar_url ? (
            <div className="avatar">
              <div className="w-18 rounded-full">
                <img src={userData.avatar_url} />
              </div>
            </div>
          ) : (
            <div className="avatar avatar-placeholder">
              <div className="bg-neutral text-neutral-content w-18 rounded-full">
                <span className="text-xl font-semibold">
                  {userData.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
          <h1 className="text-xl font-semibold uppercase">
            @{userData.username}
          </h1>
          <div className="text-sm font-semibold uppercase opacity-80">
            {userData.full_name}
          </div>
        </div>
        <div className="flex justify-center">
          <button className="btn btn-primary w-8/12 max-w-sm">
            Add Friend
          </button>
        </div>
        <div className="flex justify-center">
          <AllLists owner_id={userData.id} />
        </div>
      </div>
    </div>
  );
}

function AllLists({ owner_id }) {
  const [lists, setLists] = useState([]);
  useEffect(() => {
    async function getMovies() {
      let { data: listsResult, error } = await supabase
        .from("lists")
        .select(`*,items (*)`)
        .eq("owner_id", owner_id);
      if (error) throw error;
      setLists(listsResult);
    }

    getMovies();
  }, []);
  return (
    <div className="flex w-sm flex-col gap-3">
      {lists.map((list) => (
        <MovieList key={list.list_id} list={list} />
      ))}
    </div>
  );
}

function MovieList({ list }) {
  const [movies, setMovies] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { items } = list;
  console.log(list);
  useEffect(() => {
    async function getMovies() {
      setIsLoading(true);
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
      console.log(movieDetails);
      if (movieDetails.length > 0) {
        setMovies(movieDetails);
      }
      setIsLoading(false);
    }
    getMovies();
  }, []);
  if (isLoading) return <Spinner />;
  if (!movies) return null;
  return (
    <div className="w-full">
      <div className="mb-0.5 font-bold">{list.list_name}</div>
      <div className="flex snap-x gap-1 overflow-x-auto">
        {movies.map((movie) => (
          <MovieTile
            key={movie.id}
            url={
              movie?.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : ""
            }
            alt={movie.title}
          />
        ))}
      </div>
    </div>
  );
}

function MovieTile({ url, alt }) {
  if (!url)
    return (
      <div className="rounded-box skeleton flex h-44 w-28 items-center justify-center">
        No Image
      </div>
    );
  return (
    <div className="rounded-box h-44 w-28 flex-shrink-0">
      <img className="rounded-box skeleton h-44 w-28" src={url} alt={alt} />
    </div>
  );
}
