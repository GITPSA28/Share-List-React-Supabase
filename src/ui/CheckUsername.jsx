import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useUsername } from "../features/username/useUserName";
import FullscreenSpinner from "./FullscreenSpinner";
import { useSession } from "../contexts/SessionContext";

function CheckUsername({ children }) {
  const { userProfile: profile, isLoading } = useSession();
  let hasUsername = profile?.username?.length > 2;
  const navigate = useNavigate();
  useEffect(
    function () {
      if (!isLoading && !hasUsername) navigate("/setusername");
    },
    [isLoading, hasUsername, navigate],
  );
  if (isLoading) return <FullscreenSpinner />;
  if (hasUsername) return children;
}

export default CheckUsername;
