import React, { useEffect, useState } from "react";
import SearchBar from "../ui/SearchBar";
import { searchUsers } from "../services/apiProfile";
import { Link } from "react-router";
import { getFriendsDetails } from "../services/apiFriends";
import { useUser } from "../features/authentication/useUser";
import FullscreenSpinner from "../ui/FullscreenSpinner";
import Spinner from "../ui/Spinner";

export default function Friends() {
  const [curTab, setTab] = useState(0);
  const { user, isLoading } = useUser();
  console.log("0000000000", user);
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
        {curTab === 0 && <MyFriends user_id={user.id} />}
        {curTab === 1 && <AddFriends />}
      </div>
    </div>
  );
}

function MyFriends({ user_id }) {
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function getFriends() {
      setIsLoading(true);
      if (!user_id) {
        setIsLoading(false);
        return;
      }
      try {
        console.log(user_id);
        const res = await getFriendsDetails(user_id, "accepted");
        setFriends(res);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    }
    getFriends();
  }, [user_id]);
  console.log(friends);
  if (isLoading) return <Spinner />;
  //   return <></>;
  return (
    <ul className="list pt-2">
      {friends &&
        friends.map((user) => {
          return (
            <li key={user.id}>
              <Link
                className="bg-base-300 text-base-content rounded-box m-2 flex cursor-pointer gap-4 p-2"
                to={`/profile/${user.username}`}
              >
                <UserItem user={user} />
              </Link>
            </li>
          );
        })}
    </ul>
  );
}

function AddFriends() {
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
    <>
      <form onSubmit={handleSearch}>
        <SearchBar value={value} onChange={(val) => setValue(val)} />
      </form>
      <ul className="list pt-2">
        {results.map((user) => {
          return (
            <li key={user.id}>
              <Link
                className="bg-base-300 text-base-content rounded-box m-2 flex cursor-pointer gap-4 p-2"
                to={`/profile/${user.username}`}
              >
                <UserItem user={user} />
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function UserItem({ user }) {
  return (
    <>
      <div className="flex items-center justify-center">
        {user.avatar_url !== null ? (
          <div className="avatar">
            <div className="size-10 rounded-full">
              <img src={user.avatar_url} />
            </div>
          </div>
        ) : (
          <div className="avatar avatar-placeholder">
            <div className="bg-neutral text-neutral-content size-10 rounded-full">
              <span className="text-xl font-semibold">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center">
        <div className="font-semibold">{user.full_name}</div>
        <div className="text-xs lowercase opacity-60">@{user.username}</div>
      </div>
    </>
  );
}

// <div className="flex">
//   <div>
//     {user.avatar_url !== null ? (
//       <div className="avatar">
//         <div className="w-16 rounded-full">
//           <img src={user.avatar_url} />
//         </div>
//       </div>
//     ) : (
//       <div className="avatar avatar-placeholder">
//         <div className="bg-neutral text-neutral-content w-16 rounded-full">
//           <span className="text-4xl font-semibold">
//             {user.username.charAt(0).toUpperCase()}
//           </span>
//         </div>
//       </div>
//     )}
//   </div>

//   <div>
//     <p className="text-lg">{user.full_name}</p>
//     <p className="text-base-content">@{user.username}</p>
//   </div>
// </div>
