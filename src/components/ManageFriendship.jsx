import React, { createContext, useContext, useState } from "react";
import { useFriendship } from "../features/friends/useFriendship";
import {
  acceptFriendRequest,
  rejectFriendRequest,
  sendFriendRequest,
} from "../services/apiFriends";
import { useSession } from "../contexts/SessionContext";
import { useQueryClient } from "@tanstack/react-query";

const ManageFriendShipContext = createContext();

function ManageFriendship({ friend_id, children }) {
  const {
    friendship,
    isLoading,
    refetch: refetchFriendship,
    isRefetching,
  } = useFriendship({ friend_id });
  const {
    session: {
      user: { id: user_id },
    },
  } = useSession();
  return (
    <ManageFriendShipContext.Provider
      value={{
        user_id: user_id,
        friendship,
        isFriendshipLoading: isLoading || isRefetching,
        refetchFriendship,
        friend_id,
      }}
    >
      <>{children || <></>}</>
    </ManageFriendShipContext.Provider>
  );
}
function AddFriend({ children, className = null }) {
  const {
    friend_id,
    user_id,
    friendship,
    isFriendshipLoading: isLoading,
    refetchFriendship,
  } = useContext(ManageFriendShipContext);
  const isVisible = !friendship && friend_id != user_id;
  if (!isVisible) return null;
  return (
    <ManageFriendRequestButton
      onStatusChange={refetchFriendship}
      friend_id={friend_id}
      className={className ?? "btn btn-primary btn-sm"}
      isLoading={isLoading}
      type={"Request"}
    >
      {children ?? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
            />
          </svg>
          Add Friend
        </>
      )}
    </ManageFriendRequestButton>
  );
}
function Accept({ children, className = null }) {
  const {
    friend_id,
    user_id,
    friendship,
    isFriendshipLoading: isLoading,
    refetchFriendship,
  } = useContext(ManageFriendShipContext);

  const isVisible =
    friend_id != user_id &&
    friendship?.status === "requested" &&
    friendship?.friend_id === user_id;
  if (!isVisible) return null;
  return (
    <ManageFriendRequestButton
      onStatusChange={refetchFriendship}
      friend_id={friend_id}
      className={className ?? "btn btn-success btn-sm"}
      isLoading={isLoading}
      type={"Accept"}
    >
      {children ?? (
        <>
          <svg
            xmlns="http:www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          Accept
        </>
      )}
    </ManageFriendRequestButton>
  );
}
function CancelRequest({ children, className = null }) {
  const {
    friend_id,
    user_id,
    friendship,
    isFriendshipLoading: isLoading,
    refetchFriendship,
  } = useContext(ManageFriendShipContext);
  const isVisible =
    friend_id != user_id &&
    friendship?.status === "requested" &&
    friendship?.user_id === user_id;
  if (!isVisible) return null;
  return (
    <ManageFriendRequestButton
      className={className ?? "btn btn-soft btn-error btn-sm"}
      friend_id={friend_id}
      onStatusChange={refetchFriendship}
      isLoading={isLoading}
      type={"Reject"}
    >
      {children ?? (
        <>
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
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          Cancel Request
        </>
      )}
    </ManageFriendRequestButton>
  );
}
function Delete({ children, className = null }) {
  const {
    friend_id,
    user_id,
    friendship,
    isFriendshipLoading: isLoading,
    refetchFriendship,
  } = useContext(ManageFriendShipContext);
  const isVisible =
    friend_id != user_id &&
    friendship?.status === "accepted" &&
    (friendship?.friend_id === user_id || friendship?.user_id === user_id);
  if (!isVisible) return null;
  return (
    <ManageFriendRequestButton
      className={className ?? "btn-soft btn btn-error btn-sm"}
      friend_id={friend_id}
      onStatusChange={refetchFriendship}
      isLoading={isLoading}
      type={"Reject"}
    >
      {children ?? (
        <>
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
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          Remove Friend
        </>
      )}
    </ManageFriendRequestButton>
  );
}
function Reject({ children, className = null }) {
  const {
    friend_id,
    user_id,
    friendship,
    isFriendshipLoading: isLoading,
    refetchFriendship,
  } = useContext(ManageFriendShipContext);
  const isVisible =
    friend_id != user_id &&
    friendship?.status === "requested" &&
    friendship?.friend_id === user_id;
  if (!isVisible) return null;
  return (
    <ManageFriendRequestButton
      className={className ?? "btn-soft btn btn-error btn-sm"}
      friend_id={friend_id}
      onStatusChange={refetchFriendship}
      isLoading={isLoading}
      type={"Reject"}
    >
      {children ?? (
        <>
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
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          Reject
        </>
      )}
    </ManageFriendRequestButton>
  );
}
function ManageFriendRequestButton({
  className,
  friend_id,
  onStatusChange,
  type,
  children,
  isLoading,
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const {
    session: {
      user: { id: user_id },
    },
  } = useSession();
  const queryClient = useQueryClient();
  async function handleFriendRequestUpdate(e) {
    e.preventDefault();
    try {
      let res;
      setIsUpdating(true);
      switch (type) {
        case "Request":
          res = await sendFriendRequest(user_id, friend_id);
          break;
        case "Reject":
          res = await rejectFriendRequest(user_id, friend_id);
          break;
        case "Accept":
          res = await acceptFriendRequest(user_id, friend_id);
          break;
        default:
          res = null;
          break;
      }
      queryClient.invalidateQueries(["friends"]);
    } catch (e) {
      console.log(e);
    } finally {
      onStatusChange();
      setIsUpdating(false);
    }
  }
  // console.log(visible, type);
  return (
    <button
      disabled={isLoading || isUpdating}
      onClick={handleFriendRequestUpdate}
      className={`${className}`}
    >
      {(isLoading || isUpdating) && (
        <span className="loading loading-spinner"></span>
      )}
      {children}
    </button>
  );
}

ManageFriendship.AddFriend = AddFriend;
ManageFriendship.Accept = Accept;
ManageFriendship.CancelRequest = CancelRequest;
ManageFriendship.Reject = Reject;
ManageFriendship.Delete = Delete;

export default ManageFriendship;
