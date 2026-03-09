# Gradify v1 Web App

Gradify is a reel-style micro-learning web MVP for fast academic revision.

## Implemented MVP features

- Dashboard entry screen with `Start Learning` CTA
- Dashboard -> feed navigation with browser-back return behavior
- Vertical reel feed with one-screen snap (`scroll-snap`)
- Reel cards containing concept title, explanation, and interaction target
- Deterministic local data repository with future remote placeholder
- UI states: loading, empty, error, retry
- Tap interaction: instant in-memory like toggle + lightweight animation
- Unit tests for critical data and interaction paths

## Project structure

- `index.html` - app shell and state containers
- `styles/main.css` - theme tokens and responsive UI styles
- `src/app.js` - application orchestration and screen state
- `src/data/*` - concept schema and repository/data sources
- `src/ui/*` - dashboard/feed view and route utilities
- `tests/*` - node test suite
- `docs/qa-checklist.md` - manual QA checklist
- `docs/internal-release-notes.md` - internal release handoff notes

## Run

Open `index.html` in a browser or serve with any static server.

## Test

```bash
npm test
```

## Debug state hooks

- `?mode=normal`
- `?mode=loading`
- `?mode=empty`
- `?mode=error`
- `?debug=1` shows feed debug mode buttons

