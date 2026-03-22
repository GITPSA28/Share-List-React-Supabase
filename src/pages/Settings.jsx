import React, { useState } from "react";
import ThemeController from "../ui/ThemeController";
import UserName from "../ui/UserName";
import Logout from "../features/authentication/Logout";
import DisplayName from "../ui/DisplayName";

export default function Settings() {
  const [username, setUsername] = useState();
  const [displayName, setDisplayName] = useState();
  return (
    <div className="bg-base-100 flex flex-col items-center justify-center pt-8">
      <p className="mb-5">Settings</p>
      <ThemeController />
      <UserName setUsername={setUsername} />
      <DisplayName setDisplayName={setDisplayName} />
      <Logout />
    </div>
  );
}
