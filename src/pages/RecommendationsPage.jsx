import React, { useEffect, useState } from "react";
import supabase from "../services/supabase";
import { useSession } from "../contexts/SessionContext";
import AddItemToList from "../components/AddItemToList";
import FullscreenSpinner from "../ui/FullscreenSpinner";
import { getMovieDetails, getTvDetails } from "../services/apiTmdb";
import { Link } from "react-router";
import Avatar from "../ui/Avatar";

export default function RecommendationsPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    session: {
      user: { id: user_id },
    },
  } = useSession();
  useEffect(() => {
    async function getItems() {
      const { data } = await supabase
        .from("items")
        .select(
          `*,list:items_list_id_fkey!inner(list_id,list_name,recommended_to,owner_id,owner:profiles!lists_owner_id_fkey1(*))`,
        )
        .eq("list.recommended_to", user_id)
        .order("created_at", {
          ascending: false,
        });
      setItems(data);
      setIsLoading(false);
    }
    setIsLoading(true);
    getItems();
  }, []);
  if (isLoading) return <FullscreenSpinner />;
  if (!items) return <p>Empty</p>;
  return (
    <div>
      <ul className="list bg-base-100 rounded-box shadow-md">
        <li className="p-4 pb-2 text-xl font-bold tracking-wide">
          Recommendations to you
        </li>
        {items.map((item) => {
          return <Row item={item} />;
        })}
      </ul>
    </div>
  );
}
function Row({ item }) {
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
      {/* <button className="btn btn-square btn-ghost">
        <svg
          className="size-[1.2em]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2"
            fill="none"
            stroke="currentColor"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </g>
        </svg>
      </button> */}
    </li>
  );
}
