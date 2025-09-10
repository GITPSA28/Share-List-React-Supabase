import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getListById } from "../services/apiUserList";
import FullscreenSpinner from "../ui/FullscreenSpinner";
import MovieCard from "../ui/MovieCard";

export default function ListPage() {
  const { listid } = useParams();
  const [list, setList] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  useEffect(() => {
    async function getListDetails() {
      try {
        setisLoading(true);
        const data = await getListById({ list_id: listid });
        setList(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      } finally {
        setisLoading(false);
      }
    }
    getListDetails();
  }, []);
  if (isLoading) return <FullscreenSpinner />;
  if (!list?.items?.length) return <div>Empty List</div>;
  return (
    <div className="p-5">
      <MovieList list={list} />
    </div>
  );
}

function MovieList({ list }) {
  const [movies, setMovies] = useState([]);
  const { items } = list;
  useEffect(() => {
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
    getMovies();
  }, []);
  if (!movies?.length) return <>Empty</>;
  return (
    <div>
      <h2 className="font-bold tracking-wide uppercase">
        <Link
          className="link-hover"
          to={`/profile/${list?.owner_profile?.username}`}
        >{`${list?.owner_profile?.username}'s `}</Link>
        <em>{list.list_name}</em>
      </h2>
      <ul className={`bg-base-100 mt-3 flex flex-wrap justify-start gap-3`}>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            enableOverView={false}
          ></MovieCard>
        ))}
      </ul>
    </div>
  );
}
