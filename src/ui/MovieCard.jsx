import React, { useState } from "react";
import { Link } from "react-router";

export default function MovieCard({
  movie,
  type = "movie",
  children,
  showOverView = true,
}) {
  const [overview, setOverview] = useState(
    () =>
      `${movie.overview?.substring(0, 60)}${movie.overview?.length > 60 ? "..." : ""}`,
  );

  return (
    <div
      className={`card ${!movie.backdrop_path ? "bg-neutral text-neutral-conten" : "bg-base-100"} image-full h-full w-full shadow-sm`}
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
      <div className="card-body hover:inset-shadow-primary movie-list">
        {movie.poster_path && (
          <img
            className="z-10 w-20 rounded-sm sm:w-28"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          />
        )}
        <div className="card-title items-end gap-1 text-lg font-bold">
          <p className="wrap-anywhere">
            <Link
              className="cursor-pointer hover:text-[#40BCF4]"
              to={`/${type}/${movie.id}`}
            >
              <span>
                {type === "movie" && movie.title}
                {type === "tv" && movie.name}
              </span>
            </Link>
            <span className="font-mono text-xs opacity-70">
              {movie.release_date && " " + movie.release_date?.split("-")[0]}
            </span>
          </p>
        </div>

        {showOverView && (
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
