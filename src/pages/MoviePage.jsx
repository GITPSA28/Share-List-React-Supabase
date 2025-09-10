import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link, useParams } from "react-router";
import {
  getMovieCredits,
  getMovieDetails,
  getMovieWatchProviders,
} from "../services/apiTmdb";
import FullscreenSpinner from "../ui/FullscreenSpinner";
import SendMovie from "../components/SendMovie";
import Spinner from "../ui/Spinner";

export default function MoviePage() {
  const { movieid } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["movie", movieid],
    queryFn: () => getMovieDetails({ movie_id: movieid }),
  });

  // console.log(watchProviders, isWatchProvidersLoading, watchProvidersError);
  return (
    <div className="bg-base-100 flex flex-col items-center justify-center gap-3 pt-1">
      {isLoading && <FullscreenSpinner />}
      {!isLoading && !data && <p>No data</p>}
      {data && (
        <div className="flex max-w-xl flex-col items-center gap-5">
          <div className="w-full max-w-lg">
            <MovieCard movie={data} />
          </div>
          <h2 className="gap-1 text-2xl font-bold">
            <a
              viewTransition
              className="cursor-pointer hover:text-[#40BCF4]"
              href={`${data.homepage}`}
            >
              {data.title + " "}
            </a>
          </h2>
          <div className="bg-base-200/70 border-base-300 rounded-box flex w-full flex-col items-center gap-4 border-2 py-4">
            <p className="text-md font-semibold opacity-70">
              {data.release_date.split("-")[0]}
              {" • "}
              {`${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m`}
            </p>
            <div className="flex w-full flex-wrap items-center justify-center text-xs uppercase opacity-70">
              {data.genres.map((v) => (
                <p className="px-2">{v.name}</p>
              ))}
            </div>
          </div>
          {data.tagline && (
            <p className="my-2 opacity-90">
              <em>{data.tagline}</em>
            </p>
          )}
          <div className="flex gap-3">
            {/* <div className="flex flex-col items-center gap-2 text-sm"> */}
            <button className="btn btn-sm btn-accent">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              Watchlist
            </button>
            {/* </div> */}
            <button className="btn btn-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              Favourite
            </button>
            <SendMovie className={"btn btn-sm btn-primary"} movie={data} />
          </div>
          <ExtraDetails movie={data} />
        </div>
      )}
    </div>
  );
}

function ExtraDetails({ movie }) {
  const {
    data,
    isLoading: isWatchProvidersLoading,
    error: watchProvidersError,
  } = useQuery({
    queryKey: ["movie-providers", movie.id],
    queryFn: () => getMovieWatchProviders({ movie_id: movie.id }),
  });
  const providers = data?.results?.IN || [];
  console.log(providers.flatrate);
  if (isWatchProvidersLoading) return <Spinner />;
  return (
    <div className="join join-vertical bg-base-100">
      <div className="collapse-arrow join-item border-base-300 collapse border">
        <input type="radio" name="my-accordion-4" defaultChecked />
        <div className="collapse-title font-semibold">Where to watch?</div>
        <div className="collapse-content flex gap-5 overflow-auto text-xs">
          {isWatchProvidersLoading && <Spinner />}
          {!isWatchProvidersLoading && providers?.flatrate?.length > 0
            ? providers.flatrate.map((v) => {
                return (
                  <>
                    <div className="flex w-fit shrink-0 flex-col items-center gap-3">
                      <img
                        className="w-10 rounded-sm"
                        src={`https://image.tmdb.org/t/p/w500/${v.logo_path}`}
                        alt=""
                      />
                      <p className="opacity-80">{v.provider_name}</p>
                    </div>
                  </>
                );
              })
            : "None"}
        </div>
      </div>
      <div className="collapse-arrow join-item border-base-300 collapse border">
        <input type="radio" name="my-accordion-4" />
        <div className="collapse-title font-semibold">Overview</div>
        <div className="collapse-content text-sm">{movie.overview}</div>
      </div>
      <div className="collapse-arrow join-item border-base-300 collapse border">
        <input type="radio" name="my-accordion-4" />
        <div className="collapse-title font-semibold">Cast</div>
        <div className="collapse-content text-sm">
          <Credits movie={movie} type={"cast"} />
        </div>
      </div>
      <div className="collapse-arrow join-item border-base-300 collapse border">
        <input type="radio" name="my-accordion-4" />
        <div className="collapse-title font-semibold">Crew</div>
        <div className="collapse-content text-sm">
          <Credits movie={movie} type={"crew"} />
        </div>
      </div>
    </div>
  );
}

