import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

type ThemeProviderProps = PropsWithChildren;
type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode() {},
});

function ThemeProvider(props: ThemeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  function toggleDarkMode() {
    localStorage.setItem(
      "theme",
      JSON.stringify(isDarkMode ? "light" : "dark"),
    );
    setIsDarkMode((prev) => !prev);
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const localStorageItem = localStorage.getItem("theme");
      if (!localStorageItem) return;

      const theme = JSON.parse(localStorageItem);
      const isDark = theme === "dark";
      setIsDarkMode(isDark);
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
}
export function useThemeContext() {
  const context = useContext(ThemeContext);

  if (!context)
    throw new Error("useThemeContext must be used within a ThemeProvider");

  return context;
}

export default ThemeProvider;
