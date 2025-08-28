import React from "react";
import NavBar from "./NavBar";
import { Outlet } from "react-router";

export default function () {
  return (
    <div>
      <NavBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
