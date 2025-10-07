import { useUser } from "../features/authentication/useUser";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import FullscreenSpinner from "./FullscreenSpinner";
import { useSession } from "../contexts/SessionContext";

function ProtectedRoute({ children }) {
  const { session, isLoading } = useSession();
  const navigate = useNavigate();
  const isAuthenticated = session?.user?.role === "authenticated" || false;
  useEffect(
    function () {
      if (!isLoading && !isAuthenticated) navigate("/login");
    },
    [isLoading, isAuthenticated, navigate],
  );
  if (isLoading) return <FullscreenSpinner />;
  if (isAuthenticated) return children;
}

export default ProtectedRoute;
