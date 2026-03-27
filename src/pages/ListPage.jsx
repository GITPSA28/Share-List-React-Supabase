import React from "react";
import { Link, useParams } from "react-router";
import FullscreenSpinner from "../ui/FullscreenSpinner";
import MovieCard from "../ui/MovieCard";
import useListItemsDetails from "../features/tmdb/useListItemsDetails";
import useListItems from "../features/lists/useListItems";
import AddItemToList from "../components/AddItemToList";
import SendItem from "../components/SendItem";
import DeleteItemFromList from "../components/DeleteItemFromList";
import { useSession } from "../contexts/SessionContext";
import useItemDetails from "../features/tmdb/useItemDetails";
import Empty from "../ui/Empty";

export default function ListPage() {
  const { listid } = useParams();
  const { isLoading, list } = useListItems({ list_id: listid });
  if (isLoading) return <FullscreenSpinner />;
  if (!list?.items?.length)
    return <Empty emptyText="(Empty List)" emptyTitle={list?.list_name} />;
  return (
    <div className="p-5" key={listid}>
      <MovieList list={list} />
    </div>
  );
}

function MovieList({ list }) {
  const {
    session: {
      user: { id: user_id },
    },
  } = useSession();
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
        {list?.items?.map((item) => (
          <Item
            key={item.id}
            value={item.value}
            type={item.type}
            itemId={item.id}
            showDelete={
              list.owner_id === user_id || list.recommended_to === user_id
            }
          />
        ))}
      </ul>
    </div>
  );
}

function Item({ value, type, itemId, showDelete = false }) {
  const { data: item, isLoading } = useItemDetails({
    value,
    type,
  });
  if (isLoading) return;
  if (!item) return;
  return (
    <div className="max-w-xl sm:flex-2/5">
      <MovieCard movie={item} type={type} showOverView={false}>
        <AddItemToList item={item} type={type} />
        <SendItem item={item} type={type} />
        {showDelete && (
          <DeleteItemFromList
            className="btn btn-circle btn-ghost btn-sm btn-error"
            item_id={itemId}
          />
        )}
      </MovieCard>
    </div>
  );
}
