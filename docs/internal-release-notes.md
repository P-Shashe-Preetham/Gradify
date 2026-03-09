# Gradify v1 Web Internal Release Notes

## Build

- Version: `v1.0.0`
- Type: static web app
- Entry point: `index.html`

## Delivered MVP Scope

- Dashboard with primary `Start Learning` CTA
- Reel-style vertical feed with viewport snap behavior
- Concept micro-content card (title + explanation)
- In-memory like toggle interaction per reel
- Lightweight tap feedback animation
- Loading, empty, and error state handling with retry/back actions
- Unit tests for repository ordering and toggle behavior

## Test Notes

- Run: `npm test`
- Manual QA checklist: [qa-checklist.md](./qa-checklist.md)

## Debug Hooks

- `?mode=normal|loading|empty|error`
- `?debug=1` enables mode switch panel on feed

