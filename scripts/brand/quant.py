import os
import sys

import numpy as np
from PIL import Image, ImageFilter

sp = sys.argv[1]
scale = int(sys.argv[2]) if len(sys.argv) > 2 else 3
im = Image.open(os.path.join(sp, "logo_full.png")).convert("RGB")
im = im.resize((im.width * scale, im.height * scale), Image.LANCZOS).filter(ImageFilter.MedianFilter(5))
a = np.asarray(im).astype(np.int32)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
white = (r + g + b) > 560
gold = (~white) & (r > b + 45) & (r >= g - 10)
green = (~white) & (~gold) & (g > r + 20) & (g >= b - 5)
navy = (~white) & (~gold) & (~green)


def mean(mask):
    return tuple(int(x) for x in a[mask].mean(axis=0))


core_navy = navy & ((r + g + b) < 260)
pal = {
    "white": (255, 255, 255),
    "navy": mean(core_navy),
    "green": mean(green & ((r + g + b) < 380)),
    "gold": mean(gold & ((r + g + b) < 520)),
}
for k, v in pal.items():
    print(k, "#%02x%02x%02x" % v, flush=True)
out = np.zeros_like(a, dtype=np.uint8)
out[...] = pal["white"]
out[navy] = pal["navy"]
out[green] = pal["green"]
out[gold] = pal["gold"]
q = Image.fromarray(out).filter(ImageFilter.ModeFilter(5))
q.save(os.path.join(sp, "logo_q.png"))
print("ok", q.size, flush=True)
