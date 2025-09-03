import React from "react";
import { useParams } from "react-router";

export default function Profile() {
  const { username } = useParams();
  return (
    <div>
      Profile
      {username}
    </div>
  );
}
