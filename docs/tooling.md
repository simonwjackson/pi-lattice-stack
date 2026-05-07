# Tooling

Build tools, formatters, runners, harness posture, and verification commands.

## Formatting

Use **Biome** consistently.

- 2-space indentation.
- Semicolons only as needed.
- Double quotes.
- No trailing whitespace.
- Keep files small and purpose-specific.
- Run `just format` to format; `just lint` to check.

## TypeScript

- Strict mode required.
- Avoid `any`.
- Explicit types at module boundaries.
- Choose clear names over clever abstractions.

## Codebase intelligence

Use **Fallow** for TypeScript / JavaScript codebase intelligence: dead code, duplication, complexity hotspots, circular dependencies, and architecture boundary drift.

First run, from the project root:

```bash
bun x fallow
```

Focused commands:

```bash
bun x fallow dead-code          # unused files, exports, deps, cycles, boundaries
bun x fallow dupes              # repeated logic; add --mode semantic for renamed clones
bun x fallow health             # complexity, maintainability, and refactor targets
bun x fallow fix --dry-run      # preview automatic cleanup before applying
```

Agent and CI usage prefer structured output:

```bash
bun x fallow --format json
bun x fallow dead-code --format json
bun x fallow fix --dry-run --format json
```

Use `fallow init` when the repo needs explicit policy. It creates a tailored config and adds `.fallow/` to `.gitignore`; keep committed baselines outside `.fallow/`, for example under `fallow-baselines/`.

### Architecture boundaries

Encode the stack's layer rules in Fallow boundaries when the project has a stable shape.

- Product layers may import shared layers.
- Shared layers are isolated from product imports.
- Generated code should be ignored or modeled explicitly, not treated as ordinary source.
- Run `fallow list --boundaries` after changing boundary config to verify zones match real files.

For alias-shaped projects (`@app/*`, `@shared/*`), model the same rule in zones: app/product zones may import shared zones; shared zones have an empty `allow` list or otherwise cannot import app/product zones.

### PR-time audits

Use `fallow audit` as the changed-file quality gate once the repo has a reasonable baseline:

```bash
fallow audit
fallow audit --base main --format json --quiet
```

`audit` returns `pass`, `warn`, or `fail`; it defaults to `new-only`, so inherited findings in touched files are context while newly introduced issues fail the gate. For existing repos, clean or baseline full-repo output (`fallow`, `fallow dead-code`, `fallow dupes`, `fallow health`) before making `audit` required in CI.

## Test runner

- Unit tests run with `bun test` (`just test-unit`).
- E2E and visual tests run with Playwright (`just test-e2e`, `just test-component`).

## Visual harness

Components and pages render in **Storybook** with only fixture data and configured behavior.

- No network calls in stories.
- No `vi.mock`, no MSW, no `globalThis.fetch` swap.
- A component that requires a backend to appear in Storybook has a layering bug — fix the component, not the harness.
- The harness seam is the same Provider / Layer / atom-source override used in tests (a `layerAtom` swap).

## Real-implementation conventions

- Test and harness doubles are real implementations with a `behavior` or `config` argument:

  ```ts
  createInMemoryLauncher({ kind: "fail", exitCode: 1 })
  ```

- Configurable knobs: outcome, delay, error type, seed data.
- Doubles live alongside the real implementations they share an interface with — not in a `__mocks__` or `fakes/` folder.
- `Mock*` / `Stub*` / `Fake*` prefixes are forbidden, even in tests.

## Cross-cutting rules

- Sensitive data is never stored in `localStorage`; non-sensitive local preferences such as feature-gate ids may use it when documented at the storage seam.
- When extracting parts from ISO date strings, use UTC methods (`getUTC*`). Local-time methods produce locale-dependent results and silent bugs.
- Use `@shared/logger`, not `console.log`, in runtime code.

## Verification

- TypeScript typechecking is whole-repo only because of path aliases — run `just typecheck`, not per-file `tsc`.
- Run `just typecheck`, `just test-unit`, `just lint`, and `just format` before considering a change complete.
- Run `fallow audit` (or the project's Fallow wrapper, e.g. `just fallow-audit`) before merging code changes when Fallow is configured.
- Run E2E or visual tests when the change touches user-facing behavior.

## Comments

- Comment the why, not the obvious what.
- Keep comments current or delete them.
- Doc comments are sparing and must add real value beyond what the signature already says.
