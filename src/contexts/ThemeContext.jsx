import { createContext, useContext, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useUpdateUserProfile } from "../features/username/useUpdateUserProfile";

const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage("dark", "user-theme");
  const { isUpdating, updateUserProfileData } = useUpdateUserProfile();
  // console.log(theme, setTheme);
  function handleThemeChange(value) {
    setTheme(value);
    updateUserProfileData({ theme: value });
  }
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return (
    <ThemeContext value={{ theme, handleThemeChange, isUpdating }}>
      {children}
    </ThemeContext>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw Error("Theme context used outside provider");
  return context;
}

export { ThemeProvider, useTheme };
