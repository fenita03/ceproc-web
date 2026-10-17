"""Une los tramos de capture-review.mjs en una imagen por vista.

Uso: python -I scripts/stitch.py <carpeta-tramos> <carpeta-salida>
Cada tramo se nombra <vista>-<n>-<scrollY>.png; el último se recorta por solapamiento.
"""
import glob
import os
import sys

from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
for view in ("desktop", "mobile"):
    parts = sorted(glob.glob(os.path.join(src, f"{view}-*.png")))
    if not parts:
        continue
    first = Image.open(parts[0])
    w, vh = first.size
    ys = [int(os.path.splitext(p)[0].rsplit("-", 1)[1]) for p in parts]
    css_vh = ys[1] - ys[0] if len(ys) > 1 else vh
    scale = vh / css_vh if len(ys) > 1 and ys[1] - ys[0] > 0 else 1
    total = round(ys[-1] * scale) + vh
    sheet = Image.new("RGB", (w, total), "white")
    for p, y in zip(parts, ys):
        sheet.paste(Image.open(p), (0, round(y * scale)))
    sheet.save(os.path.join(dst, f"{view}.png"))
    print(view, sheet.size)
