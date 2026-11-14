// Captures d'écran de contrôle : NODE_PATH=<dossier avec playwright> node scripts/shots.cjs
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const errors = [];
  for (const [name, w, h] of [["d", 1440, 900], ["m", 390, 844]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    p.on("console", (m) => m.type() === "error" && errors.push(`${name} ${m.text()}`));
    p.on("pageerror", (e) => errors.push(`${name} PAGEERR ${e.message}`));
    for (const path of ["/", "/notre-histoire", "/nos-actions", "/nos-actions/accueil-doux", "/notre-impact", "/devenir-mecene", "/nous-rejoindre"]) {
      await p.goto("http://localhost:3100" + path, { waitUntil: "networkidle" });
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo({top:y,behavior:"instant"}); await new Promise(r => setTimeout(r, 120)); } window.scrollTo({top:0,behavior:"instant"}); });
      await p.waitForTimeout(700);
      const f = `/tmp/s-${name}-${path.replace(/\W+/g, "_") || "home"}.png`;
      await p.screenshot({ path: f, fullPage: true });
    }
    await ctx.close();
  }
  console.log(errors.length ? errors.join("\n") : "no console errors");
  await b.close();
})();
