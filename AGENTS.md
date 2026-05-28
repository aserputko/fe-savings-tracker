# AGENTS

## Purpose
This repository is a Vite + React + TypeScript frontend for the Frontend Mentor savings tracker challenge.

## Quick Start
- Install dependencies: npm install
- Start dev server: npm run dev
- Lint: npm run lint
- Build (TypeScript project build + Vite build): npm run build
- Preview production build: npm run preview

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

## Reference
- Base project template notes: [README.md](README.md)
