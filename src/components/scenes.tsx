/**
 * Scènes visuelles originales (SVG) — images TEMPORAIRES, cohérentes avec l'identité,
 * à remplacer par la photographie finale via <Photo /> (voir Photo.tsx).
 * Un PRNG à graine garantit un rendu serveur stable (pas d'erreur d'hydratation).
 */
import { useId, type ReactNode } from "react";

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f = (n: number) => +n.toFixed(1);

function leaf(x: number, y: number, len: number, deg: number, w: number) {
  const a = (deg * Math.PI) / 180;
  const tx = x + Math.cos(a) * len, ty = y + Math.sin(a) * len;
  const nx = -Math.sin(a) * w, ny = Math.cos(a) * w;
  const mx = x + Math.cos(a) * len * 0.5, my = y + Math.sin(a) * len * 0.5;
  return `M${f(x)} ${f(y)}Q${f(mx + nx)} ${f(my + ny)} ${f(tx)} ${f(ty)}Q${f(mx - nx * 0.8)} ${f(my - ny * 0.8)} ${f(x)} ${f(y)}Z`;
}

function branch(x0: number, y0: number, heading: number, length: number, bend: number, n: number, leafLen: number, seed: number) {
  const r = rng(seed);
  let x = x0, y = y0, h = heading;
  const step = length / n;
  let stem = `M${f(x)} ${f(y)}`;
  let leaves = "";
  for (let i = 0; i < n; i++) {
    h += bend + (r() - 0.5) * 5;
    const rad = (h * Math.PI) / 180;
    x += Math.cos(rad) * step;
    y += Math.sin(rad) * step;
    stem += `L${f(x)} ${f(y)}`;
    const ll = leafLen * (1 - (i / n) * 0.55) * (0.7 + r() * 0.6);
    leaves += leaf(x, y, ll, h + (i % 2 ? 1 : -1) * (38 + r() * 30), ll * 0.34);
  }
  leaves += leaf(x, y, leafLen * 0.6, h, leafLen * 0.2);
  return { stem, leaves };
}

function Grain({ id }: { id: string }) {
  return (
    <filter id={id} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix values="0 0 0 0 0.15  0 0 0 0 0.15  0 0 0 0 0.2  0 0 0 0.2 0" />
    </filter>
  );
}

type SceneProps = { className?: string; label?: string };

function Frame({ children, className, label, viewBox }: SceneProps & { children: ReactNode; viewBox: string }) {
  return (
    <svg viewBox={viewBox} preserveAspectRatio="xMidYMid slice" className={className}
      role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {children}
    </svg>
  );
}

const useUid = () => useId().replace(/:/g, "");

