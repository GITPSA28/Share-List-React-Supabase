import React from "react";
import { useTheme } from "../contexts/ThemeContext";

const allThemes = [
  "abyss",
  "acid",
  "aqua",
  "autumn",
  "black",
  "bumblebee",
  "business",
  "caramellatte",
  "cmyk",
  "coffee",
  "corporate",
  "cupcake",
  "cyberpunk",
  "dark",
  "dim",
  "dracula",
  "emerald",
  "fantasy",
  "forest",
  "garden",
  "halloween",
  "lemonade",
  "light",
  "lofi",
  "luxury",
  "night",
  "nord",
  "pastel",
  "retro",
  "silk",
  "sunset",
  "synthwave",
  "valentine",
  "winter",
  "wireframe",
];

export default function ThemeController({ themes = allThemes }) {
  const { theme, handleThemeChange } = useTheme();
  // console.log(theme, setTheme);
  const handleChange = (e) => {
    handleThemeChange(e.target.value);
  };
  return (
    <div className="dropdown dropdown-end p-0">
      <div tabIndex={0} role="button" className="btn">
        Theme
        <svg
          width="12px"
          height="12px"
          className="inline-block h-2 w-2 fill-current opacity-60"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </div>

      <ul className="dropdown-content menu bg-base-300 rounded-box z-1 w-52 shadow-2xl">
        {themes.map((th) => (
          <li key={th}>
            <input
              type="radio"
              name="theme-dropdown"
              className={`theme-controller ${theme === th ? "btn-primary" : "btn-ghost"} btn btn-sm btn-block justify-start`}
              aria-label={th.charAt(0).toUpperCase() + th.slice(1)}
              value={th}
              checked={theme === th}
              onChange={handleChange}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
