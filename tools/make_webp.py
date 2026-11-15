#!/usr/bin/env python3
"""Fizzly asset pipeline.

Raw generated PNGs land in assets-src/. This script mattes the white studio
background out of them, trims to the subject, scales to the size the brief asks
for and writes optimised WebP into assets/.

    python3 tools/make_webp.py can cherry
    python3 tools/make_webp.py splash grape
    python3 tools/make_webp.py fruit lemon          # all 4 pieces
    python3 tools/make_webp.py backdrop orange
    python3 tools/make_webp.py all

Sizing rules:
  can-*        1600 px tall
  splash-*     2400 px wide
  fruit-*       800 px long side
  backdrop-*   1920x1080, opaque
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets-src"
OUT = ROOT / "assets"

FLAVOURS = ["cherry", "lime", "orange", "grape", "lemon", "blue-razz"]


def matte(im: Image.Image, kind: str = "can") -> Image.Image:
    """Key out the near-white seamless backdrop of a studio product shot.

    Background = pixels within `BG_TH` of white that are reachable from the
    frame edge, so enclosed white label art (the logo, the fizz wave) and the
    highlights inside the silhouette survive. Soft grey studio shadow is close
    enough to white to get absorbed at this tolerance, and specular highlights
    on a glossy can stay well outside it (a looser key would bite a stripe out
    of the middle of the can). Leftover pale blobs are then dropped by keeping
    only the subject component(s), and the edge is eroded + feathered so it
    anti-aliases cleanly on any background.
    """
    BG_TH = 0.045

    rgb = np.asarray(im.convert("RGB")).astype(np.float32)
    dist = np.sqrt(((255.0 - rgb) ** 2).sum(axis=2)) / 441.673  # 0 = pure white

    lbl, _ = ndimage.label(dist < BG_TH)
    border = np.concatenate([lbl[0], lbl[-1], lbl[:, 0], lbl[:, -1]])
    bg = np.isin(lbl, np.unique(border[border > 0]))
    fg = ~bg

    fl, fn = ndimage.label(fg)
    if fn:
        sizes = ndimage.sum(fg, fl, range(1, fn + 1))
        if kind in ("can", "backdrop"):
            # A can is one solid object: keep the biggest blob (plus anything
            # substantial that it touches, e.g. a splash on the rim).
            keep = [1 + int(np.argmax(sizes))]
        else:
            # Fruit and splashes legitimately fly apart into loose droplets.
            keep = [i + 1 for i, sz in enumerate(sizes) if sz > 220]
        fg = np.isin(fl, keep)
        fg = ndimage.binary_fill_holes(fg)

    alpha = ndimage.minimum_filter(fg.astype(np.float32), size=3)   # 1 px erosion
    alpha = ndimage.gaussian_filter(alpha, 0.6)                     # feather
    alpha = np.clip((alpha - 0.15) / 0.7, 0, 1)

    # Colour decontamination: edge pixels take their colour from the nearest
    # fully opaque pixel, so no white studio fringe is left behind.
    edge = (alpha > 0.02) & (alpha < 0.98)
    if edge.any():
        _, (iy, ix) = ndimage.distance_transform_edt(alpha < 0.98, return_indices=True)
        near = rgb[iy, ix]
        w = alpha[..., None]
        rgb = np.where(edge[..., None], near * w + rgb * (1 - w), rgb)

    out = np.dstack([rgb, alpha * 255]).clip(0, 255).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def trim(im: Image.Image) -> Image.Image:
    bbox = im.getchannel("A").point(lambda v: 255 if v > 10 else 0).getbbox()
    return im.crop(bbox) if bbox else im


def fit(im: Image.Image, *, height=None, width=None, cap=2.6) -> Image.Image:
    w, h = im.size
    f = (height / h) if height else (width / w)
    f = min(f, cap)
    return im.resize((max(1, round(w * f)), max(1, round(h * f))), Image.LANCZOS)


def sharpen(im: Image.Image, pct=90) -> Image.Image:
    if im.mode == "RGBA":
        r, g, b, a = im.split()
        rgb = Image.merge("RGB", (r, g, b)).filter(
            ImageFilter.UnsharpMask(radius=2, percent=pct, threshold=3)
        )
        return Image.merge("RGBA", (*rgb.split(), a))
    return im.filter(ImageFilter.UnsharpMask(radius=2, percent=pct, threshold=3))


def save(im: Image.Image, path: Path, quality=90):
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "WEBP", quality=quality, method=6, alpha_quality=100)


def process(kind: str, job: str) -> bool:
    src = SRC / f"{job}.png"
    out = OUT / f"{job}.webp"
    if not src.exists():
        print(f"  · {job}: no source yet")
        return False

    im = Image.open(src)
    if kind == "backdrop":
        im = im.convert("RGB")
        w, h = im.size
        target = 16 / 9
        if w / h > target:
            nw = round(h * target)
            im = im.crop(((w - nw) // 2, 0, (w + nw) // 2, h))
        else:
            nh = round(w / target)
            im = im.crop((0, (h - nh) // 2, w, (h + nh) // 2))
        im = sharpen(im.resize((1920, 1080), Image.LANCZOS), 55)
        save(im, out, quality=88)
    else:
        im = trim(sharpen(matte(im, kind)))
        if kind == "can":
            im = fit(im, height=1600)
        elif kind == "splash":
            im = fit(im, width=2400)
        else:
            im = fit(im, height=800)
        pad = Image.new("RGBA", (im.width + 32, im.height + 32), (0, 0, 0, 0))
        pad.alpha_composite(im, (16, 16))
        im = pad
        save(im, out, quality=90)

    print(f"  ✓ {out.name}  {im.width}x{im.height}  {out.stat().st_size // 1024} KB")
    return True


def main(argv):
    argv = [a for a in argv if not a.startswith("--")]
    if not argv:
        print(__doc__)
        return
    jobs = []
    if argv[0] == "all":
        for f in FLAVOURS:
            jobs += [("backdrop", f"backdrop-{f}"), ("can", f"can-{f}"), ("splash", f"splash-{f}")]
            jobs += [("fruit", f"fruit-{f}-{n}") for n in (1, 2, 3, 4)]
    else:
        kind, flavour = argv[0], argv[1]
        if kind == "fruit":
            jobs = [("fruit", f"fruit-{flavour}-{n}") for n in (1, 2, 3, 4)]
        else:
            jobs = [(kind, f"{kind}-{flavour}")]

    done = sum(process(k, j) for k, j in jobs)
    print(f"{done}/{len(jobs)} written")


if __name__ == "__main__":
    main(sys.argv[1:])
