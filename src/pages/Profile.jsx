import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getUserProfileDataByUserName } from "../services/apiProfile";
import FullscreenSpinner from "../ui/FullscreenSpinner";
import supabase from "../services/supabase";
import Spinner from "../ui/Spinner";
import { useUser } from "../features/authentication/useUser";
import { getFriendStatus, sendFriendRequest } from "../services/apiFriends";

export default function Profile() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [friendship, setFreindship] = useState(null);
  const { user, isLoading: isLoadingUser } = useUser();

  useEffect(() => {
    async function getData() {
      const data = await getUserProfileDataByUserName({ username });
      if (!data) {
        setIsLoading(false);
        return;
      }
      setUserData(data);
      const friendshipRes = await getFriendStatus(data.id, user.id);
      if (friendshipRes) setFreindship(friendshipRes);
      console.log(friendshipRes);
      setIsLoading(false);
      //   console.log(data);
    }
    setIsLoading(true);
    getData();
  }, [user]);

  function onStatusChange(friendshipRes) {
    if (friendshipRes) setFreindship(friendshipRes);
  }
  console.log(friendship);
  if (isLoading || isLoadingUser) return <FullscreenSpinner />;
  return (
    <div className="bg-base-100 flex flex-col items-center justify-center pt-8">
      <div className="flex w-sm flex-col gap-5 sm:w-full sm:max-w-xl">
        <div className="flex flex-col items-center gap-2">
          {userData.avatar_url ? (
            <div className="avatar">
              <div className="w-18 rounded-full">
                <img referrerPolicy="no-referrer" src={userData.avatar_url} />
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
        {userData.id != user.id && (
          <div className="flex justify-center">
            {friendship === null && (
              <AddFriend
                onStatusChange={onStatusChange}
                friend_id={userData.id}
                className="btn btn-primary w-8/12 max-w-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                  />
                </svg>
                Add Friend
              </AddFriend>
            )}
            {friendship.status === "requested" &&
              friendship.user_id === user.id && (
                <button className="btn btn-primary w-8/12 max-w-sm">
                  Requested
                </button>
              )}
            {friendship.status === "requested" &&
              friendship.friend_id === user.id && (
                <button className="btn btn-primary w-8/12 max-w-sm">
                  Accept
                </button>
              )}
            {friendship.status === "accepted" && (
              <button className="btn btn-primary w-8/12 max-w-sm">
                Friends
              </button>
            )}
          </div>
        )}
        <div className="flex justify-center">
          <AllLists owner_id={userData.id} />
        </div>
      </div>
    </div>
  );
}

function AddFriend({ className, friend_id, onStatusChange, children }) {
  const { user, isLoading } = useUser();
  async function handleFriendRequest() {
    try {
      const res = await sendFriendRequest(user.id, friend_id);

      onStatusChange(res);
    } catch (e) {
      console.log(e);
    }
  }
  if (isLoading)
    return (
      <button className={className}>
        <Spinner />
      </button>
    );
  return (
    <button onClick={handleFriendRequest} className={className}>
      {children}
    </button>
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
    <div className="flex w-11/12 flex-col gap-3">
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
      <img
        className="rounded-box skeleton h-44 w-28 object-cover"
        src={url}
        alt={alt}
      />
    </div>
  );
}
