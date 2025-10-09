import React, { useState } from "react";
import useUserLists from "../features/lists/useUserLists";
import useUserId from "../features/authentication/useUserId";
import Spinner from "../ui/Spinner";
import { Link } from "react-router";
import { useCreateList } from "../features/lists/useCreateList";
import { useUpdateList } from "../features/lists/useUpdateList";
import DeleteList from "../components/DeleteList";

export default function MyLists() {
  const { user_id } = useUserId();
  const { isLoading, lists, error } = useUserLists({ user_id });
  return (
    <div className="flex flex-col items-center justify-center gap-3 pt-5">
      <h2 className="font-bold uppercase">My Lists</h2>
      {isLoading && <Spinner />}
      {lists?.length > 0 && (
        <ul className="list bg-base-100 rounded-box w-full max-w-xl shadow-md">
          {lists.map((list) => {
            return (
              <li
                key={list.id}
                className="list-row items-center text-xs sm:text-sm"
              >
                <div></div>
                <div>
                  <Link to={`/list/${list.list_id}`}>
                    <div className="font-semibold tracking-wide uppercase opacity-90 hover:underline">
                      {list.list_name}
                    </div>
                  </Link>
                </div>
                <UpdateList list={list} />
                {list.list_type === "custom" && (
                  <DeleteList
                    className={
                      "btn btn-xs sm:btn-sm btn-soft btn-circle btn-error"
                    }
                    list_id={list.list_id}
                    list_name={list.list_name}
                  />
                )}
              </li>
            );
          })}
          <li className="list-row">
            <CreateList user_id={user_id} />
          </li>
        </ul>
      )}
    </div>
  );
}
function UpdateList({ list }) {
  const { isUpdating, updateListDetails } = useUpdateList({
    list_id: list.list_id,
  });
  function handleVisibilityUpdate(visibility) {
    updateListDetails({ visibility });
  }
  return (
    <ListVisibilityControll
      disabled={isUpdating}
      onChange={(e) => handleVisibilityUpdate(e.target.value)}
      defaultValue={list.visibility}
    />
  );
}
function CreateList({ user_id }) {
  const [listName, setListName] = useState("");
  const [listVisibility, setListVisibility] = useState("friends");
  const { createNewList, isCreating } = useCreateList({ owner_id: user_id });
  function handleCreate() {
    createNewList({ list_name: listName, visibility: listVisibility });
    setListName("");
  }
  return (
    <>
      <input
        type="text"
        value={listName}
        disabled={isCreating}
        onChange={(e) => setListName(e.target.value)}
        placeholder="New List Name..."
        className="input input-xs sm:input-sm list-col-grow"
      />
      <ListVisibilityControll
        value={listVisibility}
        disabled={isCreating}
        onChange={(e) => setListVisibility(e.target.value)}
      />
      <button
        disabled={isCreating}
        onClick={handleCreate}
        className="btn btn-xs sm:btn-sm btn-soft"
      >
        Create
      </button>
    </>
  );
}

function ListVisibilityControll({ value, defaultValue, onChange, disabled }) {
  return (
    <select
      name="visibility"
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      disabled={disabled}
      className="select select-xs sm:select-sm"
    >
      <option disabled={true}>List Visibility</option>
      <option value={"private"}>&#128274; Private</option>
      <option value={"friends"}>&#129730; Friends</option>
      <option value={"public"}>&#127760; Public</option>
    </select>
  );
}
