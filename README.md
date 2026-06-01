# inspired-ui

Design tokens + React component library powering [inspiredeffect.com](https://inspiredeffect.com). Built on [shadcn/ui](https://ui.shadcn.com) primitives with a custom violet/engineered palette.

This repo is the *standalone reference* for the design system. The portfolio site (private) consumes it as a versioned tarball.

---

## What's inside

```
src/
├── lib/
│   ├── utils.ts           cn() helper (clsx + tailwind-merge)
│   └── theme.tsx          ThemeProvider + useTheme (light/dark, system-aware, persisted)
├── components/
│   ├── button/            shadcn Button, customized — rounded-full pill, beefier padding
│   ├── chip/              Mono-uppercase pill with optional foundation variant (green dot)
│   ├── card-glow/         Atmospheric violet glow primitive for cards
│   ├── theme-toggle/      Sun/Moon icon button using the theme system
│   └── live-in-production-card/  Rich card pattern: tags, summary, tech chips, glow, URL
├── styles/
│   └── inspired-tokens.css Tokens entry — palette + Tailwind v4 @theme bridge + base layer
└── index.ts               Public API
```

## Design decisions

### Stack

| Choice | Why |
| --- | --- |
| **Vite library mode** | Fast builds, auto-discovered per-component entry points for tree-shaking. |
| **vite-plugin-dts** | Generates `.d.ts` declarations alongside the JS bundle. |
| **Tailwind v4** | CSS-first config (`@theme`), `oklch()` color tokens, no JS config file. |
| **shadcn/ui primitives** | Code lives in the consumer (copy-paste, customize freely) — but the tokens + a small set of opinionated components ship here. |
| **Radix UI under the hood** | Accessible primitives (Slot is used by Button for `asChild`). |
| **Tarball distribution, not npm** | No publish flow, no PATs. The consuming app vendors a versioned `.tgz` and installs via `file:` reference. See [Build & pack](#build--pack). |

### Theming model

- A single `data-palette` attribute on `<html>` selects the active palette.
- The default palette is **engineered-violet** — cool neutral foundation, violet accent.
- Adding a new palette is a copy-paste of one block in [`src/styles/inspired-tokens.css`](src/styles/inspired-tokens.css).
- Light vs dark mode is the `.dark` class on `<html>`, controlled by `ThemeProvider` from this library.

### Theme persistence

- First visit: follows `prefers-color-scheme`.
- After the user toggles: choice stored in `localStorage` under `inspired_theme`.
- Reverts to system-following only if the storage key is cleared.

### Why pill-rounded buttons

The default shadcn Button uses `rounded-md` which reads as "enterprise admin tool." The inspired-ui Button uses `rounded-full` for a modern product-site feel — same accessibility, different identity.

---

## Build & pack

The library ships as a versioned tarball that consumers install via `file:` references — no npm publish, no auth tokens.

### One-time setup

```bash
npm install
```

### Build the library

```bash
npm run build
# Runs:
#   build:types  → tsc emits .d.ts to dist/
#   build:lib    → vite builds JS bundles to dist/
#   build:css    → vite builds inspired-tokens.css to dist/
```

### Pack the tarball

```bash
npm run pack:dev
```

This:

1. Reads `package.json`, temporarily bumps `version` to `<base>-build.<YYYYMMDD-HHmmss>` so each pack is unique.
2. Runs `npm pack`, producing `inspired-ui-<version>.tgz`.
3. Also copies the result to `inspired-ui-latest.tgz` so consumers can always point at one stable path.
4. Restores the original `package.json` version on exit.

**Why the version bump?** `npm install ./some.tgz` keys cache and lockfile by package name + version. Two tarballs with the same version are treated as identical even if their contents differ — leading to "I rebuilt but consumers don't see changes" silent failures. The timestamp-bumped version forces npm to treat each pack as a new release.

### Consuming in another project

1. Copy `inspired-ui-latest.tgz` into the consumer (e.g. `consumer/vendor/inspired-ui-latest.tgz`).
2. In the consumer's `package.json`:
   ```json
   "dependencies": {
     "inspired-ui": "file:./vendor/inspired-ui-latest.tgz"
   }
   ```
3. Install:
   ```bash
   npm install
   ```
4. Import the tokens once in your global CSS:
   ```css
   @import "tailwindcss";
   @import "inspired-ui/tokens";
   ```
5. Set the active palette on `<html>` in your `index.html`:
   ```html
   <html lang="en" data-palette="engineered-violet">
   ```
6. Wrap your app in `<ThemeProvider>` and use components:
   ```tsx
   import { ThemeProvider, Button, ThemeToggle } from "inspired-ui"

   <ThemeProvider>
     <Button>Hello</Button>
     <ThemeToggle />
   </ThemeProvider>
   ```

---

## Avoiding the dark-mode flash

Because React mounts after the page parses, dark-mode users see a flash of light theme on first load. Prevent it with a tiny inline script in `<head>`, *before* the main bundle:

```html
<script>
  (function () {
    try {
      var stored = localStorage.getItem("inspired_theme");
      var dark =
        stored === "dark" ||
        (stored === null &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      if (dark) document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
    } catch (e) {}
  })();
</script>
```

---

## License

MIT — see [LICENSE](LICENSE).
