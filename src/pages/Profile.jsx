import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  getUserProfileData,
  getUserProfileDataByUserName,
} from "../services/apiProfile";
import FullscreenSpinner from "../ui/FullscreenSpinner";
import supabase from "../services/supabase";
import Spinner from "../ui/Spinner";
import { useUser } from "../features/authentication/useUser";
import ManageFriendship from "../components/ManageFriendship";

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
      //   console.log(data);
    }
    setIsLoading(true);
    getData();
  }, [username]);

  // console.log(userData.id);
  return (
    <div className="bg-base-100 flex flex-col items-center justify-center gap-5 pt-8">
      <div className="flex flex-col gap-5 sm:w-full sm:max-w-xl">
        {(isLoading || !username || !userData) && <FullscreenSpinner />}
        {userData && (
          <>
            <ProfileHeader userData={userData} />
            {/* <FriendControll friend_id={userData.id} user_id={user.id} /> */}

            <div className="flex justify-center gap-2">
              <ManageFriendship friend_id={userData.id}>
                <>
                  <ManageFriendship.AddFriend />
                  <ManageFriendship.CancelRequest />
                  <div className="join-horizontal flex">
                    <div className="join-item">
                      <ManageFriendship.Accept />
                    </div>
                    <div className="join-item">
                      <ManageFriendship.Reject />
                    </div>
                  </div>
                </>
              </ManageFriendship>
            </div>
            <div className="flex justify-center">
              <AllLists owner_id={userData.id} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ProfileHeader({ userData }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {userData?.avatar_url ? (
        <div className="avatar">
          <div className="w-16 rounded-full sm:w-24">
            <img referrerPolicy="no-referrer" src={userData?.avatar_url} />
          </div>
        </div>
      ) : (
        <div className="avatar avatar-placeholder">
          <div className="bg-neutral text-neutral-content w-16 rounded-full sm:w-24">
            <span className="text-xl font-semibold">
              {userData.username.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      )}
      <h1 className="text-xl font-semibold">{userData.full_name}</h1>
      <div className="text-base-content/70 text-sm font-semibold">
        @{userData.username}
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
        .eq("owner_id", owner_id)
        .is("recommended_to", null);
      if (error) throw error;
      setLists(listsResult);
    }

    getMovies();
  }, [owner_id]);
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
        .filter((res) => res.status === "fulfilled" && res.value?.id != null)
        .map((res) => res.value);
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
      <div className="text-base-content/70 mb-0.5 font-bold">
        {list.list_name}
      </div>
      <div className="flex snap-x gap-1 overflow-x-auto">
        {movies.map((movie) => (
          <MovieTile
            key={movie.id}
            url={
              movie?.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : ""
            }
            height={"h-48"}
            width={"h-36"}
            alt={movie.title}
          />
        ))}
      </div>
    </div>
  );
}

function MovieTile({ url, alt, height, width }) {
  if (!url)
    return (
      <div
        className={`rounded-box skeleton flex ${height} ${width} items-center justify-center`}
      >
        No Image
      </div>
    );
  return (
    <img
      className={`rounded-box skeleton flex-shrink-0 ${height} ${width} object-cover`}
      src={url}
      alt={alt}
    />
  );
}
