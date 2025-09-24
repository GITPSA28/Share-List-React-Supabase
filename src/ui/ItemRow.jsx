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
          className="w-15 rounded-sm"
          src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-lg font-semibold hover:text-[#40BCF4]">
          <Link to={`/${item.type}/${item.value}`}>
            {item.type === "tv" ? data.name : data.title}
          </Link>
        </div>
        <div className="flex gap-2 text-xs uppercase">
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
      </div>
      <div className="flex flex-col">
        <AddItemToList
          className={"btn btn-square btn-sm btn-ghost"}
          item={data}
          type={item.type}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-info-icon lucide-info"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </AddItemToList>
        <SendItem
          className={"btn btn-square btn-sm btn-ghost"}
          item={data}
          type={item.type}
        >
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
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
        </SendItem>
      </div>
    </li>
  );
}