/* ───── LE CERCLE D'ÂMES : douze places, une table en bois, du thé ───── */
export function CercleScene({ className, label }: SceneProps) {
  const u = useUid();
  const at = (i: number, r: number) => {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    return { x: f(400 + Math.cos(a) * r), y: f(400 + Math.sin(a) * r) };
  };
  const grainLines = Array.from({ length: 9 }, (_, i) => {
    const y = 250 + i * 37;
    return `M${210 + Math.abs(i - 4) * 14} ${y}C330 ${y - 10} 470 ${y + 12} ${590 - Math.abs(i - 4) * 14} ${y}`;
  });
  return (
    <Frame viewBox="0 0 800 800" className={className} label={label}>
      <defs>
        <radialGradient id={`${u}w`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#E8B26A" stopOpacity="0.55" /><stop offset="1" stopColor="#E8B26A" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${u}t`}><circle cx="400" cy="400" r="205" /></clipPath>
        <Grain id={`${u}g`} />
      </defs>
      <rect width="800" height="800" fill="#100B42" />
      <circle cx="400" cy="400" r="390" fill={`url(#${u}w)`} opacity="0.9" />
      <circle cx="408" cy="412" r="205" fill="#2a1a05" opacity="0.28" />
      <circle cx="400" cy="400" r="205" fill="#C28B3E" />
      <g clipPath={`url(#${u}t)`} fill="none" stroke="#9A6A1F" strokeWidth="2" opacity="0.55">
        {grainLines.map((d, i) => <path key={i} d={d} />)}
      </g>
      <circle cx="400" cy="400" r="196" fill="none" stroke="#F4F0FD" strokeWidth="1.5" opacity="0.35" />
      <circle cx="400" cy="400" r="42" fill="#1D1566" />
      <circle cx="400" cy="400" r="27" fill="none" stroke="#B9A4F2" strokeWidth="2" />
      <path d="M434 392q26 4 24 22" stroke="#1D1566" strokeWidth="6" fill="none" strokeLinecap="round" />
      {Array.from({ length: 12 }, (_, i) => {
        const c = at(i, 140);
        return (
          <g key={i}>
            <circle cx={c.x} cy={c.y} r="16" fill="#F4F0FD" stroke="#6A47DE" strokeWidth="2" />
            <circle cx={c.x} cy={c.y} r="8" fill="#E8B26A" />
          </g>
        );
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const s = at(i, 268);
        return <circle key={i} cx={s.x} cy={s.y} r="40" fill={i === 4 ? "#E8B26A" : "#5B32D6"} opacity={i === 4 ? 1 : 0.95} />;
      })}
      <rect width="800" height="800" filter={`url(#${u}g)`} opacity="0.55" style={{ mixBlendMode: "multiply" }} />
    </Frame>
  );
}

/* ───── ATELIERS GUÉRISON : entre Terre et Ciel, une aile de feuilles ───── */
export function AteliersScene({ className, label }: SceneProps) {
  const u = useUid();
  const wing = Array.from({ length: 8 }, (_, i) => leaf(400, 540, 330 - i * 20, -168 + i * 10, (330 - i * 20) * 0.2)).join("");
  const wing2 = Array.from({ length: 6 }, (_, i) => leaf(400, 540, 250 - i * 18, -160 + i * 11, (250 - i * 18) * 0.2)).join("");
  const stems = branch(620, 800, -100, 330, -1.4, 9, 70, 9);
  return (
    <Frame viewBox="0 0 800 800" className={className} label={label}>
      <defs>
        <filter id={`${u}b`}><feGaussianBlur stdDeviation="22" /></filter>
        <Grain id={`${u}g`} />
      </defs>
      <rect width="800" height="800" fill="#120D4A" />
      {/* lavis aquarelle du ciel */}
      <g filter={`url(#${u}b)`}>
        <circle cx="250" cy="180" r="170" fill="#5B32D6" opacity="0.6" />
        <circle cx="560" cy="250" r="140" fill="#C45BE6" opacity="0.35" />
        <circle cx="400" cy="120" r="110" fill="#B9A4F2" opacity="0.35" />
      </g>
      <path d="M 637.6 195.4 A 62 62 0 1 1 604.5 149.6" fill="none" stroke="#E8B26A" strokeWidth="2.5" strokeLinecap="round" />
      {/* la Terre */}
      <path d="M0 560C180 520 340 590 520 550S720 520 800 545V800H0Z" fill="#6A47DE" />
      <path d="M0 650C200 610 360 690 560 650S740 640 800 660V800H0Z" fill="#2E1F86" opacity="0.85" />
      {/* l'aile : on ne coupe pas ses ailes */}
      <path d={wing} fill="#B9A4F2" opacity="0.95" />
      <path d={wing2} fill="#6A47DE" opacity="0.9" />
      <g fill="#F4F0FD" stroke="#F4F0FD" opacity="0.9">
        <path d={stems.stem} fill="none" strokeWidth="3" strokeLinecap="round" /><path d={stems.leaves} stroke="none" />
      </g>
      {/* feuille de papier posée */}
      <g transform="rotate(-8 170 650)">
        <rect x="100" y="600" width="150" height="100" rx="3" fill="#F4F0FD" />
        <path d="M118 630h110M118 650h92M118 670h104" stroke="#1D1566" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
      </g>
      <rect width="800" height="800" filter={`url(#${u}g)`} opacity="0.5" style={{ mixBlendMode: "multiply" }} />
    </Frame>
  );
}

/* ───── L'ACCUEIL DOUX : une porte entrouverte, de la lumière ───── */
export function AccueilScene({ className, label }: SceneProps) {
  const u = useUid();
  return (
    <Frame viewBox="0 0 800 800" className={className} label={label}>
      <defs>
        <linearGradient id={`${u}l`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F4F0FD" /><stop offset="1" stopColor="#E8B26A" /></linearGradient>
        <linearGradient id={`${u}beam`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#F4F0FD" stopOpacity="0.75" /><stop offset="1" stopColor="#F4F0FD" stopOpacity="0" /></linearGradient>
        <Grain id={`${u}g`} />
      </defs>
      <rect width="800" height="800" fill="#B9A4F2" />
      <rect y="640" width="800" height="160" fill="#1D1566" opacity="0.88" />
      <path d="M250 700V330a150 150 0 0 1 300 0V700Z" fill="#0A0830" />
      <path d="M274 700V332a126 126 0 0 1 252 0V700Z" fill={`url(#${u}l)`} />
      <path d="M274 700L120 800H680L526 700Z" fill={`url(#${u}beam)`} opacity="0.65" />
      <path d="M274 700V332a126 126 0 0 1 90-121V700Z" fill="#1D1566" />
      <circle cx="342" cy="520" r="7" fill="#E8B26A" />
      <g fill="#2E1F86">
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={leaf(610 + i * 5, 700, 120 + i * 14, -96 + i * 14, 28)} />)}
      </g>
      <rect width="800" height="800" filter={`url(#${u}g)`} opacity="0.55" style={{ mixBlendMode: "multiply" }} />
    </Frame>
  );
}

/* ───── Histoire : paysage de brume, deux branches ───── */
export function StoryScene({ className, label }: SceneProps) {
  const u = useUid();
  const b = branch(1100, 900, -165, 900, 2.2, 14, 110, 31);
  const b2 = branch(60, 1000, -70, 600, 1.6, 11, 84, 64);
  return (
    <Frame viewBox="0 0 1200 900" className={className} label={label}>
      <defs>
        <radialGradient id={`${u}s`} cx="0.3" cy="0.35" r="0.7"><stop offset="0" stopColor="#F4F0FD" stopOpacity="0.8" /><stop offset="1" stopColor="#F4F0FD" stopOpacity="0" /></radialGradient>
        <Grain id={`${u}g`} />
      </defs>
      <rect width="1200" height="900" fill="#B9A4F2" />
      <rect width="1200" height="900" fill={`url(#${u}s)`} />
      <path d="M0 620C260 560 420 660 700 610S1050 560 1200 620V900H0Z" fill="#2E1F86" opacity="0.65" />
      <path d="M0 720C300 660 560 760 800 710S1100 690 1200 720V900H0Z" fill="#1D1566" />
      <g fill="#0A0830" stroke="#0A0830"><path d={b.stem} fill="none" strokeWidth="4" strokeLinecap="round" /><path d={b.leaves} stroke="none" /></g>
      <g fill="#F4F0FD" stroke="#F4F0FD" opacity="0.85"><path d={b2.stem} fill="none" strokeWidth="3" strokeLinecap="round" /><path d={b2.leaves} stroke="none" /></g>
      <rect width="1200" height="900" filter={`url(#${u}g)`} opacity="0.6" style={{ mixBlendMode: "multiply" }} />
    </Frame>
  );
}



/** Constellation décorative : points reliés par des filets, nœuds dorés. */
export function Constellation({ className, count = 12, seed = 3 }: { className?: string; count?: number; seed?: number }) {
  const r = rng(seed);
  const pts = Array.from({ length: count }, (_, i) => ({ x: 30 + (i / (count - 1)) * 540 + (r() - 0.5) * 40, y: 40 + r() * 220 }));
  const path = pts.map((p, i) => `${i ? "L" : "M"}${f(p.x)} ${f(p.y)}`).join("");
  return (
    <svg viewBox="0 0 600 300" className={className} aria-hidden="true" fill="none">
      <path d={path} stroke="#B9A4F2" strokeWidth="1" opacity="0.45" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={f(p.x)} cy={f(p.y)} r={i % 4 === 0 ? 5 : 3} fill={i % 4 === 0 ? "#E8B26A" : "#F4F0FD"} />
          {i % 4 === 0 ? <circle cx={f(p.x)} cy={f(p.y)} r="12" stroke="#E8B26A" strokeOpacity="0.35" /> : null}
        </g>
      ))}
    </svg>
  );
}

/** Étoile à quatre branches dorée (signature graphique de l'image d'origine). */
export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="-12 -12 24 24" className={className} aria-hidden="true">
      <path d="M0 -11L2.4 -2.4L11 0L2.4 2.4L0 11L-2.4 2.4L-11 0L-2.4 -2.4Z" fill="#E8B26A" />
    </svg>
  );
}

/** Filet doré avec étoile centrale : séparateur. */
export function StarRule({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/70" />
      <Sparkle className="h-4 w-4" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/70" />
    </div>
  );
}
