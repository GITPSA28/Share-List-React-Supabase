import React from "react";
import { useLogout } from "./useLogout";
import Spinner from "../../ui/Spinner";

export default function Logout() {
  const { logout, isLoading } = useLogout();
  function handleLogout() {
    logout();
  }
  return (
    <button
      className="btn btn-primary"
      disabled={isLoading}
      onClick={handleLogout}
    >
      {isLoading ? <Spinner /> : "Logout"}
    </button>
  );
}
