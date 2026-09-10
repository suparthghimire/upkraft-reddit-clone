import Typography from "@/components/ui/typogrpahy";
import ThemeToggle from "./theme-toggle";

function PageSidebar() {
  return (
    <aside className="border-r w-62.5 flex flex-col justify-between p-6">
      <Typography variant="h4">Form</Typography>
      <ThemeToggle />
    </aside>
  );
}

export default PageSidebar;
