"""Divide el logo cuantizado en piezas (isotipo, palabra, subtítulo, lema, línea) por tinta."""
import json
import os
import sys

import numpy as np
from PIL import Image

sp = sys.argv[1]
a = np.asarray(Image.open(os.path.join(sp, "logo_q.png")).convert("RGB")).astype(int)
H, W, _ = a.shape
S = 3  # escala respecto del recorte de 1071 × 576
yy, xx = np.mgrid[0:H, 0:W]
y, x = yy / S, xx / S

white = np.all(a == 255, axis=-1)
gold = (a[..., 0] > a[..., 2] + 40)
green = (~gold) & (a[..., 1] > a[..., 2] + 10) & ~white
navy = ~white & ~gold & ~green

regions = {
    "mark": (y < 184) | ((x < 262) & (y < 412)),
    "word": (y >= 184) & (y < 300) & (x >= 262),
    "sub": (y >= 300) & (y < 412) & (x >= 262),
    "lema": (y >= 412) & (y < 530),
    "rule": (y >= 530),
}
# Reglas de tinta por pieza (corrigen el suavizado del escaneo en los bordes)
ink_all = ~white
swoosh = (y >= 325) & (x < 262)
green_fix = green & swoosh
gold_fix = gold
navy_fix = ink_all & ~gold_fix & ~green_fix
inks = {"gold": gold_fix, "green": green_fix, "navy": navy_fix}
force = {"word": "navy", "sub": "navy", "lema": "green", "rule": "green"}
manifest = []
for rname, rmask in regions.items():
    for iname, imask in inks.items():
        if rname in force:
            if iname != force[rname]:
                continue
            m = rmask & ink_all
        else:
            m = rmask & imask
        if m.sum() < 400:
            continue
        fn = f"part_{rname}_{iname}.png"
        Image.fromarray(np.where(m, 0, 255).astype(np.uint8)).save(os.path.join(sp, fn))
        ys, xs = np.nonzero(m)
        manifest.append({"region": rname, "ink": iname, "file": fn, "px": int(m.sum()),
                         "bbox": [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]})
json.dump({"w": W, "h": H, "parts": manifest}, open(os.path.join(sp, "parts.json"), "w"), indent=1)
for p in manifest:
    print(p["region"], p["ink"], p["px"], p["bbox"])
