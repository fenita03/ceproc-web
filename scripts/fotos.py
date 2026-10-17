"""Descarga las fotografías ilustrativas (Wikimedia Commons) y genera variantes WebP.

Uso: python -I scripts/fotos.py
Escribe public/img/<clave>-<ancho>.webp y src/content/photos.json (autor, licencia, fuente).
Son imágenes ilustrativas de cada oficio: no muestran instalaciones ni actividades de CEPROC.
"""
import html
import io
import json
import os
import re
import time
import urllib.parse
import urllib.request

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "img")
os.makedirs(OUT, exist_ok=True)
UA = {"User-Agent": "CeprocWeb/1.0 (sitio institucional)"}

PHOTOS = {
    "maquinaria": "File:Haul truck under repair at Brockman 4, September 2018.jpg",
    "seguridad": "File:Construction worker harness (9253634989).jpg",
    "regional": "File:Baker woman's hands kneading bread dough.jpg",
    "cocina": "File:Chefs at Work (Unsplash).jpg",
    "textil": "File:Ishigaki Island minsa.jpg",
    "creativa": "File:Making pottery (Unsplash).jpg",
    "carpinteria": "File:Ménuisiers au travail 2.jpg",
    "paisaje": "File:Embalse Ullum desde cerro Tres María, provincia de San Juan, Argentina.jpg",
}
# Punto focal (0..1, desde arriba a la izquierda) para los recortes de los sectores y del fondo.
FOCUS = {
    "maquinaria": [0.45, 0.45],
    "seguridad": [0.62, 0.35],
    "regional": [0.55, 0.55],
    "cocina": [0.45, 0.4],
    "textil": [0.45, 0.5],
    "creativa": [0.55, 0.55],
    "carpinteria": [0.4, 0.6],
    "paisaje": [0.42, 0.5],
}
WIDTHS = [640, 1080, 1600, 2400]
# El fondo de la portada necesita más resolución (Full HD con densidad 1,5–2).
WIDE = {"paisaje": [640, 1080, 1600, 2400, 3200]}


def grade(im):
    """Gradación cinematográfica: sombras azul noche, luces cálidas doradas, contraste suave."""
    import numpy as np
    a = np.asarray(im).astype(np.float32) / 255.0
    lum = (0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2])[..., None]
    shadows = np.clip(1 - lum * 1.8, 0, 1)
    highlights = np.clip((lum - 0.45) * 1.8, 0, 1)
    a = a + shadows * (np.array([0.02, 0.07, 0.16]) - a) * 0.28
    a = a + highlights * (np.array([1.0, 0.82, 0.55]) - a) * 0.16
    a = (a - 0.5) * 1.06 + 0.5  # contraste
    g = a.mean(axis=2, keepdims=True)
    a = g + (a - g) * 0.9  # saturación levemente contenida
    return Image.fromarray((np.clip(a, 0, 1) * 255).astype("uint8"))


def get(url):
    for attempt in range(6):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read()
        except Exception as e:  # límite de velocidad de Commons
            print("reintento", e)
            time.sleep(15 * (attempt + 1))
    raise RuntimeError(url)


import sys

# Uso: python -I scripts/fotos.py [clave ...]  (sin claves: todas). Conserva las demás entradas.
only = set(sys.argv[1:])
json_path = os.path.join(ROOT, "src", "content", "photos.json")
meta = json.load(open(json_path, encoding="utf-8")) if only and os.path.exists(json_path) else {}
for key, title in PHOTOS.items():
    if only and key not in only:
        continue
    q = urllib.parse.urlencode({"action": "query", "format": "json", "titles": title, "prop": "imageinfo",
                                "iiprop": "url|size|extmetadata", "iiurlwidth": 2560, "iiextmetadatafilter": "LicenseShortName|Artist"})
    info = json.loads(get("https://commons.wikimedia.org/w/api.php?" + q))
    page = next(iter(info["query"]["pages"].values()))
    ii = page["imageinfo"][0]
    em = ii["extmetadata"]
    author = re.sub(r"<[^>]+>", "", html.unescape(em.get("Artist", {}).get("value", ""))).strip().split("\n")[0]
    im = Image.open(io.BytesIO(get(ii.get("thumburl") or ii["url"]))).convert("RGB")  # miniatura oficial de 2560 px
    if key == "paisaje":
        im = grade(im)
    widths = WIDE.get(key, [640, 1080, 1600])
    for w in widths:
        w2 = min(w, im.width)
        im.resize((w2, round(im.height * w2 / im.width)), Image.LANCZOS).save(
            os.path.join(OUT, f"{key}-{w}.webp"), "WEBP", quality=80, method=6)
    meta[key] = {"title": title.replace("File:", ""), "author": author, "license": em["LicenseShortName"]["value"],
                 "source": ii["descriptionurl"], "width": im.width, "height": im.height,
                 "widths": widths, "focus": FOCUS[key]}
    print(key, im.size, author, meta[key]["license"])
    time.sleep(6)

json.dump({k: meta[k] for k in PHOTOS if k in meta}, open(json_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
