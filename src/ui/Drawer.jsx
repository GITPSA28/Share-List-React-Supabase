import React from "react";
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";
import SideBar from "./SideBar";
import NavBar from "./NavBar";

export default function Drawer({ children }) {
  const { user, isLoading } = useUser();
  if (isLoading) return <Spinner />;
  if (!isLoading && user)
    return (
      <div className="drawer bg-base-100 lg:drawer-open">
        <div className="drawer-content flex flex-col">
          <NavBar user={user} />
          {children}
        </div>
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
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
