/**
 * Logo « cœur ailé couronné » — version vectorielle fidèle à l'image fournie par la fondation :
 * un arc doré, une couronne, un cœur violet traversé d'un ruban, deux ailes.
 * Source unique : utilisée par le composant React et par scripts/export-logo.ts (favicon, réseaux, impression).
 */
export type LogoVariant = "color" | "gold" | "mono-light" | "mono-dark";

const feather = (len: number, rot: number, w: number) => {
  // plume partant de (96,128) vers la gauche, courbée vers le haut
  const a = (rot * Math.PI) / 180;
  const tx = 96 + Math.cos(a) * len, ty = 128 + Math.sin(a) * len;
  const nx = -Math.sin(a), ny = Math.cos(a);
  const c1 = [96 + Math.cos(a) * len * 0.45 + nx * w * 1.2, 128 + Math.sin(a) * len * 0.45 + ny * w * 1.2];
  const c2 = [96 + Math.cos(a) * len * 0.5 - nx * w * 0.55, 128 + Math.sin(a) * len * 0.5 - ny * w * 0.55];
  const f = (n: number) => n.toFixed(1);
  return `M96 128Q${f(c1[0])} ${f(c1[1])} ${f(tx)} ${f(ty)}Q${f(c2[0])} ${f(c2[1])} 96 128Z`;
};

const wingFeathers = [
  feather(100, -148, 12), // plume haute, relevée vers l'extérieur
  feather(92, -163, 12),
  feather(80, -178, 11),
  feather(64, -193, 10),
];

export function logoMarkInner(variant: LogoVariant, id = "lg"): string {
  const gold = variant === "mono-dark" ? "#17105C" : variant === "mono-light" ? "#F4F0FD" : "#E8B26A";
  const mono = variant === "mono-light" || variant === "mono-dark";
  const lav = mono ? gold : "url(#" + id + "-wing)";
  const defs = mono
    ? ""
    : `<defs>
  <linearGradient id="${id}-heart" x1="0.2" y1="0" x2="0.8" y2="1"><stop offset="0" stop-color="#1D1AA8"/><stop offset="0.55" stop-color="#4A2BD0"/><stop offset="1" stop-color="#B24FEF"/></linearGradient>
  <linearGradient id="${id}-wing" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F4F0FD"/><stop offset="1" stop-color="#9C86E8"/></linearGradient>
  <linearGradient id="${id}-arc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E8B26A" stop-opacity="0.25"/><stop offset="0.5" stop-color="#E8B26A"/><stop offset="1" stop-color="#E8B26A" stop-opacity="0.25"/></linearGradient>
  <linearGradient id="${id}-rib" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7C5CE6"/><stop offset="1" stop-color="#D9CCFF"/></linearGradient>
</defs>`;
  const heartFill = mono ? "none" : `url(#${id}-heart)`;
  const arcStroke = mono ? gold : `url(#${id}-arc)`;
  const wingFill = mono ? "none" : "#1D1566";
  const wingsOne = wingFeathers.map((d) => `<path d="${d}" fill="${wingFill}" fill-opacity="${mono ? 0 : 0.92}" stroke="${lav}" stroke-width="1.6" stroke-linejoin="round"/>`).join("");
  const rib = mono ? "" : `<path d="M82 118C104 140 140 128 164 98C150 120 122 136 96 134Z" fill="url(#${id}-rib)" opacity="0.9"/>`;
  return `${defs}
<path d="M30 132C40 62 84 18 120 18C156 18 200 62 210 132" fill="none" stroke="${arcStroke}" stroke-width="1.6" stroke-linecap="round"/>
<path d="M120 4L122 14L132 16L122 18L120 28L118 18L108 16L118 14Z" fill="${gold}"/>
<path d="M98 66L103 46L111 56L120 40L129 56L137 46L142 66Z" fill="none" stroke="${gold}" stroke-width="2" stroke-linejoin="round"/>
<g>${wingsOne}</g>
<g transform="translate(240 0) scale(-1 1)">${wingsOne}</g>
<path d="M120 178C64 142 66 92 96 86C110 83 120 91 120 99C120 91 130 83 144 86C174 92 176 142 120 178Z" fill="${heartFill}" stroke="${gold}" stroke-width="2.2" stroke-linejoin="round"/>
${rib}`;
}

export const LOGO_VIEWBOX = "0 0 240 190";

export function logoSvg(variant: LogoVariant, id = "lg", bg?: string): string {
  const size = bg ? "0 0 240 240" : LOGO_VIEWBOX;
  const wrap = bg ? `<rect width="240" height="240" rx="48" fill="${bg}"/><g transform="translate(0 28)">` : "<g>";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${size}" fill="none">${wrap}${logoMarkInner(variant, id)}</g></svg>`;
}
