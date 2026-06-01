import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind class names safely, with later classes overriding earlier ones.
 * Combines clsx (conditional class logic) with tailwind-merge (variant-aware deduping).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
