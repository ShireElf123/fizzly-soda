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
