import React, { useEffect, useState } from "react";
import UserName from "../ui/UserName";
import { useUpdateUserProfile } from "../features/username/useUpdateUserProfile";
import Logout from "../features/authentication/Logout";
import { useNavigate } from "react-router";
import { useUsername } from "../features/username/useUsername";
import FullscreenSpinner from "../ui/FullscreenSpinner";
import { useSession } from "../contexts/SessionContext";

export default function SetUserName() {
  const [username, setUsername] = useState("");
  const { isUpdating, updateUserProfileData } = useUpdateUserProfile();
  const { hasUsername, isLoading } = useUsername();
  const { setUserProfile } = useSession();
  const navigate = useNavigate();
  useEffect(
    function () {
      if (hasUsername && !isLoading) {
        navigate("/home", { replace: true });
      }
    },
    [hasUsername, isLoading, navigate],
  );

  function handleSubmit() {
    updateUserProfileData(
      { username },
      {
        onSuccess: (data) => {
          setUserProfile(data);
          navigate("/home", { replace: true });
        },
      },
    );
  }
  if (isLoading || isUpdating) return <FullscreenSpinner />;
  return (
    <div className="flex h-dvh flex-col items-center justify-center">
      <fieldset className="fieldset">
        <p className="fieldset-legend">Set Username to Continue</p>
        <UserName setUsername={setUsername} />
        <button
          disabled={username.length < 3}
          onClick={handleSubmit}
          className="btn btn-primary"
        >
          Submit
        </button>
        <p className="label">You can edit username later from settings</p>
      </fieldset>
      <div className="m-5">
        <Logout />
      </div>
    </div>
  );
}
