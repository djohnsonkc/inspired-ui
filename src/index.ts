/**
 * inspired-ui
 *
 * Design tokens + React component library powering inspiredeffect.com.
 * Built on shadcn/ui primitives with a custom violet/engineered palette.
 *
 * Pair with `import "inspired-ui/tokens"` in your global CSS to get the
 * full token system and Tailwind v4 theme bridge.
 */

// Utilities
export { cn } from "./lib/utils"

// Theme system
export { ThemeProvider, useTheme } from "./lib/theme"
export type { Theme } from "./lib/theme"

// Primitives
export { Button, buttonVariants } from "./components/button"
export type { ButtonProps } from "./components/button"

export { Chip } from "./components/chip"
export type { ChipProps } from "./components/chip"

export { CardGlow } from "./components/card-glow"

export { ThemeToggle } from "./components/theme-toggle"

// Composite components
export { LiveInProductionCard } from "./components/live-in-production-card"
export type { LiveItem } from "./components/live-in-production-card"
