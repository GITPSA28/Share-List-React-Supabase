import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { Fragment, useState } from "react";
import { useParams } from "react-router";
import {
  getTvCredits,
  getTvDetails,
  getTvWatchProviders,
} from "../services/apiTmdb";
import FullscreenSpinner from "../ui/FullscreenSpinner";
import Spinner from "../ui/Spinner";
import {
  addToUserList,
  deleteItemFromUserList,
  getUserListsByItem,
} from "../services/apiUserList";
import SendItem from "../components/SendItem";
import AddItemToList from "../components/AddItemToList";
import { useSession } from "../contexts/SessionContext";

export default function TvPage() {
  const { tvid } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["tv", tvid],
    queryFn: () => getTvDetails({ tv_id: tvid }),
  });
  console.log(data);
  return (
    <div className="bg-base-100 flex flex-col items-center justify-center gap-3 pt-5">
      {isLoading && <FullscreenSpinner />}
      {!isLoading && !data && !error && (
        <Empty emptyTitle={"Oops!"} emptyText="No data" />
      )}
      {!isLoading && error && (
        <Empty emptyTitle={"Oops!"} emptyText="Error while getting the title" />
      )}
      {data && (
        <div className="flex max-w-3xl flex-col items-center gap-5">
          <div className="w-full max-w-3xl">
            {(data.backdrop_path || data.poster_path) && <TvCard tv={data} />}
          </div>
          <h2 className="gap-1 text-2xl font-bold sm:text-3xl">
            <a
              className="cursor-pointer hover:text-[#40BCF4]"
              href={`${data.homepage || "#"}`}
              target="_blank"
            >
              {data.name + " "}
            </a>
          </h2>
          <div className="relative w-full py-4">
            <div className="bg-base-200/50 border-base-200 absolute inset-0 border-y-2 mask-r-from-80% mask-l-from-80%" />
            <div className="relative flex flex-col items-center gap-2">
              {/* <div className="bg-base-200/50 border-base-200 flex w-full flex-col items-center gap-2 border-y-2 mask-r-from-80% mask-l-from-80% py-4"> */}
              <p className="text-md text-center font-semibold opacity-70">
                {data.first_air_date.split("-")[0]}
                <br />
                {data.number_of_seasons > 0 &&
                  `${data.number_of_seasons} ${data.number_of_seasons > 1 ? "Seasons" : "Season"}`}
                {" | "}
                {data.number_of_episodes > 0 &&
                  `${data.number_of_episodes} ${data.number_of_episodes > 1 ? "Episodes" : "Episode"}`}
              </p>
              <div className="flex w-full flex-wrap items-center justify-center text-xs uppercase opacity-70">
                {data.genres.slice(0, 3).map((v) => (
                  <p className="px-2" key={v.id}>
                    {v.name}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {data.tagline && (
            <p className="opacity-90">
              <em>{data.tagline}</em>
            </p>
          )}

          <TvListControlls tv={data} type="tv" />
          <WatchProviders tv={data} />
          <ExtraDetails tv={data} />
        </div>
      )}
    </div>
  );
}

function TvListControlls({ tv, type }) {
  const queryClient = useQueryClient();
  const {
    session: {
      user: { id: user_id },
    },
  } = useSession();
  const {
    data,
    error,
    isLoading: isFetching,
  } = useQuery({
    queryKey: ["item-in-list", type, tv.id],
    queryFn: () => getUserListsByItem({ user_id, item: tv.id, type }),
  });
  const { isPending: isUpdating, mutate: updateItem } = useMutation({
    mutationFn: async ({ list_type, remove }) => {
      if (remove) {
        await deleteItemFromUserList({ user_id, list_type, value: tv.id });
      } else await addToUserList({ user_id, list_type, type, value: tv.id });
    },
    onSuccess: () => {
      console.log("Updated");
      queryClient.invalidateQueries(["item-in-list", tv.id]);
    },
    onError: (error) => {
      console.log("error while action", error.message);
    },
  });
  const isCompleted = data?.includes("completed");
  const isFavourite = data?.includes("favourite");
  const isWatchList = data?.includes("watchlist");
  return (
    <div className="flex w-fit flex-col gap-5">
      <div className="flex w-72 gap-4 sm:w-sm">
        <AddItemToList
          item={tv}
          type="tv"
          custom={true}
          className={"btn btn-soft btn-lg flex-1"}
        />
        <SendItem
          className={"btn btn-primary btn-lg flex-3"}
          item={tv}
          type="tv"
        />
      </div>
      <div className="flex w-full justify-around">
        <div className="flex flex-col items-center justify-center">
          <button
            disabled={isFetching || isUpdating}
            onClick={() =>
              updateItem({ list_type: "watchlist", remove: isWatchList })
            }
            className="btn btn-lg btn-circle btn-ghost"
          >
            {isWatchList ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
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
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                />
              </svg>
            )}
          </button>
          <p className="text-xs">Watchlist</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={() =>
              updateItem({ list_type: "favourite", remove: isFavourite })
            }
            disabled={isFetching || isUpdating}
            className="btn btn-lg btn-circle btn-ghost"
          >
            {isFavourite ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>
            ) : (
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
            )}
          </button>
          <p className="text-xs">Favourite</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <button
            disabled={isFetching || isUpdating}
            onClick={() =>
              updateItem({ list_type: "completed", remove: isCompleted })
            }
            className="btn-circle btn-lg btn btn-ghost swap swap-rotate"
          >
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
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`${isCompleted ? "swap-active" : ""}swap-on lucide lucide-circle-check-big-icon lucide-circle-check-big`}
            >
              <path d="M21.801 10A10 10 0 1 1 17 3.335" />
              <path d="m9 11 3 3L22 4" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`${isCompleted ? "swap-active" : ""}swap-off lucide lucide-circle-icon lucide-circle`}
            >
              <circle cx="12" cy="12" r="10" />
            </svg>
          </button>
          <p className="text-xs">Completed</p>
        </div>
      </div>
    </div>
  );
}

