import React from "react";

export default function SearchBar({ value, onChange, ref = null }) {
  return (
    <label className="input join-item w-full">
      <svg
        className="h-[1em] opacity-50"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <g
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2.5"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </g>
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        ref={ref}
        type="search"
        className="grow text-base"
        placeholder="Search"
      />
      {/* <kbd className="kbd kbd-sm">⌘</kbd>
      <kbd className="kbd kbd-sm">K</kbd> */}
    </label>
  );
}
