import React, { useState } from "react";
import useUserLists from "../features/lists/useUserLists";
import useUserId from "../features/authentication/useUserId";
import Spinner from "../ui/Spinner";
import { Link } from "react-router";

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
              <li key={list.id} className="list-row items-center">
                <div></div>
                <div>
                  <Link to={`/list/${list.list_id}`}>
                    <div className="font-semibold tracking-wide uppercase opacity-90 hover:underline">
                      {list.list_name}
                    </div>
                  </Link>
                </div>
                <ListVisibilityControll
                  onChange={(e) => console.log(e.target.value)}
                  defaultValue={list.visibility}
                />
              </li>
            );
          })}
          <li className="list-row">
            <CreateList />
          </li>
        </ul>
      )}
    </div>
  );
}

function CreateList() {
  const [listName, setListName] = useState("");
  const [listVisibility, setListVisibility] = useState("friends");
  function handleCreate() {
    console.log(listName, listVisibility);
  }
  return (
    <>
      <input
        type="text"
        value={listName}
        onChange={(e) => setListName(e.target.value)}
        placeholder="New List Name..."
        className="input input-sm list-col-grow"
      />
      <ListVisibilityControll
        value={listVisibility}
        onChange={(e) => setListVisibility(e.target.value)}
      />
      <button onClick={handleCreate} className="btn btn-sm btn-soft">
        Create
      </button>
    </>
  );
}

function ListVisibilityControll({ value, defaultValue, onChange }) {
  return (
    <select
      name="visibility"
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      className="select select-sm"
    >
      <option disabled={true}>List Visibility</option>
      <option value={"private"}>&#128274; Private</option>
      <option value={"friends"}>&#129730; Friends</option>
      <option value={"public"}>&#127760; Public</option>
    </select>
  );
}
