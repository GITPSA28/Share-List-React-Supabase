import React from "react";
import Drawer from "./Drawer";
import { Outlet } from "react-router";
import { useTheme } from "../contexts/ThemeContext";

export default function () {
  const { theme } = useTheme();
  return (
    <div data-theme={theme}>
      <Drawer>
        <main className="bg-base-100 px-2 pb-16 sm:px-6 xl:pe-2">
          <Outlet />
        </main>
      </Drawer>
    </div>
  );
}
