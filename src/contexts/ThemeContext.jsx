import { createContext, useContext, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage("dark", "user-theme");
  // console.log(theme, setTheme);
  function handleThemeChange(value) {
    setTheme(value);
  }
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return (
    <ThemeContext value={{ theme, handleThemeChange }}>{children}</ThemeContext>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw Error("Theme context used outside provider");
  return context;
}

export { ThemeProvider, useTheme };
