# fizzly-soda

Single-file landing page for **Fizzly** (placeholder soda brand) — `index.html`.

## Photo assets

All imagery lives in `assets/` as transparent WebP, shot/rendered to one consistent
studio look (top-left key light, glossy, same camera angle):

| Pattern | Size | Used for |
| --- | --- | --- |
| `can-<flavour>.webp` | 1600 px tall | hero can, flavour cards, cart thumbnails, promo, scroll explorer |
| `splash-<flavour>.webp` | 2400 px wide | fizz crown behind the hero can and in the promo block |
| `fruit-<flavour>-1..4.webp` | 800 px | floating fruit, how-we-fizz steps, explorer halo |
| `backdrop-<flavour>.webp` | 1920x1080 | pinned flavour explorer background |

Flavours: `cherry`, `lime`, `orange`, `grape`, `lemon`, `blue-razz`
(Blue Razz is keyed as `berry` inside the site's `F` array).

`ASSETS` in `index.html` maps those files to the flavour keys, and every image is
wrapped in an `onerror` fallback that drops back to the original drawn SVG, so a
missing file degrades gracefully instead of breaking a layout or an animation.

### Regenerating

Raw renders go in `assets-src/<same-name>.png`; then:

```bash
python3 tools/make_webp.py all            # or: can cherry / splash grape / fruit lemon / backdrop lime
```

The script mattes the white studio backdrop to an alpha channel (keeps enclosed
white label art like the logo and fizz wave), trims, scales to the sizes above and
writes optimised WebP.

## Stack

No build step. Google Fonts + GSAP 3.12.5 from CDN. Deployed on Vercel as a static site.

## Cart, checkout and signup

All client-side, no backend, and honest about it:

- **Cart** persists in `localStorage` under `fizzly.cart`, survives reloads, has per-line
  quantity steppers, a remove button, an empty state, and adds an **Undo** action to the toast.
- **Checkout** is a two-step flow inside the drawer: summary with free-delivery progress,
  then an order-confirmation panel with a generated reference (`FZ-XXXXXX`). No payment is
  taken — a real build would hand off to Paystack or Yoco at that point.
- **Footer signup** validates the address, stores it under `fizzly.mail`, and switches to a
  "Joined" state. Nothing is emailed; the copy says so.
- The drawer traps Tab focus, moves focus to the close button on open and restores it on close.

## Site chrome

- Inline SVG favicon, `assets/icon-180.png` / `icon-512.png`, and `manifest.webmanifest`
  so the page can be added to a phone home screen.
- `404.html` — branded fallback for Vercel.
- Reading-progress bar (`#prg`) and a document title that carries the cart count.
- JSON-LD `Organization` + `ItemList` of the six products.

## Flavour shelf layout

The "Pick your flavour" section is a grid, not a carousel: 3-up on desktop, 2-up under
900px, and a compact list row on phones under 560px (see the media queries near the top of
`index.html`). Tapping a card's can opens that flavour in the detail explorer.
