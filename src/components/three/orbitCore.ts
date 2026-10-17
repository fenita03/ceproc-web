/**
 * Núcleo orbital de la portada: tres órbitas inclinadas y las siete áreas de formación como
 * nodos luminosos alrededor del logo de CEPROC (el logo es una imagen plana superpuesta en el
 * centro; aquí no hay objeto central). La escena se construye una sola vez; React solo indica
 * qué área está activa y la escena interpola órbitas, nodos y la conexión dorada.
 */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  Group,
  Line,
  LineBasicMaterial,
  LineDashedMaterial,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import { CORE_R, NODE_ORBIT, NODE_PHASE, ORBITS } from "./orbitLayout";

export type OrbitOptions = { mobile: boolean; reduced: boolean };
export type NodePoint = { x: number; y: number; behind: boolean; side: "left" | "right" | "above-end" | "above-start" };

/** Textura radial para halos (generada en un canvas: sin descargas). */
function haloTexture(inner: string, outer: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, inner);
  grd.addColorStop(1, outer);
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

const damp = (k: number, dt: number) => 1 - Math.exp(-k * dt);
const BASE_ORBIT = [0.3, 0.38, 0.3];

export async function createOrbitCore(canvas: HTMLCanvasElement, opts: OrbitOptions) {
  const { mobile, reduced } = opts;
  const t0 = performance.now();

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  let dprCap = Math.min(window.devicePixelRatio, mobile ? 1.5 : 2);
  renderer.setPixelRatio(dprCap);
  renderer.outputColorSpace = SRGBColorSpace;

  const disposables: { dispose(): void }[] = [];
  const scene = new Scene();
  const root = new Group();
  scene.add(root);

  // --- luz cálida detrás del logo ---
  const glowTex = haloTexture("rgba(214,174,92,0.55)", "rgba(214,174,92,0)");
  const glowMat = new SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: AdditiveBlending, opacity: 0.3 });
  const glow = new Sprite(glowMat);
  glow.scale.setScalar(CORE_R * 4.4);
  glow.position.z = -0.2;
  root.add(glow);
  disposables.push(glowTex, glowMat);

  // --- órbitas: más opacas por delante, tenues por detrás (alfa por vértice) ---
  const orbitGroups: Group[] = [];
  const orbitMats: (LineBasicMaterial | LineDashedMaterial)[] = [];
  const goldTint = new Color("#e6bd6c");
  const greyTint = new Color("#a9b6c8");
  ORBITS.forEach((o, i) => {
    const g = new Group();
    g.rotation.set(o.tiltX, 0, o.tiltZ);
    const seg = mobile ? 160 : 320;
    const pts = new Float32Array((seg + 1) * 3);
    const cols = new Float32Array((seg + 1) * 4);
    for (let s = 0; s <= seg; s++) {
      const a = (s / seg) * Math.PI * 2;
      pts.set([Math.cos(a) * o.r, Math.sin(a) * o.r, 0], s * 3);
      const front = 0.5 - 0.5 * Math.sin(a); // con la inclinación, y negativo queda hacia la cámara
      cols.set([1, 1, 1, 0.35 + 0.65 * front], s * 4);
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(pts, 3));
    geo.setAttribute("color", new BufferAttribute(cols, 4));
    const common = { color: greyTint.clone(), transparent: true, opacity: BASE_ORBIT[i], vertexColors: true, depthWrite: false };
    const mat = i === 1 ? new LineDashedMaterial({ ...common, dashSize: 0.016, gapSize: 0.02 }) : new LineBasicMaterial(common);
    const line = new Line(geo, mat);
    if (i === 1) line.computeLineDistances();
    g.add(line);
    root.add(g);
    orbitGroups.push(g);
    orbitMats.push(mat);
    disposables.push(geo, mat);
  });

  // Polvo fino sobre las órbitas: textura de profundidad, muy tenue y escaso.
  {
    const n = mobile ? 50 : 100;
    const arr = new Float32Array(n * 3);
    for (let k = 0; k < n; k++) {
      const o = ORBITS[k % ORBITS.length];
      const a = ((k * 137.5) % 360) * (Math.PI / 180);
      const r = o.r + (((k * 7) % 11) / 11 - 0.5) * 0.05;
      const v = new Vector3(Math.cos(a) * r, Math.sin(a) * r, 0);
      v.applyEuler(orbitGroups[k % ORBITS.length].rotation);
      arr.set([v.x, v.y, v.z], k * 3);
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(arr, 3));
    const mat = new PointsMaterial({ color: 0xc8d4e6, size: mobile ? 0.008 : 0.006, transparent: true, opacity: 0.4, depthWrite: false });
    root.add(new Points(geo, mat));
    disposables.push(geo, mat);
  }

  // --- nodos (las siete áreas): punto luminoso con halo ---
  const nodeGeo = new SphereGeometry(0.016, 16, 12);
  const haloTex = haloTexture("rgba(255,224,170,0.95)", "rgba(255,224,170,0)");
  disposables.push(nodeGeo, haloTex);
  type N = { orbit: number; phase: number; mesh: Mesh; mat: MeshBasicMaterial; haloMat: SpriteMaterial; halo: Sprite; s: number; world: Vector3 };
  const nodes: N[] = NODE_ORBIT.map((orbit, i) => {
    const mat = new MeshBasicMaterial({ color: new Color("#eef2f8") });
    const mesh = new Mesh(nodeGeo, mat);
    orbitGroups[orbit].add(mesh);
    const haloMat = new SpriteMaterial({ map: haloTex, transparent: true, depthWrite: false, blending: AdditiveBlending, opacity: 0.22 });
    const halo = new Sprite(haloMat);
    halo.scale.setScalar(0.11);
    mesh.add(halo);
    disposables.push(mat, haloMat);
    return { orbit, phase: NODE_PHASE[i], mesh, mat, haloMat, halo, s: 0, world: new Vector3() };
  });

  // Conexión del logo al área activa: filamento dorado (las líneas WebGL miden 1 px fijo).
  const linkGeo = new CylinderGeometry(1, 1, 1, 8, 1, true);
  linkGeo.translate(0, 0.5, 0);
  const linkMat = new MeshBasicMaterial({ color: 0xffd38a, transparent: true, opacity: 0, depthWrite: false, blending: AdditiveBlending });
  const link = new Mesh(linkGeo, linkMat);
  link.frustumCulled = false;
  root.add(link);
  disposables.push(linkGeo, linkMat);
  const up = new Vector3(0, 1, 0);

  // --- cámara: campo visual cerrado, perspectiva suave ---
  const camera = new PerspectiveCamera(18, 1, 0.1, 60);

  // --- estado ---
  let active: number | null = null;
  let focus = 0;
  const orbitHi = ORBITS.map(() => 0);
  const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
  let spin = 0;
  let raf = 0;
  let running = false;
  let visible = true;
  let disposed = false;
  let last = 0;
  let lastDraw = 0;
  let busyUntil = 0; // hasta cuándo dibujar a 60 fps (interacción reciente)
  let enter = reduced ? 1 : 0;
  let onFrame: ((pts: NodePoint[]) => void) | null = null;
  const projected: NodePoint[] = nodes.map(() => ({ x: 0, y: 0, behind: false, side: "right" }));
  const tmp = new Vector3();
  const dir = new Vector3();
  const start = new Vector3();
  const center = new Vector3();
  const camDir = new Vector3();
  let costSum = 0;
  let costN = 0;
  let slow = 0;
  let frames = 0;

  function frame(now: number) {
    raf = 0;
    if (!running || !visible || disposed) return;
    // En reposo (solo el giro ambiental) basta ~30 fps; con interacción o transiciones, 60 fps.
    const transitioning = now < busyUntil || enter < 1 || Math.abs(focus - (active === null ? 0 : 1)) > 0.002;
    if (!transitioning && now - lastDraw < 31) {
      raf = requestAnimationFrame(frame);
      return;
    }
    lastDraw = now;
    const c0 = performance.now();
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    const k = reduced ? 1 : damp(12, dt);
    const kSlow = reduced ? 1 : damp(4, dt);
    focus += ((active === null ? 0 : 1) - focus) * k;
    tilt.x += (tilt.tx - tilt.x) * kSlow;
    tilt.y += (tilt.ty - tilt.y) * kSlow;
    if (enter < 1) enter = Math.min(1, enter + dt / 1.2);
    const e = 1 - Math.pow(1 - enter, 3);

    if (!reduced) spin += dt * 0.05 * (1 - 0.92 * focus);
    root.rotation.set(0.04 + tilt.y, tilt.x, 0);
    root.scale.setScalar(0.92 + 0.08 * e);

    const activeOrbit = active === null ? -1 : nodes[active].orbit;
    orbitMats.forEach((m, i) => {
      orbitHi[i] += ((i === activeOrbit ? 1 : 0) - orbitHi[i]) * k;
      m.opacity = (BASE_ORBIT[i] + 0.4 * orbitHi[i] - 0.08 * focus * (1 - orbitHi[i])) * e;
      m.color.copy(greyTint).lerp(goldTint, orbitHi[i]);
    });
    glowMat.opacity = 0.24 + 0.24 * focus;

    nodes.forEach((n, i) => {
      const o = ORBITS[n.orbit];
      const a = n.phase + spin;
      n.mesh.position.set(Math.cos(a) * o.r, Math.sin(a) * o.r, 0);
      n.s += ((active === i ? 1 : 0) - n.s) * k;
      n.mesh.scale.setScalar((1 + 0.6 * n.s) * e);
      n.mat.color.setRGB(0.93 + 0.07 * n.s, 0.95 - 0.13 * n.s, 0.97 - 0.42 * n.s);
      n.haloMat.opacity = 0.2 + 0.75 * n.s;
      n.halo.scale.setScalar(0.11 + 0.1 * n.s);
      n.mesh.getWorldPosition(n.world);
    });

    if (active !== null) {
      root.worldToLocal(tmp.copy(nodes[active].world));
      dir.copy(tmp).normalize();
      start.copy(dir).multiplyScalar(CORE_R);
      const len = Math.max(0.001, tmp.distanceTo(start) - 0.025);
      link.position.copy(start);
      link.quaternion.setFromUnitVectors(up, dir.copy(tmp).sub(start).normalize());
      link.scale.set(0.0035, len * Math.min(1, focus * 1.3), 0.0035);
    }
    linkMat.opacity = focus;

    renderer.render(scene, camera);

    // Proyección de los nodos para los rótulos HTML y para elegir con el puntero.
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    root.getWorldPosition(center);
    tmp.copy(center).project(camera);
    const cx = (tmp.x * 0.5 + 0.5) * cw;
    const cy = (-tmp.y * 0.5 + 0.5) * ch;
    camDir.copy(camera.position).sub(center).normalize();
    const coreScreenR = (CORE_R * root.scale.x * ch) / (2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.distanceTo(center));
    nodes.forEach((n, i) => {
      tmp.copy(n.world).project(camera);
      const x = (tmp.x * 0.5 + 0.5) * cw;
      const y = (-tmp.y * 0.5 + 0.5) * ch;
      const depth = tmp.copy(n.world).sub(center).dot(camDir);
      const behind = depth < 0 && Math.hypot(x - cx, y - cy) < coreScreenR * 1.1;
      // El rótulo va hacia afuera del núcleo; en los bordes, encima del nodo (no se sale).
      const side = x > cw * 0.8 ? "above-end" : x < cw * 0.2 ? "above-start" : x < cx ? "left" : "right";
      projected[i] = { x, y, behind, side };
    });
    onFrame?.(projected);

    costSum += performance.now() - c0;
    costN++;
    if (transitioning && frames < 120 && dprCap > 1 && enter >= 1) {
      frames++;
      if (dt > 0.022) slow++;
      if (frames === 120 && slow > 60) {
        dprCap = 1;
        renderer.setPixelRatio(1);
        resize();
      }
    }

    const settled = reduced && !transitioning && nodes.every((n, i) => Math.abs(n.s - (active === i ? 1 : 0)) < 1e-3);
    if (!settled) raf = requestAnimationFrame(frame);
    else last = 0;
  }

  function kick(busyMs = 0) {
    if (busyMs) busyUntil = Math.max(busyUntil, performance.now() + busyMs);
    if (!raf && running && visible && !disposed) raf = requestAnimationFrame(frame);
  }

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const outer = ORBITS[ORBITS.length - 1].r;
    const tan = Math.tan((camera.fov * Math.PI) / 360);
    const fitW = (outer * 1.1) / tan / camera.aspect;
    const fitH = (outer * 0.62) / tan;
    camera.position.set(0, 0, Math.max(fitW, fitH, 4));
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    kick(200);
  }

  resize();
  const tc = performance.now();
  await renderer.compileAsync(scene, camera);
  const compileMs = Math.round(performance.now() - tc);
  const initMs = Math.round(performance.now() - t0);

  return {
    start() {
      running = true;
      kick(1500);
    },
    setActive(i: number | null) {
      active = i;
      kick(700);
    },
    point(nx: number, ny: number) {
      if (reduced) return;
      tilt.tx = nx * 0.14;
      tilt.ty = ny * 0.09;
      kick(600);
    },
    /** Nodo más cercano al puntero (en píxeles del lienzo). */
    nearest(clientX: number, clientY: number) {
      const r = canvas.getBoundingClientRect();
      const x = clientX - r.left;
      const y = clientY - r.top;
      const dists = projected.map((p) => Math.hypot(p.x - x, p.y - y));
      let index = 0;
      dists.forEach((d, i) => d < dists[index] && (index = i));
      return { index, dist: dists[index], dists };
    },
    onFrame(cb: typeof onFrame) {
      onFrame = cb;
      kick();
    },
    setVisible(v: boolean) {
      visible = v;
      if (v) kick(300);
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
        last = 0;
      }
    },
    resize,
    stats() {
      return {
        dpr: renderer.getPixelRatio(),
        calls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
        compileMs,
        initMs,
        frameMs: +(costSum / Math.max(1, costN)).toFixed(2),
        frames: costN,
      };
    },
    dispose() {
      disposed = true;
      running = false;
      cancelAnimationFrame(raf);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    },
  };
}
