import React, { useEffect, useState } from "react";
import SearchBar from "../ui/SearchBar";
import { searchUsers } from "../services/apiProfile";
import { getFriendsDetails } from "../services/apiFriends";
import { useUser } from "../features/authentication/useUser";
import FullscreenSpinner from "../ui/FullscreenSpinner";
import Spinner from "../ui/Spinner";
import UserItem from "../ui/UserItem";
import { useFriends } from "../features/friends/useFriends";
import { useSession } from "../contexts/SessionContext";

export default function Friends() {
  const [curTab, setTab] = useState(0);
  const {
    session: { user },
    isLoading,
  } = useSession();
  if (isLoading || !user) return <FullscreenSpinner />;
  return (
    <div className="bg-base-100 flex min-h-svh flex-col items-center pt-10">
      <div role="tablist" className="tabs tabs-border">
        <button
          role="tab"
          onClick={() => setTab(0)}
          className={`tab ${curTab === 0 ? "tab-active" : ""}`}
        >
          My friends
        </button>
        <button
          role="tab"
          onClick={() => setTab(1)}
          className={`tab ${curTab === 1 ? "tab-active" : ""}`}
        >
          Add friends
        </button>
      </div>

      <div className="max-w-xl min-w-72 pt-3 sm:min-w-sm">
        <MyFriends user_id={user.id} className={curTab != 0 ? "hidden" : ""} />
        <AddFriends className={curTab != 1 ? "hidden" : ""} />
      </div>
    </div>
  );
}

function MyFriends({ user_id, className }) {
  const { friends, isLoading } = useFriends({ status: "accepted" });
  if (isLoading) return <Spinner />;
  // if (!friends.length) return ;
  let friendList = friends.map((friendRes) => {
    if (friendRes.user_id === user_id) return friendRes.friend;
    else return friendRes.user;
  });
  return (
    <ul className={`list pt-2 ${className}`}>
      {friends.length > 0 ? (
        friendList.map((user) => {
          return (
            <li key={user.id}>
              <UserItem className={"p-2"} user={user} />
            </li>
          );
        })
      ) : (
        <p className="w-full text-center">No friends</p>
      )}
    </ul>
  );
}

function AddFriends({ className }) {
  const [value, setValue] = useState("");
  const [results, setResults] = useState([]);
  async function handleSearch(e) {
    e.preventDefault();
    if (!value.length) return;
    const res = await searchUsers(value);
    console.log(res);
    setResults(res);
  }
  return (
    <div className={`w-full ${className}`}>
      <form className="w-full" onSubmit={handleSearch}>
        <SearchBar value={value} onChange={(val) => setValue(val)} />
      </form>
      <ul className="list pt-2">
        {results.map((user) => {
          return (
            <li key={user.id}>
              <UserItem className={"p-2"} user={user} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
