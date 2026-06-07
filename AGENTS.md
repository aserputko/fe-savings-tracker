# AGENTS

## Purpose
This repository is a Vite + React + TypeScript frontend for the Frontend Mentor savings tracker challenge.

## Quick Start
- Install dependencies: npm install
- Start dev server: npm run dev
- Lint: npm run lint
- Build (TypeScript project build + Vite build): npm run build
- Preview production build: npm run preview

## Post-Task Hook

**After completing every task or set of tasks, you MUST run the following commands in sequence from the `fe-savings-tracker/` directory. Do not report completion to the user until all commands pass.**

```bash
npm run lint      # auto-formats and fixes lint errors (--fix is built-in)
npm run test      # runs all unit tests
npm run build     # TypeScript type-check + Vite production build
```

- Run `npm run lint` first — it applies autoformatting in place before tests and build.
- If `npm run test` fails, fix the failures before proceeding to `npm run build`.
- If `npm run build` fails (TypeScript errors or Vite errors), fix them and re-run `npm run test` and `npm run build`.
- Only report task completion after all three commands exit with code 0.

## Agent Workflow
- Keep changes focused and minimal. Avoid broad refactors unless requested.
- After edits, run npm run lint. Run npm run build for changes that affect app behavior, types, or build config.
- Do not edit generated output in dist.

## Code Map
- Entry point: [src/main.tsx](src/main.tsx)
- Main UI component: [src/App.tsx](src/App.tsx)
- Global styles: [src/index.css](src/index.css)
- App styles: [src/App.css](src/App.css)
- Static assets: [src/assets](src/assets), [public](public)
- Tooling config: [vite.config.ts](vite.config.ts), [eslint.config.js](eslint.config.js), [tsconfig.app.json](tsconfig.app.json), [tsconfig.node.json](tsconfig.node.json)
- NPM scripts and dependencies: [package.json](package.json)

## Project Conventions
- Use function components and React hooks.
- Keep TypeScript and imports compatible with bundler mode and TS extension imports already used in this repo.
- Respect strict compiler/lint settings, especially noUnusedLocals and noUnusedParameters.
- Keep styling in CSS files colocated at app level unless asked to introduce a new styling approach.

## Known Pitfalls
- React Compiler is enabled through Babel in [vite.config.ts](vite.config.ts). Preserve this setup unless the user asks to change compiler behavior.
- TypeScript project build is part of npm run build, so type issues will fail builds even if dev server starts.

## Folder Structure

This project follows the **Feature-Based / Modular Structure**. Code is grouped by feature/domain. Pages are thin — they only compose pieces from `features/` and `shared/`.

```
src/
├── app/                          # App-wide setup
│   ├── App.tsx
│   ├── router.tsx                # Route definitions
│   └── providers/                # Theme, Auth, Query providers
│       └── AppProviders.tsx
│
├── pages/                        # Route-level components (thin, composition only)
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── DashboardPage.tsx
│   └── SavingsGoalDetailsPage.tsx
│
├── features/                     # Self-contained feature modules
│   ├── auth/
│   │   ├── components/           # LoginForm, SignupForm
│   │   ├── hooks/                # useLogin, useSignup
│   │   ├── api/                  # authApi.ts
│   │   ├── types.ts
│   │   └── index.ts              # Public barrel export
│   │
│   ├── dashboard/
│   │   ├── components/           # SavingsGoalList, SavingsGoalCard, TotalSavedWidget
│   │   ├── hooks/                # useSavingsGoals
│   │   ├── api/                  # dashboardApi.ts
│   │   └── index.ts
│   │
│   └── savings-goal/
│       ├── components/           # SavingsGoalHeader, DepositList, DepositForm, ProgressBar
│       ├── hooks/                # useSavingsGoal, useAddDeposit
│       ├── api/                  # savingsGoalApi.ts
│       ├── types.ts
│       └── index.ts
│
├── shared/                       # Reusable across features
│   ├── components/
│   │   ├── ui/                   # shadcn/ui primitives
│   │   └── layout/               # AppShell, ProtectedRoute
│   ├── hooks/
│   ├── lib/
│   │   ├── apiClient.ts          # axios/fetch wrapper
│   │   └── utils.ts
│   └── types/
│       └── common.ts
│
├── assets/
├── index.css
└── main.tsx
```

### Conventions
- **Barrel exports** — each `features/<name>/index.ts` exports only its public API.
- **No cross-feature imports** — features must not import from each other; lift shared code to `shared/`.
- **`pages/` stays thin** — only layout composition, no business logic.
- Use the `@/` path alias (configured in `vite.config.ts` and `tsconfig.app.json`) for all imports.

## Reference
- Base project template notes: [README.md](README.md)
