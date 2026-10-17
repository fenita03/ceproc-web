"""Genera src/brand/estratos.svg: líneas de estratos (capas de roca de la precordillera sanjuanina).

Uso: python -I scripts/brand/estratos.py
Trazos de 1 px (vector-effect: non-scaling-stroke) en currentColor; el color y la opacidad se
fijan desde CSS. Semilla fija: el dibujo es siempre el mismo.
"""
import math
import os
import random

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
W, H, LINES, STEP = 1600, 420, 22, 16
random.seed(7)
# Suma de ondas lentas compartidas: las capas se pliegan juntas, como un afloramiento.
waves = [(random.uniform(0.6, 2.4), random.uniform(0, math.tau), random.uniform(6, 22)) for _ in range(5)]


def y_at(x, i):
    base = 40 + i * (H - 60) / LINES
    fold = sum(a * math.sin(x / W * math.tau * f + p + i * 0.07) for f, p, a in waves)
    lift = 38 * math.exp(-((x - W * 0.62) / (W * 0.18)) ** 2) * (1 - i / LINES)  # cerro
    return base + fold * (0.5 + i / LINES) - lift


paths = []
for i in range(LINES):
    pts = [(x, y_at(x, i)) for x in range(0, W + STEP, STEP)]
    d = f"M{pts[0][0]} {pts[0][1]:.1f}" + "".join(f"L{x} {y:.1f}" for x, y in pts[1:])
    op = 0.35 + 0.65 * (i % 4 == 0)
    paths.append(f'<path d="{d}" opacity="{op:.2f}"/>')

svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="none" '
       'fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke">'
       + "".join(paths).replace("<path ", '<path vector-effect="non-scaling-stroke" ') + "</svg>")
open(os.path.join(ROOT, "src", "brand", "estratos.svg"), "w", encoding="utf-8").write(svg)
print(len(svg), "bytes")
