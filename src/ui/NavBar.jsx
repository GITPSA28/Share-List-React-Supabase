import React from "react";
import LogoIcon from "./LogoIcon";
import { Link } from "react-router";
import ThemeController from "./ThemeController";
import NotificationBadge from "./NotificationBadge";
// import SearchBar from "./SearchBar";

export default function NavBar({ user }) {
  return (
    <div className="bg-base-100/90 text-base-content sticky top-0 z-30 flex h-16 w-full [transform:translate3d(0,0,0)] justify-center shadow-xs backdrop-blur transition-shadow duration-100 print:hidden">
      <div className="navbar">
        <div className="flex flex-1 items-center justify-start gap-1">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-ghost drawer-button btn-sm sm:btn-md lg:hidden"
          >
            <svg
              width="20"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current md:h-6 md:w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
          <LogoIcon className="fill-base-content h-6 w-6 sm:h-9 sm:w-9 lg:hidden" />
          <Link to="/home" className="text-lg font-bold sm:text-2xl lg:hidden">
            Share List
          </Link>
          {/* <div className="hidden lg:block">
              <SearchBar />
            </div> */}
        </div>

        <div className="flex gap-1 sm:gap-2">
          <Link
            to="/search"
            className="btn btn-sm sm:btn-md btn-ghost btn-circle"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />{" "}
            </svg>
          </Link>

          <Link
            to={"/notifications"}
            className="btn-sm sm:btn-md btn btn-ghost btn-circle"
          >
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />{" "}
              </svg>
              <NotificationBadge />
            </div>
          </Link>
          <div className="dropdown dropdown-end ml-2">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-sm sm:btn-md btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  referrerPolicy="no-referrer"
                  alt="Profile Pictures"
                  src={user?.avatar_url}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link
                  to={`/profile/${user.username}`}
                  className="justify-between"
                >
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Link to={"/settings"}>Settings</Link>
              </li>
              <div className="flex justify-center pt-2">
                <ThemeController />
              </div>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
