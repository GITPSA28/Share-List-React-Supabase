import React, { useState } from "react";
import ThemeController from "../ui/ThemeController";
import UserName from "../ui/UserName";

export default function Settings() {
  const [username, setUsername] = useState();
  return (
    <div className="bg-base-100 flex flex-col items-center justify-center gap-5 pt-8">
      <p>Settings</p>
      <ThemeController />
      <UserName setUsername={setUsername} />
    </div>
  );
}
