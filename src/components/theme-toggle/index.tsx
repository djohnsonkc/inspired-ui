import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/button"
import { useTheme } from "@/lib/theme"

/**
 * ThemeToggle — sun/moon button that toggles between light and dark.
 * Requires a <ThemeProvider> ancestor (from `inspired-ui`).
 */
export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const next = theme === "dark" ? "light" : "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
    >
      <Sun className="hidden size-4 dark:block" />
      <Moon className="size-4 dark:hidden" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
