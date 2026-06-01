#!/usr/bin/env node
/**
 * pack.cjs — package the library as a versioned, timestamp-suffixed tarball.
 *
 *   - Reads package.json, temporarily bumps `version` to
 *     `<base>-build.<YYYYMMDD-HHmmss>` for the duration of `npm pack`.
 *   - Restores the original version afterward (always — even on failure).
 *   - Also copies the produced tarball to a stable
 *     `inspired-ui-latest.tgz` so consumers can point at one path.
 *
 * Why bump the version: `npm install ./some.tgz` keys cache and lockfile
 * by package name + version. Two tarballs with identical version strings
 * are treated as the same package even if their contents differ — leading
 * to "I rebuilt but consumers don't see changes" surprises. A unique
 * timestamp version forces npm to treat each pack as a new release.
 */
const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

const root = path.resolve(__dirname, "..")
const pkgPath = path.join(root, "package.json")
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"))
const originalVersion = pkg.version

const now = new Date()
const pad = (n) => String(n).padStart(2, "0")
const stamp =
  `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}` +
  `-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`

const buildVersion = `${originalVersion}-build.${stamp}`
const safeName = pkg.name.replace("@", "").replace("/", "-")
const tarballName = `${safeName}-${buildVersion}.tgz`
const latestName = `${safeName}-latest.tgz`

console.log(`\n→ Packing as ${buildVersion}\n`)

try {
  pkg.version = buildVersion
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n")

  execSync("npm pack", { stdio: "inherit", cwd: root })

  const tarballPath = path.join(root, tarballName)
  const latestPath = path.join(root, latestName)
  if (!fs.existsSync(tarballPath)) {
    throw new Error(`Expected tarball not found: ${tarballName}`)
  }
  fs.copyFileSync(tarballPath, latestPath)

  console.log(`\n✓ Built:   ${tarballName}`)
  console.log(`✓ Aliased: ${latestName}\n`)
} finally {
  pkg.version = originalVersion
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n")
}
