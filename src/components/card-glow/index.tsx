import { cn } from "@/lib/utils"

interface CardGlowProps {
  /** Override the default placement / blur if you want a different ambient effect. */
  className?: string
}

/**
 * CardGlow — atmospheric violet glow primitive for cards.
 *
 * Drop into any `relative overflow-hidden` card as the first child. Pair with
 * `group` on the parent so the glow intensifies on hover (via
 * `group-hover:opacity-80`).
 *
 *   <a className="group relative overflow-hidden rounded-2xl border bg-card p-7 ...">
 *     <CardGlow />
 *     ... card content (each with `relative` so it sits above the glow) ...
 *   </a>
 *
 * The default places a soft violet blur in the top-right corner. Override
 * `className` to reposition or change opacity/color.
 */
export function CardGlow({ className }: CardGlowProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-primary/10 blur-3xl transition-opacity group-hover:opacity-80",
        className,
      )}
    />
  )
}
