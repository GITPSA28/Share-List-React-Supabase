import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getListById } from "../services/apiUserList";
import FullscreenSpinner from "../ui/FullscreenSpinner";
import MovieCard from "../ui/MovieCard";
import useListItemsDetails from "../features/tmdb/useListItemsDetails";
import useListItems from "../features/lists/useListItems";

export default function ListPage() {
  const { listid } = useParams();
  const { isLoading, list } = useListItems({ list_id: listid });
  if (isLoading) return <FullscreenSpinner />;
  if (!list?.items?.length) return <div>Empty List</div>;
  return (
    <div className="p-5" key={listid}>
      <MovieList list={list} />
    </div>
  );
}

function MovieList({ list }) {
  const { listItems, isLoading } = useListItemsDetails({
    items: list.items,
    list_id: list.id,
  });
  if (isLoading) return <FullscreenSpinner />;
  console.log(listItems);
  if (!listItems?.length) return <>Empty</>;
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
        {listItems.map((item) => (
          <div className="max-w-xl sm:flex-2/5" key={item.id}>
            <MovieCard
              movie={item}
              type={item.itemType}
              showOverView={false}
            ></MovieCard>
            {/* <MovieCard movie={item} showOverView={false}></MovieCard> */}
          </div>
        ))}
      </ul>
    </div>
  );
}