function Credits({ movie, type }) {
  const {
    data: people,
    isLoading: isCreditsLoading,
    error: creditsError,
  } = useQuery({
    queryKey: ["movie-credits", type, movie.id],
    queryFn: () => getMovieCredits({ movie_id: movie.id }),
  });
  if (isCreditsLoading) return <Spinner />;
  if (people?.[type]?.length < 1) return <>none</>;
  let team = people?.[type];
  let max_length = 10;
  let mainteam = new Set([
    "Director",
    "Producer",
    "Executive Producer",
    "Screenplay",
    "Original Film Writer",
    "Director of Photography",
    "Editor",
  ]);

  if (type === "crew") {
    team = team.filter(({ job }) => {
      return mainteam.has(job);
    });
    max_length = 20;
  }
  if (team.length > max_length) {
    team.splice(max_length);
  }

  return (
    <div>
      <ul className="list bg-base-100 rounded-box shadow-md">
        {team.map((person) => {
          return (
            <>
              <li className="list-row">
                <div>
                  {person.profile_path && (
                    <img
                      className="w-10 rounded-sm object-cover"
                      src={`https://image.tmdb.org/t/p/w500/${person.profile_path}`}
                      alt=""
                    />
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase opacity-60">
                    {person.name}
                  </div>
                  <div>{type === "crew" ? person.job : person.character}</div>
                </div>
              </li>
            </>
          );
        })}
      </ul>
    </div>
  );
}

function MovieCard({ movie }) {
  return (
    <div
      style={{
        backgroundImage: `url(${`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`})`,
      }}
      className={`rounded-box max-h-96 p-4 pb-10 ${!movie.backdrop_path ? "bg-neutral text-neutral-conten" : ""} bg-full flex w-full items-center bg-cover shadow-sm`}
    >
      {/* {movie.backdrop_path && (
        <img
          className="w-full object-cover"
          src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
          alt="Shoes"
        />
      )} */}
      <div>
        {movie.poster_path && (
          <img
            className="z-10 w-28 rounded-sm mask-none sm:w-32"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          />
        )}
      </div>
    </div>
  );
}

function MovieCard2({ movie, children }) {
  return (
    <div
      className={`card max-h-72 ${!movie.backdrop_path ? "bg-neutral text-neutral-conten" : "bg-base-100"} image-full w-full shadow-sm`}
    >
      <figure className="">
        {movie.backdrop_path && (
          <img
            className="w-full object-cover"
            src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
            alt="Shoes"
          />
        )}
      </figure>
      <div className="card-body hover:inset-shadow-primary movie-list justify-center">
        {movie.poster_path && (
          <img
            className="z-10 w-30 rounded-sm sm:w-32"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          />
        )}
        <div className="card-title gap-1 text-lg font-bold">
          <p className="wrap-anywhere">
            <Link
              viewTransition
              className="cursor-pointer hover:text-[#40BCF4]"
              to={`/movie/${movie.id}`}
            >
              <span>{movie.title + " "}</span>
            </Link>
            <span className="font-mono text-xs opacity-70">
              {movie.release_date?.split("-")[0]}
            </span>
          </p>
        </div>
        <div className="card-actions justify-end">{children}</div>
      </div>
    </div>
  );
}
