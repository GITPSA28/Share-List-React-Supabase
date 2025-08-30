import React from "react";
import NavBar from "./NavBar";
import { Outlet } from "react-router";
import { useTheme } from "../contexts/ThemeContext";

export default function () {
  const { theme } = useTheme();
  return (
    <div data-theme={theme}>
      <NavBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
