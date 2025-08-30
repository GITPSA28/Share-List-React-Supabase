import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useUsername } from "../features/username/useUserName";
import FullscreenSpinner from "./FullscreenSpinner";

function CheckUsername({ children }) {
  const { hasUsername, isLoading } = useUsername();
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
