import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getUserProfileDataByUserName } from "../services/apiProfile";
import FullscreenSpinner from "../ui/FullscreenSpinner";
import supabase from "../services/supabase";
import Spinner from "../ui/Spinner";
import { useUser } from "../features/authentication/useUser";
import {
  acceptFriendRequest,
  getFriendStatus,
  rejectFriendRequest,
  sendFriendRequest,
} from "../services/apiFriends";
import ManageFriendship from "../components/ManageFriendship";

export default function Profile() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { user, isLoading: isLoadingUser } = useUser();

  useEffect(() => {
    async function getData() {
      const data = await getUserProfileDataByUserName({ username });
      if (!data) {
        setIsLoading(false);
        return;
      }
      setUserData(data);
      setIsLoading(false);
      //   console.log(data);
    }
    setIsLoading(true);
    getData();
  }, [user]);

  // console.log(userData.id);
  return (
    <div className="bg-base-100 flex flex-col items-center justify-center gap-5 pt-8">
      <div className="flex w-sm flex-col gap-5 sm:w-full sm:max-w-xl">
        {(isLoading || isLoadingUser || !user || !username || !userData) && (
          <FullscreenSpinner />
        )}
        {userData && (
          <>
            <div className="flex flex-col items-center gap-2">
              {userData.avatar_url ? (
                <div className="avatar">
                  <div className="w-18 rounded-full">
                    <img
                      referrerPolicy="no-referrer"
                      src={userData.avatar_url}
                    />
                  </div>
                </div>
              ) : (
                <div className="avatar avatar-placeholder">
                  <div className="bg-neutral text-neutral-content w-18 rounded-full">
                    <span className="text-xl font-semibold">
                      {userData.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
              <h1 className="text-xl font-semibold lowercase">
                @{userData.username}
              </h1>
              <div className="text-sm font-semibold opacity-80">
                {userData.full_name}
              </div>
            </div>

            {/* <FriendControll friend_id={userData.id} user_id={user.id} /> */}

            <div className="flex justify-center gap-2">
              <ManageFriendship friend_id={userData.id}>
                <>
                  <ManageFriendship.AddFriend />
                  <ManageFriendship.CancelRequest />
                  <div>
                    <ManageFriendship.Accept />
                    <ManageFriendship.Reject />
                  </div>
                </>
              </ManageFriendship>
            </div>
            <div className="flex justify-center">
              <AllLists owner_id={userData.id} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// function FriendControll({ friend_id, user_id }) {
//   const [friendship, setFreindship] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   useEffect(() => {
//     async function getFriendship() {
//       try {
//         const friendshipRes = await getFriendStatus(friend_id, user_id);
//         if (friendshipRes) setFreindship(friendshipRes);
//       } catch (error) {
//         console.log(error);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     getFriendship();
//   }, []);
//   async function onStatusChange() {
//     setIsLoading(true);
//     const friendshipRes = await getFriendStatus(friend_id, user_id);
//     setFreindship(friendshipRes);
//     setIsLoading(false);
//   }
//   if (!friendship && friend_id != user_id)
//     return (
//       <div className="flex justify-center gap-2">
//         <ManageFriendRequestButton
//           onStatusChange={onStatusChange}
//           friend_id={friend_id}
//           className="btn btn-primary btn-sm"
//           isLoading={isLoading}
//           type={"Request"}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth={1.5}
//             stroke="currentColor"
//             className="w-4"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
//             />
//           </svg>
//           Add Friend
//         </ManageFriendRequestButton>
//       </div>
//     );
//   return (
//     <>
//       {friend_id != user_id && (
//         <div className="flex justify-center gap-2">
//           {friendship.status === "requested" &&
//             friendship.user_id === user_id && (
//               <ManageFriendRequestButton
//                 className={"btn btn-error btn-sm"}
//                 friend_id={friend_id}
//                 onStatusChange={onStatusChange}
//                 isLoading={isLoading}
//                 type={"Reject"}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={1.5}
//                   stroke="currentColor"
//                   className="size-4"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
//                   />
//                 </svg>
//                 Cancel Request
//               </ManageFriendRequestButton>
//             )}
//           {friendship.status === "requested" &&
//             friendship.friend_id === user_id && (
//               <>
//                 <ManageFriendRequestButton
//                   className={"btn btn-success btn-sm"}
//                   friend_id={friend_id}
//                   onStatusChange={onStatusChange}
//                   isLoading={isLoading}
//                   type={"Accept"}
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth={1.5}
//                     stroke="currentColor"
//                     className="size-4"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
//                     />
//                   </svg>
//                   Accept
//                 </ManageFriendRequestButton>

//                 <ManageFriendRequestButton
//                   className={"btn btn-error btn-sm"}
//                   friend_id={friend_id}
//                   onStatusChange={onStatusChange}
//                   isLoading={isLoading}
//                   type={"Reject"}
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth={1.5}
//                     stroke="currentColor"
//                     className="size-4"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
//                     />
//                   </svg>
//                   Reject
//                 </ManageFriendRequestButton>
//               </>
//             )}
//           {friendship.status === "accepted" && (
//             <button className="btn btn-sm btn-error">Remove Friend</button>
//           )}
//         </div>
//       )}
//     </>
//   );
// }

// function ManageFriendRequestButton({
//   className,
//   friend_id,
//   onStatusChange,
//   type,
//   children,
//   isLoading,
// }) {
//   const [isUpdating, setIsUpdating] = useState(false);
//   const { user, isLoading: isUserLoading } = useUser();

//   async function handleFriendRequestUpdate() {
//     try {
//       let res;
//       setIsUpdating(true);
//       switch (type) {
//         case "Request":
//           res = await sendFriendRequest(user.id, friend_id);
//           break;
//         case "Reject":
//           res = await rejectFriendRequest(user.id, friend_id);
//           break;
//         case "Accept":
//           res = await acceptFriendRequest(user.id, friend_id);
//           break;
//         default:
//           res = null;
//           break;
//       }
//     } catch (e) {
//       console.log(e);
//     } finally {
//       onStatusChange();
//       setIsUpdating(false);
//     }
//   }

//   return (
//     <button
//       disabled={isUserLoading || isLoading || isUpdating}
//       onClick={handleFriendRequestUpdate}
//       className={className}
//     >
//       {(isLoading || isUserLoading || isUpdating) && (
//         <span className="loading loading-spinner"></span>
//       )}
//       {children}
//     </button>
//   );
// }

// function RejectFriendRequest({
//   className,
//   friend_id,
//   onStatusChange,
//   children,
//   isLoading,
// }) {
//   const { user, isLoading: isUserLoading } = useUser();
//   async function handleFriendRequestUpdate() {
//     try {
//       const res = await rejectFriendRequest(user.id, friend_id);
//       onStatusChange();
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   return (
//     <button
//       disabled={isUserLoading || isLoading}
//       onClick={handleFriendRequestUpdate}
//       className={className}
//     >
//       {(isLoading || isUserLoading) && (
//         <span className="loading loading-spinner"></span>
//       )}
//       {children}
//     </button>
//   );
// }

// function AddFriend({
//   className,
//   friend_id,
//   onStatusChange,
//   isLoading,
//   children,
// }) {
//   const { user, isLoading: isUserLoading } = useUser();
//   async function handleFriendRequest() {
//     try {
//       const res = await sendFriendRequest(user.id, friend_id);
//       onStatusChange(res);
//     } catch (e) {
//       console.log(e);
//     }
//   }
//   return (
//     <button
//       disabled={isUserLoading || isLoading}
//       onClick={handleFriendRequest}
//       className={className}
//     >
//       {(isUserLoading || isLoading) && (
//         <span className="loading loading-spinner"></span>
//       )}
//       {children}
//     </button>
//   );
// }

function AllLists({ owner_id }) {
  const [lists, setLists] = useState([]);
  useEffect(() => {
    async function getMovies() {
      let { data: listsResult, error } = await supabase
        .from("lists")
        .select(`*,items (*)`)
        .eq("owner_id", owner_id);
      if (error) throw error;
      setLists(listsResult);
    }

    getMovies();
  }, []);
  return (
    <div className="flex w-11/12 flex-col gap-3">
      {lists.map((list) => (
        <MovieList key={list.list_id} list={list} />
      ))}
    </div>
  );
}

function MovieList({ list }) {
  const [movies, setMovies] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { items } = list;
  useEffect(() => {
    async function getMovies() {
      setIsLoading(true);
      let movieDetailsReq = items.map(async (movie) => {
        let res = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.value}?api_key=${import.meta.env.VITE_TMDBAPI_KEY}`,
        );
        return res.json();
      });
      let movieDetailsRes = await Promise.allSettled(movieDetailsReq);
      let movieDetails = movieDetailsRes
        .filter((res) => res.status === "fulfilled" && res.value?.id != null)
        .map((res) => res.value);
      if (movieDetails.length > 0) {
        setMovies(movieDetails);
      }
      setIsLoading(false);
    }
    getMovies();
  }, []);
  if (isLoading) return <Spinner />;
  if (!movies) return null;
  return (
    <div className="w-full">
      <div className="mb-0.5 font-bold">{list.list_name}</div>
      <div className="flex snap-x gap-1 overflow-x-auto">
        {movies.map((movie) => (
          <MovieTile
            key={movie.id}
            url={
              movie?.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : ""
            }
            height={"h-48"}
            width={"h-36"}
            alt={movie.title}
          />
        ))}
      </div>
    </div>
  );
}

function MovieTile({ url, alt, height, width }) {
  if (!url)
    return (
      <div
        className={`rounded-box skeleton flex ${height} ${width} items-center justify-center`}
      >
        No Image
      </div>
    );
  return (
    <img
      className={`rounded-box skeleton flex-shrink-0 ${height} ${width} object-cover`}
      src={url}
      alt={alt}
    />
  );
}
