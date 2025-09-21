import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getListById } from "../services/apiUserList";
import FullscreenSpinner from "../ui/FullscreenSpinner";
import MovieCard from "../ui/MovieCard";

export default function ListPage() {
  const { listid } = useParams();
  const [list, setList] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  useEffect(() => {
    async function getListDetails() {
      try {
        setisLoading(true);
        const data = await getListById({ list_id: listid });
        setList(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      } finally {
        setisLoading(false);
      }
    }
    getListDetails();
  }, []);
  if (isLoading) return <FullscreenSpinner />;
  if (!list?.items?.length) return <div>Empty List</div>;
  return (
    <div className="p-5">
      <MovieList list={list} />
    </div>
  );
}

function MovieList({ list }) {
  const [listItems, setListItems] = useState([]);
  const { items } = list;
  useEffect(() => {
    async function getItemData() {
      let itemDetailsReq = items.map(async (item) => {
        let res;
        if (item.type === "movie") {
          res = await fetch(
            `https://api.themoviedb.org/3/movie/${item.value}?api_key=${import.meta.env.VITE_TMDBAPI_KEY}`,
          );
        } else if (item.type === "tv") {
          res = await fetch(
            `https://api.themoviedb.org/3/tv/${item.value}?api_key=${import.meta.env.VITE_TMDBAPI_KEY}`,
          );
        }
        let data = await res.json();
        return { ...data, itemType: item.type };
      });
      let itemDetailsRes = await Promise.allSettled(itemDetailsReq);
      let itemDetails = itemDetailsRes
        .filter((res) => res.status === "fulfilled")
        .map((res) => res.value);
      if (itemDetails.length > 0) {
        setListItems(itemDetails);
      }
    }
    getItemData();
  }, []);
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
