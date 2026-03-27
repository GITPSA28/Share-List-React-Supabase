import React from "react";
import { Link } from "react-router";

export default function Empty({ emptyTitle, emptyText }) {
  return (
    <div className="flex w-full flex-col items-center gap-3 pt-3">
      <h1 className="text-2xl font-bold tracking-wide uppercase">
        {emptyTitle}
      </h1>
      <p className="text">{emptyText}</p>
      <div>
        Try searching or go to{" "}
        <span>
          <Link className="link" to={`/home`}>
            Home page
          </Link>
        </span>
      </div>
    </div>
  );
}
