import React from "react";
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";
import SideBar from "./SideBar";
import NavBar from "./NavBar";
import { useSession } from "../contexts/SessionContext";

export default function Drawer({ children }) {
  const { userProfile: user, isLoading } = useSession();
  if (isLoading) return <Spinner />;
  if (!isLoading && user)
    return (
      <div className="drawer bg-base-100 lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <NavBar user={user} />
          {children}
        </div>
        <div className="drawer-side z-40">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          {/* Sidebar content here */}
          <SideBar />
        </div>
      </div>
    );
}
