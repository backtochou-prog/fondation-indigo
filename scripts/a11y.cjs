const { chromium } = require("playwright");
const { AxeBuilder } = require("@axe-core/playwright");
(async () => {
  const b = await chromium.launch(); const seen = {};
  for (const [n, w, h] of [["bureau", 1280, 900], ["mobile", 390, 844]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce" }); const p = await ctx.newPage();
    for (const path of ["/", "/notre-histoire", "/nos-actions", "/nos-actions/accueil-doux", "/notre-impact", "/devenir-mecene", "/nous-rejoindre", "/mentions-legales", "/confidentialite", "/cookies", "/admin/login"]) {
      await p.goto("http://localhost:3100" + path, { waitUntil: "networkidle" });
      await p.evaluate(() => document.querySelectorAll(".rise").forEach((e) => e.classList.add("in")));
      await p.waitForTimeout(1200);
      const r = await new AxeBuilder({ page: p }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      for (const v of r.violations) for (const node of v.nodes) { const k = `${v.id} | ${node.target.join(" ")} | ${(node.any[0]?.message || "").slice(0, 110)}`; (seen[k] ||= []).push(`${n}${path}`); }
    }
  }
  const keys = Object.keys(seen); console.log(keys.length ? keys.map((k) => `${k}\n    ↳ ${[...new Set(seen[k])].slice(0, 3).join(", ")}`).join("\n") : "AUCUNE violation axe (WCAG 2.1 AA)");
  await b.close();
})();
