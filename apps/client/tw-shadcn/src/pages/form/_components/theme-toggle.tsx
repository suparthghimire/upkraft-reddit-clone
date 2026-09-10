import { Switch } from "@/components/ui/switch";
import { useThemeContext } from "../_providers/theme.provider";

function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useThemeContext();
  return (
    <div className="flex items-center gap-2">
      <p>☀️</p>
      <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
      <p>🌙</p>
    </div>
  );
}

export default ThemeToggle;
