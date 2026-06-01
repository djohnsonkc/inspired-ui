import * as React from "react"

import { cn } from "@/lib/utils"

interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * `foundation` chips are visually highlighted with a small green dot — used
   * to call out foundational systems a project is built on (e.g. a design
   * system that powers the project).
   */
  variant?: "default" | "foundation"
}

/**
 * Chip — small mono-uppercase pill used across the system for tech tags,
 * credentials, education entries, and any other compact metadata row.
 *
 *   <Chip>React</Chip>
 *   <Chip>TypeScript</Chip>
 *   <Chip variant="foundation">Inspired UI</Chip>
 */
export function Chip({
  variant = "default",
  className,
  children,
  ...props
}: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border bg-secondary/30 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground",
        className,
      )}
      {...props}
    >
      {variant === "foundation" && (
        <span className="size-1 rounded-full bg-green-500" />
      )}
      {children}
    </span>
  )
}

export type { ChipProps }
