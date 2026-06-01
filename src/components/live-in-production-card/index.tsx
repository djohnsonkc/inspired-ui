import { ArrowUpRight } from "lucide-react"

import { CardGlow } from "@/components/card-glow"
import { Chip } from "@/components/chip"

export interface LiveItem {
  name: string
  summary: string
  url: string
  /** Eyebrow tags rendered as a `·`-joined mono-uppercase row. */
  tags: string[]
  /** Tech chips rendered below the summary. */
  tech: string[]
  /** Optional "built on X" pill — emphasizes a foundational dependency. */
  builtOn?: string
}

interface LiveInProductionCardProps {
  item: LiveItem
  /** Drop tech chips + "Built on" pill for a normalized look beside other tiles. */
  compact?: boolean
}

/**
 * LiveInProductionCard — rich card for "things that ship and you can use".
 *
 * Pattern: eyebrow tags + arrow icon, name, summary, tech chip row, optional
 * "Built on X" foundation pill, URL footer. The whole card is one big
 * external anchor with a subtle violet glow that brightens on hover.
 *
 * Use `compact` when the card sits next to lighter case-study tiles — it
 * drops the tech chips and Built-on pill so visual density matches.
 *
 * Foundation chips (Rosnet UI, Prototype Studio, Inspired UI) are auto-highlighted
 * with a green dot — extend the FOUNDATION_TECH set below to add more.
 */

const FOUNDATION_TECH = new Set(["Rosnet UI", "Prototype Studio", "Inspired UI"])

export function LiveInProductionCard({
  item,
  compact = false,
}: LiveInProductionCardProps) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card p-7 transition-colors hover:border-primary/40 hover:bg-accent/40"
    >
      <CardGlow />
      <div className="relative flex items-start justify-between">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {item.tags.join(" · ")}
        </p>
        <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
      <h3 className="relative mt-4 text-xl font-medium tracking-tight">
        {item.name}
      </h3>
      <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
        {item.summary}
      </p>
      {!compact && (
        <div className="relative mt-4 flex flex-wrap gap-1.5">
          {item.tech.map((t) => (
            <Chip
              key={t}
              variant={FOUNDATION_TECH.has(t) ? "foundation" : "default"}
            >
              {t}
            </Chip>
          ))}
        </div>
      )}
      {!compact && item.builtOn && (
        <p className="relative mt-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-secondary/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span className="size-1 rounded-full bg-primary" />
            Built on {item.builtOn}
          </span>
        </p>
      )}
      <p className="relative mt-auto pt-6 font-mono text-xs text-muted-foreground">
        {item.url.replace(/^https?:\/\//, "")}
      </p>
    </a>
  )
}
