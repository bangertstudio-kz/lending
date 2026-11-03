import { useRouter } from 'next/router';
import { useEffect, useRef, useState, type ReactNode } from 'react';

// Переход между страницами как на surf.ru (и как в alltracker, shaders/sweep.frag):
// переливающаяся полоса проходит через экран, за ней уже новая страница,
// впереди — ещё старая. Старая остаётся смонтированной, пока полоса идёт,
// замороженная на своём скролле. Назад по истории — полоса идёт справа налево.

const DURATION = 1100;
const easeOutQuart = (t: number) => 1 - (1 - t) ** 4;
const centre = (p: number, forward: boolean) => (forward ? -0.2 + 1.4 * p : 1.2 - 1.4 * p);

const VERT = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

// Порт sweep.frag на WebGL1. Палитра под сайт: лайм -> латунь -> медь.
const FRAG = `
precision highp float;
uniform vec2 uSize;
uniform float uTime, uProgress, uPosStart, uPosEnd, uHueShift;
#define PI 3.14159265359
const vec3 kPalA = vec3(0.80, 0.72, 0.34);
const vec3 kPalB = vec3(0.06, 0.26, 0.10);
const vec3 kPalC = vec3(0.50, 0.50, 0.50);
const vec3 kPalD = vec3(0.00, 0.10, 0.10);
const float kBandTight = 14.0;
const float kSwell = 0.55;
vec3 pal(float t) { return kPalA + kPalB * cos(2.0 * PI * (kPalC * t + kPalD)); }
void main() {
  vec2 uv = gl_FragCoord.xy / uSize;
  float axis = uv.x;
  float cross = uv.y;
  float pos = uPosStart + uProgress * (uPosEnd - uPosStart);
  float wave = sin(cross * 6.0 + uTime * 1.3) * 0.020
             + sin(cross * 13.0 - uTime * 0.9 + 1.4) * 0.012
             + sin(cross * 21.0 + uTime * 1.7 + 2.6) * 0.006;
  float dir = sign(uPosEnd - uPosStart);
  float d = (axis - pos) - wave;
  float band = exp(-d * d * kBandTight);
  float slope = -2.0 * d * kBandTight * band;
  vec3 n = normalize(vec3(-slope * 0.18, 0.0, 1.0));
  float trail = clamp(0.5 - d * dir * 1.3, 0.0, 1.0);
  trail = pow(trail, 2.5) * 0.30;
  float intensity = max(band * 0.95, trail);
  float vfade = smoothstep(0.0, 0.015, cross) * smoothstep(1.0, 0.985, cross);
  float t = n.x * 0.45 + axis * 1.4 + cross * 0.35 + uHueShift + uTime * 0.04;
  vec3 col = pal(t);
  vec3 l = normalize(vec3(0.35, 0.55, 0.9));
  vec3 h = normalize(l + vec3(0.0, 0.0, 1.0));
  float fresnel = pow(1.0 - clamp(n.z, 0.0, 1.0), 3.0);
  float spec = pow(clamp(dot(n, h), 0.0, 1.0), 80.0);
  float entry = smoothstep(0.0, 0.1, uProgress) * (1.0 - smoothstep(0.65, 1.0, uProgress));
  float bodyA = intensity * vfade * entry;
  float highMask = band * vfade * entry * kSwell;
  vec3 high = (col * fresnel * 0.55 + vec3(spec) * 1.1) * highMask;
  float highA = (fresnel * 0.4 + spec * 0.9) * highMask;
  gl_FragColor = vec4(col * bodyA + high, min(bodyA + highA, 1.0));
}`;

type Band = (progress: number, time: number) => void;

