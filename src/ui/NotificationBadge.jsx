import React from "react";
import { useFriends } from "../features/friends/useFriends";

export default function NotificationBadge() {
  const { friends, isLoading } = useFriends({ status: "requested" });

  return (
    <span className="badge badge-xs badge-primary indicator-item">
      {friends?.length ? (friends.length > 9 ? "9+" : friends.length) : 0}
    </span>
  );
}