function ExtraDetails({ tv }) {
  return (
    <div className="join join-vertical bg-base-100 w-full">
      {tv.overview && (
        <div className="collapse-arrow join-item border-base-300 collapse border">
          <input type="radio" name="my-accordion-4" />
          <div className="collapse-title font-semibold">Overview</div>
          <div className="collapse-content text-sm">{tv.overview}</div>
        </div>
      )}
      <div className="collapse-arrow join-item border-base-300 collapse border">
        <input type="radio" name="my-accordion-4" />
        <div className="collapse-title font-semibold">Cast</div>
        <div className="collapse-content text-sm">
          <Credits tv={tv} type={"cast"} />
        </div>
      </div>
      <div className="collapse-arrow join-item border-base-300 collapse border">
        <input type="radio" name="my-accordion-4" />
        <div className="collapse-title font-semibold">Crew</div>
        <div className="collapse-content text-sm">
          <Credits tv={tv} type={"crew"} />
        </div>
      </div>
    </div>
  );
}

function WatchProviders({ tv }) {
  const [curTab, setCurTab] = useState(0);
  const {
    data,
    isLoading: isWatchProvidersLoading,
    error: watchProvidersError,
  } = useQuery({
    queryKey: ["tv-providers", tv.id],
    queryFn: () => getTvWatchProviders({ tv_id: tv.id }),
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
              <div role="tablist" className="tabs tabs-lift w-full">
                {providersArr.map((type, i) => {
                  return (
                    <Fragment key={i}>
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
                                    key={v.provider_id}
                                    className={`${curTab === i ? "h-10 w-10 flex-none" : "hidden"}`}
                                  >
                                    <img
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
                    </Fragment>
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

function Credits({ tv, type }) {
  const {
    data: people,
    isLoading: isCreditsLoading,
    error: creditsError,
  } = useQuery({
    queryKey: ["tv-credits", type, tv.id],
    queryFn: () => getTvCredits({ tv_id: tv.id }),
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

function TvCard({ tv }) {
  return (
    <div
      style={{
        backgroundImage: `url(${`https://image.tmdb.org/t/p/w780${tv.backdrop_path}`})`,
      }}
      className={`rounded-box relative max-h-96 border-0 bg-no-repeat p-4 ${!tv.backdrop_path ? "bg-neutral text-neutral-conten" : ""} flex w-full items-center bg-cover`}
    >
      <div className="rounded-box absolute inset-0 h-full w-full mask-r-from-10% mask-r-to-40% opacity-100 backdrop-blur-sm"></div>
      {/* {movie.backdrop_path && (
        <img
          className="w-full object-cover"
          src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
          alt="Shoes"
        />
      )} */}
      {tv.poster_path && (
        <img
          className="rounded-box z-10 w-26 mask-none shadow-md sm:w-32 md:w-40 lg:w-48"
          src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
        />
      )}
    </div>
  );
}
