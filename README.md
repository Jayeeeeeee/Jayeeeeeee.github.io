# Portfolio

A single-page portfolio. Plain HTML, CSS and JavaScript, no build step and no
dependencies.

## Structure

    index.html        markup and section order
    css/styles.css    all styling; design tokens live in :root
    js/data.js        YOUR CONTENT - the only file you edit regularly
    js/main.js        renders data.js into the page, plus nav/scroll behavior
    assets/           images and resume

## Notes

- Responsive down to 320px; the nav collapses to a menu under 720px.
- Respects `prefers-reduced-motion` — all animation is disabled for visitors
  who ask for that.
- Keyboard accessible: skip link, visible focus rings, Escape closes the menu.
- Prints cleanly to PDF (nav and buttons are hidden).
- Text from `data.js` is HTML-escaped before rendering, so apostrophes,
  ampersands and angle brackets in your content are safe.
