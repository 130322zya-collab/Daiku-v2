# CLAUDE.md — AI Assistant Guide for Daiku-v2

## Project Overview

**Daiku-v2** (大工現場管理) is a React-based construction site management web application. The project name "大工" means "carpenter/construction worker" in Japanese, and "現場管理" means "site management". This is a client-side-only application with no backend or build system.

## Repository Structure

```
Daiku-v2/
├── index.htm       # Main HTML entry point, loads React + Babel from CDN
├── app.jsx         # Main React application (to be created / primary source file)
└── README.md       # Minimal project README
```

> **Note**: `app.jsx` is referenced in `index.htm` but does not yet exist. Creating it is the primary development task.

## Technology Stack

| Component       | Technology                          | Source         |
|----------------|--------------------------------------|----------------|
| UI Framework   | React 18                             | CDN (unpkg)    |
| DOM Rendering  | ReactDOM 18                          | CDN (unpkg)    |
| JSX Transform  | Babel Standalone                     | CDN (unpkg)    |
| Language       | JavaScript with JSX                  | —              |
| Build System   | None (browser-side transpilation)    | —              |

**No package manager or build tooling is used.** All dependencies are loaded directly from `https://unpkg.com/` CDN at runtime. Babel transpiles JSX in the browser.

## Development Workflow

### Running the App

Since there is no build step, open `index.htm` directly in a browser, or serve it with any static file server:

```bash
# Using Python (recommended for local dev)
python3 -m http.server 8080

# Using Node.js (if available)
npx serve .

# Or simply open the file directly
open index.htm
```

Then navigate to `http://localhost:8080` (or open `index.htm` directly).

### Making Changes

1. Edit `app.jsx` (the main application file) — changes are picked up on browser refresh.
2. Edit `index.htm` for structural or dependency changes.
3. No compilation, bundling, or installation steps are needed.

### No Tests, Linter, or CI/CD

- There is currently no test framework, linter, formatter, or CI/CD pipeline.
- Do not add build scripts unless explicitly requested.

## Code Conventions

### File Naming
- HTML entry: `index.htm` (note: `.htm` not `.html`)
- React application: `app.jsx` (the primary source file)
- Keep files at the root level unless a component library grows large enough to warrant a `components/` subdirectory

### React Patterns
- React and ReactDOM are available as global `window.React` and `window.ReactDOM` (loaded via UMD CDN builds)
- Babel Standalone enables JSX syntax via `type="text/babel"` on script tags
- Write standard functional React components with hooks
- No TypeScript — plain JavaScript only (no `.ts` / `.tsx` files)

### Language / Locale
- UI text may be in Japanese (日本語) — the application is intended for Japanese-speaking construction site workers
- Variable and function names should be in English for maintainability

### HTML Conventions
- The `index.htm` file has known encoding artifacts (e.g., `‹` instead of `<` in some tags) — this is a display issue; do not reformat the file unless fixing actual syntax errors
- The root React mount point is `<div id="root"></div>`

## Key Facts for AI Assistants

- **No `npm install` or package management needed** — do not create `package.json` unless explicitly asked
- **No build step** — do not add webpack, Vite, or similar unless explicitly asked
- **The main work is in `app.jsx`** — if asked to add features, this is the file to edit (or create)
- **CDN URLs use React 18** — if adding libraries, prefer CDN script tags consistent with the existing pattern
- **Encoding note**: `index.htm` contains some unusual characters (`‹`, `«`) that appear to be OCR/encoding artifacts in the file as stored — treat them as `<` when reading intent, but do not silently rewrite the file
- **Japanese domain**: the app manages construction sites; domain terms include workers (職人), sites (現場), schedules (工程), and tasks (作業)

## Git Workflow

- Default branch: `master`
- Active development branch: `claude/add-claude-documentation-HRj4S`
- Commits are GPG-signed
- Remote: `http://local_proxy@127.0.0.1:32785/git/130322zya-collab/Daiku-v2`

When committing:
```bash
git add <files>
git commit -m "descriptive message"
git push -u origin <branch-name>
```

## Project Status

As of March 2026, this project is in early initialization:

- [x] HTML shell (`index.htm`) created
- [ ] `app.jsx` — main application not yet created
- [ ] No components, routing, state management, or data layer
- [ ] No styling (CSS framework or custom styles)
- [ ] No backend or API

The next logical step is creating `app.jsx` with the initial React component tree for the construction site management interface.
