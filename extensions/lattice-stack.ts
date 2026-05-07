import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent"

const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const DOCS_DIR = resolve(PACKAGE_ROOT, "docs")

const DOCS = [
  { heading: "Effect Runtime", file: "runtime.md" },
  { heading: "React UI Patterns", file: "ui.md" },
  { heading: "Visual Design", file: "visual.md" },
  { heading: "Code Layout", file: "layout.md" },
  { heading: "Tooling", file: "tooling.md" },
] as const

const HEADER =
  "[LATTICE STACK]\n\n" +
  "Conventions for projects that use the lattice stack: TypeScript + React + Effect + Tailwind + Vite + Biome + Bun + Fallow. " +
  "Apply when the current project actually uses these tools; otherwise treat as reference. " +
  "These conventions extend the bedrock principles with stack-specific bindings."

function loadContext(): string {
  const sections = DOCS.map(doc => {
    const path = resolve(DOCS_DIR, doc.file)
    const content = readFileSync(path, "utf8").trimEnd()
    return `\n\n## ${doc.heading}\n\n${content}`
  }).join("")
  return `${HEADER}${sections}\n`
}

const CUSTOM_TYPE = "lattice-stack:context"

let cached: string | undefined

export default function latticeStackExtension(pi: ExtensionAPI) {
  pi.on("session_start", async (_event, ctx) => {
    // Inject at session creation so the docs sit at the top of history,
    // before any user turn. Skip if our marker is already in history
    // (covers resume / reload / fork where it was injected previously).
    const entries = ctx.sessionManager.getEntries() as Array<{ customType?: string }>
    if (entries.some(e => e.customType === CUSTOM_TYPE)) return

    if (!cached) {
      cached = loadContext()
    }
    pi.sendMessage(
      {
        customType: CUSTOM_TYPE,
        content: cached,
        display: false,
      },
      { triggerTurn: false },
    )
  })
}
