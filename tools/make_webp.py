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
    # Measure the actual backdrop instead of assuming pure 255 white: renders
    # come back with a faint grey/cream cast that would otherwise survive the key.
    edge = np.concatenate([
        rgb[:3].reshape(-1, 3), rgb[-3:].reshape(-1, 3),
        rgb[:, :3].reshape(-1, 3), rgb[:, -3:].reshape(-1, 3),
    ])
    bgc = np.median(edge, axis=0)
    dist = np.sqrt(((bgc - rgb) ** 2).sum(axis=2)) / 441.673  # 0 = backdrop colour

    if kind == "fruit":
        # Produce shots are lit on a white sweep, so the backdrop reads as
        # "neutral and bright" rather than one exact colour. Coloured flesh,
        # rind and juice stay saturated; enclosed pale areas (pith, highlights,
        # the gap between two cherries) are kept because they are not reachable
        # from the frame edge.
        mx = rgb.max(axis=2)
        mn = rgb.min(axis=2)
        sat = (mx - mn) / np.maximum(mx, 1.0)
        bgcand = ((sat < 0.12) & (mx > 183)) | (dist < 0.04)
    else:
        bgcand = dist < BG_TH

    lbl, _ = ndimage.label(bgcand)
    border = np.concatenate([lbl[0], lbl[-1], lbl[:, 0], lbl[:, -1]])
    bg = np.isin(lbl, np.unique(border[border > 0]))
    fg = ~bg

    fl, fn = ndimage.label(fg)
    if fn:
        sizes = ndimage.sum(fg, fl, range(1, fn + 1))
        biggest = float(sizes.max())
        keep = []
        for i, sl in enumerate(ndimage.find_objects(fl), start=1):
            if sl is None:
                continue
            area = float(sizes[i - 1])
            comp = fl[sl] == i
            pale = float(dist[sl][comp].mean())          # near-white sliver?
            if kind in ("can", "backdrop"):
                # A can is one solid object: keep the biggest blob only.
                if area == biggest:
                    keep.append(i)
            elif area > 220 and not (pale < 0.12 and area < 0.02 * biggest):
                # Fruit and splashes legitimately fly apart into droplets, but
                # pale little slivers are studio shadow/reflection leftovers.
                keep.append(i)
        fg = np.isin(fl, keep)
        fg = ndimage.binary_fill_holes(fg)

    # Kill the pale contact shadow / mirror strip that collects under a
    # product sitting on a studio floor.
    if kind == "fruit":
        # Pale floor reflection clings under a piece and would read as a grey
        # smear on a dark page. Per column, cut everything below the last pixel
        # that is clearly the fruit itself (saturated flesh or a dark shadowed
        # edge); pith and highlights sit above that line and stay.
        mx = rgb.max(axis=2)
        mn = rgb.min(axis=2)
        sat = (mx - mn) / np.maximum(mx, 1.0)
        solid = (sat > 0.20) | (mx < 140)
        for x in range(fg.shape[1]):
            col = np.where(solid[:, x] & fg[:, x])[0]
            if len(col):
                fg[col.max() + 2:, x] = False

    if kind == "can":
        # Per column, cut everything below the last "definitely metal/label"
        # pixel: that is the bottom rim of the can, and the soft grey-to-white
        # contact shadow underneath it goes away cleanly.
        band = int(fg.shape[0] * 0.86)
        strong = dist > 0.20
        for x in range(fg.shape[1]):
            col = np.where(strong[:, x] & fg[:, x])[0]
            if len(col):
                fg[col.max() + 2:, x] = False
            else:
                fg[band:, x] = False
    else:
        for y in range(fg.shape[0] - 1, -1, -1):
            row = fg[y]
            if not row.any():
                continue
            if row.mean() < 0.12 and dist[y][row].mean() < 0.10:
                fg[y] = False
            else:
                break

    if kind == "fruit":
        # A gap the painter closed off (e.g. the wedge between two cherry stems)
        # is trapped backdrop: still subject according to the flood fill, but it
        # must go. Genuine pale flesh such as citrus pith sits a few steps off
        # the backdrop colour and survives this tighter test.
        pockets, pn = ndimage.label(fg & (dist < 0.022))
        for i, sl in enumerate(ndimage.find_objects(pockets), start=1):
            if sl is None:
                continue
            comp = pockets[sl] == i
            if comp.sum() > 500:
                fg[sl][comp] = False

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
            # fruit: 800 px on the long side, whatever the aspect of the piece
            im = fit(im, height=800) if im.height >= im.width else fit(im, width=800)
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
