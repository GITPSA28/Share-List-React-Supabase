import React, { Fragment, useEffect, useRef, useState } from "react";
import SearchBar from "../ui/SearchBar";
import { useSearchParams } from "react-router";
import { useSearchMovies } from "../features/tmdb/useSearchMovies";
import FullscreenSpinner from "../ui/FullscreenSpinner";
import { addToUserList } from "../services/apiUserList";
import SendMovie from "../components/SendMovie";
import MovieCard from "../ui/MovieCard";
import AddToList from "../components/AddToList";

export default function SearchPage() {
  const { isLoading, movieResults } = useSearchMovies();

  return (
    <div className="bg-base-100 min-h-svh pt-2 sm:pt-5">
      <div className="flex w-full items-center justify-center">
        <SearchBarContainer />
      </div>
      <div>
        {isLoading && <FullscreenSpinner />}
        <div className="flex items-center justify-center">
          {!isLoading && movieResults?.results?.length > 0 && (
            <MovieSearchResults className="" movieList={movieResults.results} />
          )}
          {!isLoading && movieResults?.results?.length === 0 && (
            <p className="pt-10">No results</p>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchBarContainer() {
  const [value, setValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const searchBarRef = useRef(null);

  useEffect(() => {
    if (!searchBarRef.current) return;
    searchBarRef.current.click();
    searchBarRef.current.focus();
  }, [searchBarRef]);

  useEffect(() => {
    setValue(searchParams.get("query") || "");
  }, [searchParams]);

  function handleSubmit(e) {
    e.preventDefault();
    setSearchParams({ query: value });
  }

  function onValueChange(query) {
    setValue(query);
  }
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="join join-horizontal w-full">
        <SearchBar value={value} ref={searchBarRef} onChange={onValueChange} />
        {/* <select className="select select-ghost join-item w-fit">
      <option selected>Movie</option>
      <option disabled>TV</option>
    </select> */}
        <button type="submit" className="btn join-item">
          Search
        </button>
      </div>
    </form>
  );
}

function MovieSearchResults({ movieList, className }) {
  return (
    <ul
      className={
        `bg-base-100 mt-3 flex flex-wrap justify-center gap-3 ` + className
      }
    >
      {movieList.map((movie) => (
        <div className="w-full max-w-md" key={movie.id}>
          <ResultCard movie={movie} />
        </div>
      ))}
    </ul>
  );
}

function ResultCard({ movie }) {
  return (
    <MovieCard movie={movie}>
      <AddToList movie={movie} />
      <SendMovie movie={movie} />
    </MovieCard>
  );
}

function ListItem(movie) {
  return (
    <li className="list-row my-2 items-center" key={movie.id}>
      <div className="flex items-center justify-center">
        {/* <img
          className="rounded-box absolute w-18 opacity-80 blur"
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        /> */}
        <img
          className="z-10 w-20 rounded-sm sm:w-28"
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        />
      </div>
      <div className="flex justify-between">
        <div>
          <div className="text-sm font-semibold uppercase opacity-60">
            {movie.title}
          </div>
          <div className="text-xs font-normal opacity-60">
            {movie.release_date}
          </div>
          <div className="text-xs font-normal opacity-60">
            {movie.overview.substring(0, 130) + "..."}
          </div>
          <div className="flex items-center gap-2 text-sm">
            {Math.round(movie.vote_average * 5) / 10}
            <Rating value={movie.vote_average} />
          </div>
        </div>
        <div className="flex flex-col items-center justify-end sm:flex-row">
          <AddToFav movie_id={movie.id} />
          <button className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-[1.2em]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
              />
            </svg>
          </button>
          <button className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-[1.2em]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
}

function AddToFav({ movie_id }) {
  async function handleAddFav() {
    const data = await addToUserList({ value: movie_id });
    if (!data.length) throw new Error("Not able to update");
    console.log(data);
    alert("added succesfully");
  }
  return (
    <button onClick={handleAddFav} className="btn btn-square btn-ghost">
      <svg
        className="size-[1.2em]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <g
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2"
          fill="currentColor"
          stroke="currentColor"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
        </g>
      </svg>
    </button>
  );
}

function Rating({ value }) {
  const rating = Math.round(value) / 2 || 0.5;
  return (
    <div className="rating rating-sm rating-half">
      <div
        name="rating-11"
        className="mask mask-star-2 mask-half-1"
        aria-label="0.5 star"
        aaria-current={`${rating === 0.5}`}
      ></div>
      <div
        name="rating-11"
        className="mask mask-star-2 mask-half-2"
        aria-label="1 star"
        aria-current={`${rating === 1}`}
      ></div>
      <div
        name="rating-11"
        className="mask mask-star-2 mask-half-1"
        aria-label="1.5 star"
        aria-current={`${rating === 1.5}`}
      ></div>
      <div
        name="rating-11"
        className="mask mask-star-2 mask-half-2"
        aria-label="2 star"
        aria-current={`${rating === 2}`}
      ></div>
      <div
        name="rating-11"
        className="mask mask-star-2 mask-half-1"
        aria-label="2.5 star"
        aria-current={`${rating === 2.5}`}
      ></div>
      <div
        name="rating-11"
        className="mask mask-star-2 mask-half-2"
        aria-label="3 star"
        aria-current={`${rating === 3}`}
      ></div>
      <div
        name="rating-11"
        className="mask mask-star-2 mask-half-1"
        aria-label="3.5 star"
        aria-current={`${rating === 3.5}`}
      ></div>
      <div
        name="rating-11"
        className="mask mask-star-2 mask-half-2"
        aria-label="4 star"
        aria-current={`${rating === 4}`}
      ></div>
      <div
        name="rating-11"
        className="mask mask-star-2 mask-half-1"
        aria-label="4.5 star"
        aria-current={`${rating === 4.5}`}
      ></div>
      <div
        name="rating-11"
        className="mask mask-star-2 mask-half-2"
        aria-label="5 star"
        aria-current={`${rating === 5}`}
      ></div>
    </div>
  );
}
