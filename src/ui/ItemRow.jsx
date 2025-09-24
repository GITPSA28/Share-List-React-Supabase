import React, { useEffect, useState } from "react";
import AddItemToList from "../components/AddItemToList";
import { getMovieDetails, getTvDetails } from "../services/apiTmdb";
import { Link } from "react-router";
import Avatar from "../ui/Avatar";
import SendItem from "../components/SendItem";
export default function ItemRow({ item }) {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function getDetails() {
      let details;
      if (item.type === "tv") {
        details = await getTvDetails({ tv_id: item.value });
      } else if (item.type === "movie") {
        details = await getMovieDetails({ movie_id: item.value });
      }
      setData(details);
      setIsLoading(false);
    }
    getDetails();
  }, []);
  if (isLoading) return;
  return (
    <li className="list-row">
      <div>
        <img
          className="w-24 rounded-sm"
          src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
        />
      </div>
      <div className="flex flex-col gap-1">
        <div>
          <Link
            className="text-lg font-semibold hover:text-[#40BCF4]"
            to={`/${item.type}/${item.value}`}
          >
            {item.type === "tv" ? data.name : data.title}
          </Link>
          <span className="font-mono text-xs opacity-70">
            {data.release_date && " " + data.release_date?.split("-")[0]}
          </span>
        </div>
        <p className="text-base-content/70">{data.tagline && data.tagline}</p>
        <div className="mb-4 flex gap-2 text-xs uppercase">
          <Link
            className="flex items-center gap-1"
            to={`/profile/${item.list.owner.username}`}
          >
            <Avatar user={item.list.owner} className={"size-6 rounded-full"} />
            {`${item.list.owner.username}'s `}
          </Link>

          <Link
            className="link-hover link flex items-center opacity-70 hover:opacity-100"
            to={`/list/${item.list.list_id}`}
          >
            <em>{item.list.list_name} </em>
          </Link>
        </div>
        <div className="flex gap-2">
          <SendItem
            className="btn btn-sm btn-soft"
            item={data}
            type={item.type}
          />
          <AddItemToList
            className="btn btn-sm btn-ghost"
            item={data}
            type={item.type}
          />
        </div>
      </div>
    </li>
  );
}
