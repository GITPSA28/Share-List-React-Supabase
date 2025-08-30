import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage("dark", "user-theme");
  console.log(theme, setTheme);
  function handleThemeChange(value) {
    setTheme(value);
  }
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
