import React, { useState } from "react";

export default function MovieCard({ movie, children, enableOverView = true }) {
  const [overview, setOverview] = useState(
    () =>
      `${movie.overview?.substring(0, 60)}${movie.overview?.length > 60 ? "..." : ""}`,
  );

  return (
    <div
      className={`card ${!movie.backdrop_path ? "bg-neutral text-neutral-conten" : "bg-base-100"} image-full w-full shadow-sm sm:w-2xs xl:w-sm`}
    >
      <figure className="">
        {movie.backdrop_path && (
          <img
            className="object-cover sm:w-2xs xl:w-sm"
            src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
            alt="Shoes"
          />
        )}
      </figure>
      <div className="card-body hover:inset-shadow-primary">
        {movie.poster_path && (
          <img
            className="z-10 w-20 rounded-sm sm:w-28"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          />
        )}
        <div className="card-title items-end gap-1 text-lg font-bold">
          <p className="wrap-anywhere">
            <span className="cursor-pointer hover:text-[#40BCF4]">
              {movie.title + " "}
            </span>
            <span className="font-mono text-xs opacity-70">
              {movie.release_date?.split("-")[0]}
            </span>
          </p>
        </div>

        {enableOverView && (
          <p
            tabIndex={0}
            role="button"
            onClick={() => {
              setOverview(movie.overview);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") setOverview(movie.overview);
            }}
          >
            {overview}
          </p>
        )}

        <div className="card-actions justify-end">{children}</div>
      </div>
    </div>
  );
}
