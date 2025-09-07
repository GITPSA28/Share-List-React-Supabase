import React from "react";
import { useFriends } from "../features/friends/useFriends";
import FullscreenSpinner from "../ui/FullscreenSpinner";
import UserItem from "../ui/UserItem";
import { useUser } from "../features/authentication/useUser";
import ManageFriendship from "../components/ManageFriendship";
import { useSession } from "../contexts/SessionContext";

export default function NotificationPage() {
  const { userProfile: user, isLoading } = useSession();
  if (isLoading) return <FullscreenSpinner />;
  return (
    <div className="bg-base-100 flex flex-col items-center pt-10">
      <div className="max-w-xl min-w-72 pt-3 sm:min-w-sm">
        {user && <Notifications user_id={user.id} />}
      </div>
    </div>
  );
}

function Notifications({ user_id }) {
  const { friends, isLoading } = useFriends({ status: "requested" });

  if (isLoading) return <FullscreenSpinner />;
  console.log(friends, "friendsssss", user_id);
  const requests = friends
    .filter((friend) => user_id === friend.friend_id)
    .map((friendRes) => {
      if (friendRes.user_id === user_id) return friendRes.friend;
      else return friendRes.user;
    });
  const pendingActions = friends
    .filter((friend) => user_id === friend.user_id)
    .map((friendRes) => {
      if (friendRes.user_id === user_id) return friendRes.friend;
      else return friendRes.user;
    });
  console.log(requests);
  if (isLoading) return <FullscreenSpinner />;
  return (
    <>
      {pendingActions?.length < 1 && requests?.length < 1 && (
        <>No new notifications</>
      )}
      {requests?.length > 0 && (
        <div className="">
          <h2 className="font font-semibold">Friend Requests</h2>
          <ul className="list">
            {requests.map((friend) => {
              return (
                <UserItem key={friend.id} user={friend}>
                  <ManageFriendship friend_id={friend.id}>
                    <ManageFriendship.Accept
                      className={"btn btn-xs btn-success"}
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
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                      Accept
                    </ManageFriendship.Accept>
                    <ManageFriendship.Reject
                      className={"btn btn-error btn-soft btn-xs"}
                    >
                      Delete
                    </ManageFriendship.Reject>
                  </ManageFriendship>
                </UserItem>
              );
            })}
          </ul>
        </div>
      )}
      {pendingActions?.length > 0 && (
        <div className="">
          <h2 className="font font-semibold">Requests Sent</h2>
          <ul className="list">
            {pendingActions.map((friend) => {
              return (
                <UserItem key={friend.id} user={friend}>
                  <ManageFriendship friend_id={friend.id}>
                    <ManageFriendship.CancelRequest
                      className={"btn btn-soft btn-xs"}
                    >
                      Cancel
                    </ManageFriendship.CancelRequest>
                  </ManageFriendship>
                </UserItem>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
