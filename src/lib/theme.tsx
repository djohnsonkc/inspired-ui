import * as React from "react"

/**
 * Theme system — light/dark with system-preference default + localStorage persistence.
 *
 * Wrap your app in <ThemeProvider> and the active theme is reflected on
 * <html> via the `.dark` class (controlled by Tailwind's class-based dark
 * variant) and the `color-scheme` style.
 *
 * On first visit, the system preference (`prefers-color-scheme`) is used.
 * Once the user explicitly toggles, the choice is stored in localStorage
 * under `inspired_theme` and the provider stops following system changes.
 *
 * To prevent a flash of light theme on dark devices, add a tiny inline
 * script in <head> that reads the stored theme and applies the `.dark`
 * class BEFORE React mounts. See the README for the snippet.
 */

type Theme = "light" | "dark"

interface ThemeContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
  toggle: () => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = "inspired_theme"

function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null
  const v = window.localStorage.getItem(STORAGE_KEY)
  return v === "light" || v === "dark" ? v : null
}

function systemTheme(): Theme {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>(
    () => readStoredTheme() ?? systemTheme(),
  )
  const [hasUserPref, setHasUserPref] = React.useState(
    () => readStoredTheme() !== null,
  )

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    document.documentElement.style.colorScheme = theme
  }, [theme])

  React.useEffect(() => {
    if (hasUserPref) return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => setThemeState(mq.matches ? "dark" : "light")
    mq.addEventListener("change", onChange)
    return () => {
      mq.removeEventListener("change", onChange)
    }
  }, [hasUserPref])

  const setTheme = React.useCallback((t: Theme) => {
    window.localStorage.setItem(STORAGE_KEY, t)
    setHasUserPref(true)
    setThemeState(t)
  }, [])

  const toggle = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  const value = React.useMemo(
    () => ({ theme, setTheme, toggle }),
    [theme, setTheme, toggle],
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider")
  return ctx
}

export type { Theme }
