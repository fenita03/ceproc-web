"""Descarga las fotografías de áreas y portada y genera variantes WebP.

Uso: python -I scripts/fotos.py [clave ...]  (sin claves: todas; conserva las demás entradas)
Escribe public/img/<clave>-<ancho>.webp y src/content/photos.json (autor, licencia, fuente).

Solo se usan licencias que no exigen atribución visible en la interfaz (Pexels, CC0, dominio
público): el sitio no muestra créditos. Fuentes y licencias quedan en docs/image-sources.md.
Son fotos de referencia de cada oficio: no muestran instalaciones ni actividades de CEPROC.
"""
import html
import io
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "img")
os.makedirs(OUT, exist_ok=True)
UA = {"User-Agent": "CeprocWeb/1.0 (sitio institucional)"}

# "File:…" = Wikimedia Commons (CC0 o dominio público); "pexels:<id>" = Pexels (licencia Pexels).
PHOTOS = {
    "maquinaria": "pexels:29506742",
    "seguridad": "File:Construction worker harness (9253634989).jpg",
    "regional": "pexels:6196391",
    "cocina": "File:Chefs at Work (Unsplash).jpg",
    "textil": "pexels:6634692",
    "creativa": "File:Making pottery (Unsplash).jpg",
    "carpinteria": "pexels:7484154",
    "paisaje": "File:Cerro Alcázar.jpg",
}
# Descripción de las fotos de Pexels (la API pública no la expone sin clave).
PEXELS = {
    "29506742": "Excavadora cargando un camión volquete en una cantera",
    "6196391": "Mujer horneando pan en un horno de piedra tradicional",
    "6634692": "Manos tejiendo hilos de colores en un telar de madera",
    "7484154": "Dos carpinteros trabajando juntos en un taller",
}
# El fondo usa el original (Commons limita las miniaturas a 1920 px).
# Recorte (x0, x1 en fracción del ancho): el panorama del Cerro Alcázar mide 4,2:1.
CROP = {"paisaje": (0.06, 0.56)}
# Punto focal (0..1, desde arriba a la izquierda) para los recortes de los sectores y del fondo.
FOCUS = {
    "maquinaria": [0.5, 0.5],
    "seguridad": [0.62, 0.35],
    "regional": [0.5, 0.5],
    "cocina": [0.45, 0.4],
    "textil": [0.5, 0.5],
    "creativa": [0.55, 0.55],
    "carpinteria": [0.5, 0.45],
    "paisaje": [0.6, 0.55],
}
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
            return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=90).read()
        except Exception as e:  # límite de velocidad de Commons
            print("reintento", e)
            time.sleep(15 * (attempt + 1))
    raise RuntimeError(url)


def commons(title, width, original=False):
    q = urllib.parse.urlencode({"action": "query", "format": "json", "titles": title, "prop": "imageinfo",
                                "iiprop": "url|size|extmetadata", "iiurlwidth": width,
                                "iiextmetadatafilter": "LicenseShortName|Artist"})
    page = next(iter(json.loads(get("https://commons.wikimedia.org/w/api.php?" + q))["query"]["pages"].values()))
    ii = page["imageinfo"][0]
    em = ii["extmetadata"]
    lic = em["LicenseShortName"]["value"]
    if "CC0" not in lic and "ublic domain" not in lic:
        raise SystemExit(f"{title}: licencia {lic} exige atribución; elegir otra foto.")
    author = re.sub(r"<[^>]+>", "", html.unescape(em.get("Artist", {}).get("value", ""))).strip().split("\n")[0]
    im = Image.open(io.BytesIO(get(ii["url"] if original else (ii.get("thumburl") or ii["url"])))).convert("RGB")
    return im, {"title": title.replace("File:", ""), "author": author, "license": lic, "source": ii["descriptionurl"]}


def pexels(pid):
    url = f"https://images.pexels.com/photos/{pid}/pexels-photo-{pid}.jpeg?auto=compress&cs=tinysrgb&w=2400"
    im = Image.open(io.BytesIO(get(url))).convert("RGB")
    return im, {"title": PEXELS[pid], "author": "Pexels", "license": "Licencia Pexels",
                "source": f"https://www.pexels.com/photo/{pid}/"}


only = set(sys.argv[1:])
json_path = os.path.join(ROOT, "src", "content", "photos.json")
meta = json.load(open(json_path, encoding="utf-8")) if only and os.path.exists(json_path) else {}
for key, src in PHOTOS.items():
    if only and key not in only:
        continue
    wide = key in WIDE
    im, info = pexels(src.split(":", 1)[1]) if src.startswith("pexels:") else commons(src, 2560, original=wide)
    if key in CROP:
        x0, x1 = CROP[key]
        im = im.crop((round(im.width * x0), 0, round(im.width * x1), im.height))
    if key == "paisaje":
        im = grade(im)
    widths = WIDE.get(key, [640, 1080, 1600])
    for w in widths:
        w2 = min(w, im.width)
        im.resize((w2, round(im.height * w2 / im.width)), Image.LANCZOS).save(
            os.path.join(OUT, f"{key}-{w}.webp"), "WEBP", quality=80, method=6)
    meta[key] = {**info, "width": im.width, "height": im.height, "widths": widths, "focus": FOCUS[key]}
    print(key, im.size, info["author"], info["license"])
    time.sleep(3)

json.dump({k: meta[k] for k in PHOTOS if k in meta}, open(json_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
