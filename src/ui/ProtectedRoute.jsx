import { useUser } from "../features/authentication/useUser";
import { useNavigate } from "react-router";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useUser();
  const navigate = useNavigate();
  useEffect(
    function () {
      if (!isLoading && !isAuthenticated) navigate("/login");
    },
    [isLoading, isAuthenticated, navigate],
  );
  if (isLoading) return <div>Loading...</div>;
  if (isAuthenticated) return children;
}

export default ProtectedRoute;
