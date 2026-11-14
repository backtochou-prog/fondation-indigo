// node --experimental-strip-types scripts/export-logo.ts
import { writeFileSync, mkdirSync } from "node:fs";
import { logoSvg } from "../src/lib/logo-geometry.ts";

mkdirSync("public/brand", { recursive: true });
writeFileSync("public/brand/indigo-mark-color.svg", logoSvg("color", "a"));
writeFileSync("public/brand/indigo-mark-gold-mono.svg", logoSvg("gold", "b").replace(/<defs>[\s\S]*?<\/defs>/, ""));
writeFileSync("public/brand/indigo-mark-mono-light.svg", logoSvg("mono-light", "c"));
writeFileSync("public/brand/indigo-mark-mono-dark.svg", logoSvg("mono-dark", "d"));
writeFileSync("public/brand/indigo-social.svg", logoSvg("color", "e", "#0A0830"));
writeFileSync("src/app/icon.svg", logoSvg("color", "f", "#0A0830"));
console.log("logo exported");
