# Gradify v1 Web QA Checklist

## Functional

- [ ] App opens on dashboard screen.
- [ ] `Start Learning` opens feed in one click.
- [ ] Browser back from feed returns to dashboard.
- [ ] Feed scroll is vertical and snaps one reel per viewport.
- [ ] Each reel shows subject, difficulty, title, and explanation.
- [ ] Like button toggles on repeated taps without delay.
- [ ] Like animation plays and does not interrupt scrolling.

## States

- [ ] `?mode=normal` loads content.
- [ ] `?mode=loading` shows loading state continuously.
- [ ] `?mode=empty` shows empty state with back action.
- [ ] `?mode=error` shows error state with retry + back actions.
- [ ] App does not crash in any forced state.

## Responsiveness

- [ ] Dashboard is readable on 360x800 viewport.
- [ ] Reel card remains stable on common mobile widths (360-430px).
- [ ] Desktop layout remains centered and readable (>=1280px).

## Performance and Stability

- [ ] Reels scroll smoothly on representative mobile device/browser.
- [ ] No console errors during dashboard -> feed -> back flow.
- [ ] No fatal rendering break after rapid like toggles.