/** Рисует полосу на canvas; null, если WebGL недоступен. */
function createBand(canvas: HTMLCanvasElement, forward: boolean): { draw: Band; dispose: () => void } | null {
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, antialias: false });
  if (!gl) return null;
  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  // ponytail: dpr ограничен 1.5 — полоса мягкая, полное разрешение не видно, а GPU на мобилках жалко.
  const dpr = Math.min(window.devicePixelRatio, 1.5);
  canvas.width = Math.round(window.innerWidth * dpr);
  canvas.height = Math.round(window.innerHeight * dpr);
  gl.viewport(0, 0, canvas.width, canvas.height);

  const u = (name: string) => gl.getUniformLocation(prog, name);
  gl.uniform2f(u('uSize'), canvas.width, canvas.height);
  gl.uniform1f(u('uPosStart'), forward ? -0.2 : 1.2);
  gl.uniform1f(u('uPosEnd'), forward ? 1.2 : -0.2);
  gl.uniform1f(u('uHueShift'), Math.random() * 0.4);
  const uTime = u('uTime');
  const uProgress = u('uProgress');

  return {
    draw: (progress, time) => {
      gl.uniform1f(uTime, time);
      gl.uniform1f(uProgress, progress);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose: () => gl.getExtension('WEBGL_lose_context')?.loseContext(),
  };
}

type Page = { key: string; node: ReactNode };
type Leaving = Page & { scroll: number; forward: boolean };

export function PageSweep({ pageKey, children }: { pageKey: string; children: ReactNode }) {
  const router = useRouter();
  const [current, setCurrent] = useState<Page>({ key: pageKey, node: children });
  const [leaving, setLeaving] = useState<Leaving | null>(null);
  const [pending, setPending] = useState<{ scroll: number; forward: boolean } | null>(null);
  const leavingRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Скролл и направление запоминаем до того, как Next сбросит скролл.
  useEffect(() => {
    let popping = false;
    router.beforePopState(() => {
      popping = true;
      return true;
    });
    const onStart = () => {
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setPending(still ? null : { scroll: window.scrollY, forward: !popping });
      popping = false;
    };
    router.events.on('routeChangeStart', onStart);
    return () => {
      router.events.off('routeChangeStart', onStart);
      router.beforePopState(() => true);
    };
  }, [router]);

  if (current.key !== pageKey) {
    setLeaving(pending && { ...current, ...pending });
    setPending(null);
    setCurrent({ key: pageKey, node: children });
  } else if (current.node !== children) {
    setCurrent({ key: pageKey, node: children });
  }

  useEffect(() => {
    if (!leaving) return;
    const old = leavingRef.current;
    const band = canvasRef.current && createBand(canvasRef.current, leaving.forward);
    if (!old || !band) {
      setLeaving(null);
      return;
    }
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const t = Math.min((now - start) / DURATION, 1);
      const p = easeOutQuart(t);
      const seam = Math.min(Math.max(centre(p, leaving.forward), 0), 1) * 100;
      old.style.clipPath = leaving.forward ? `inset(0 0 0 ${seam}%)` : `inset(0 ${100 - seam}% 0 0)`;
      band.draw(p, (now - start) / 1000);
      if (t < 1) frame = requestAnimationFrame(tick);
      else setLeaving(null);
    });
    return () => {
      cancelAnimationFrame(frame);
      band.dispose();
    };
  }, [leaving]);

  // Обе страницы в одном keyed-списке: уходящая не перемонтируется, лишь
  // становится fixed поверх новой. margin, а не transform — иначе fixed-шапка
  // внутри неё поедет вместе со скроллом.
  const pages = leaving ? [leaving, current] : [current];
  return (
    <>
      {pages.map((page) =>
        page === leaving ? (
          <div key={page.key} ref={leavingRef} inert aria-hidden className="fixed inset-0 z-[80] overflow-hidden bg-bg">
            <div style={{ marginTop: -leaving.scroll }}>{page.node}</div>
          </div>
        ) : (
          <div key={page.key}>
            <div>{page.node}</div>
          </div>
        ),
      )}
      {leaving && <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-[81] h-full w-full" />}
    </>
  );
}
