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
    <div className="bg-base-100 flex flex-col items-center justify-center gap-3 pt-5">
      {isLoading && <FullscreenSpinner />}
      {!isLoading && !data && <p>No data</p>}
      {data && (
        <div className="flex max-w-xl flex-col items-center gap-5">
          <div className="w-full max-w-lg">
            {(data.backdrop_path || data.poster_path) && (
              <MovieCard movie={data} />
            )}
          </div>
          <h2 className="gap-1 text-2xl font-bold">
            <a
              className="cursor-pointer hover:text-[#40BCF4]"
              href={`${data.homepage}`}
            >
              {data.title + " "}
            </a>
          </h2>
          <div className="bg-base-200/50 border-base-200 flex w-full flex-col items-center gap-2 border-y-2 mask-r-from-80% mask-l-from-80% py-4">
            <p className="text-md font-semibold opacity-70">
              {data.release_date.split("-")[0]}
              {data.release_date && data.runtime > 0 && " • "}
              {data.runtime > 0 &&
                `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m`}
            </p>
            <div className="flex w-full flex-wrap items-center justify-center text-xs uppercase opacity-70">
              {data.genres.slice(0, 3).map((v) => (
                <p className="px-2" key={v.id}>
                  {v.name}
                </p>
              ))}
            </div>
          </div>
          {data.tagline && (
            <p className="opacity-90">
              <em>{data.tagline}</em>
            </p>
          )}
          <div className="flex w-fit flex-col gap-5">
            <SendMovie
              className={"btn btn-primary btn-lg mx-4 w-72 sm:w-md"}
              movie={data}
            />
            <div className="flex w-full justify-around">
              <div className="flex flex-col items-center justify-center">
                <button className="btn btn-lg btn-circle btn-ghost">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
                <p className="text-xs">Watchlist</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <button className="btn btn-lg btn-circle btn-ghost">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                </button>
                <p className="text-xs">Favourite</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <button className="btn-circle btn-lg btn btn-ghost">
                  {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-circle-icon lucide-circle"
                >
                  <circle cx="12" cy="12" r="10" />
                </svg> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-circle-check-big-icon lucide-circle-check-big"
                  >
                    <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                </button>
                <p className="text-xs">Completed</p>
              </div>
            </div>
          </div>
          <WatchProviders movie={data} />
          <ExtraDetails movie={data} />
        </div>
      )}
    </div>
  );
}

function ExtraDetails({ movie }) {
  return (
    <div className="join join-vertical bg-base-100 w-full">
      {movie.overview && (
        <div className="collapse-arrow join-item border-base-300 collapse border">
          <input type="radio" name="my-accordion-4" />
          <div className="collapse-title font-semibold">Overview</div>
          <div className="collapse-content text-sm">{movie.overview}</div>
        </div>
      )}
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

function WatchProviders({ movie }) {
  const [curTab, setCurTab] = useState(0);
  const {
    data,
    isLoading: isWatchProvidersLoading,
    error: watchProvidersError,
  } = useQuery({
    queryKey: ["movie-providers", movie.id],
    queryFn: () => getMovieWatchProviders({ movie_id: movie.id }),
  });
  const providers = data?.results?.["IN"] || [];
  const providersArr = Object.keys(providers)
    .filter((k) => k !== "link")
    .map((k) => {
      return {
        title: k === "flatrate" ? "Stream" : k,
        values: providers[k],
      };
    });

  return (
    <>
      {providersArr && (
        <div className="flex w-full items-center justify-center">
          {providersArr.length > 0 && (
            <div className="my-3 flex w-full flex-col gap-4">
              <div role="tablist" class="tabs tabs-lift w-full">
                {providersArr.map((type, i) => {
                  return (
                    <>
                      <button
                        role="tab"
                        onClick={() => setCurTab(i)}
                        className={`tab capitalize ${curTab === i ? "tab-active" : ""} `}
                      >
                        {type.title}
                      </button>
                      <div className="tab-content border-base-300 w-full">
                        <div className="flex w-full flex-row flex-wrap gap-3 p-3">
                          {isWatchProvidersLoading && (
                            <div className="h-10 w-10 shrink-0">
                              <Spinner />
                            </div>
                          )}

                          <>
                            {Array.isArray(type.values) &&
                              type.values.map((v) => {
                                return (
                                  <div
                                    className={`${curTab === i ? "h-10 w-10 flex-none" : "hidden"}`}
                                  >
                                    <img
                                      key={v.provider_id}
                                      className={`h-10 w-10 rounded-xl`}
                                      src={`https://image.tmdb.org/t/p/w500/${v.logo_path}`}
                                      alt=""
                                    />
                                  </div>
                                );
                              })}
                          </>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </>
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
  if (people?.[type]?.length < 1) return <>No data available</>;
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
        {team.map((person, i) => {
          return (
            <li key={i} className="list-row">
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
      className={`rounded-box relative max-h-96 border-0 bg-no-repeat bg-origin-border p-4 ${!movie.backdrop_path ? "bg-neutral text-neutral-conten" : ""} flex w-full items-center bg-contain bg-right`}
    >
      <div className="bg-base-100 absolute inset-0 h-full w-full rounded-xl mask-r-from-10% mask-r-to-60% opacity-100"></div>
      {/* {movie.backdrop_path && (
        <img
          className="w-full object-cover"
          src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
          alt="Shoes"
        />
      )} */}
      {movie.poster_path && (
        <img
          className="rounded-box z-10 w-26 mask-none shadow-md sm:w-32"
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        />
      )}
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
