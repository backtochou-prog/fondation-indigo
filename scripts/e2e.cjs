// Tests de bout en bout : NODE_PATH=<dossier avec playwright> node scripts/e2e.cjs
const { chromium } = require("playwright");
const fs = require("fs");
const base = "http://localhost:3100";
const ok = (c, m) => console.log((c ? "PASS " : "FAIL ") + m);
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));

  // 1. liens de navigation
  await p.goto(base + "/", { waitUntil: "networkidle" });
  const hrefs = await p.$$eval("header nav a, footer a", (as) => [...new Set(as.map((a) => a.getAttribute("href")).filter((h) => h && h.startsWith("/")))]);
  for (const h of hrefs) { const r = await p.request.get(base + h.split("#")[0]); ok(r.status() === 200, `lien ${h} -> ${r.status()}`); }

  // 2. validation côté navigateur : formulaire vide
  await p.goto(base + "/nous-rejoindre", { waitUntil: "networkidle" });
  const f = p.locator("#contact form");
  await f.getByRole("button", { name: "Envoyer mon message" }).click();
  ok((await f.locator(".err").count()) >= 3, "formulaire vide : erreurs affichées");
  ok(await f.locator('[aria-invalid="true"]').first().evaluate((e) => e === document.activeElement), "focus sur le premier champ en erreur");

  // 3. envoi valide
  await f.getByLabel(/Votre prénom/).fill("Test");
  await f.getByLabel(/Votre e-mail/).fill("test@example.org");
  await f.getByLabel(/Votre message/).fill("Bonjour, ceci est un test.");
  await f.getByRole("checkbox").check();
  await f.getByRole("button", { name: "Envoyer mon message" }).click();
  await p.waitForSelector("#contact [role=status]");
  ok(true, "envoi valide : message de succès");
  const lines = fs.existsSync(".data/submissions.jsonl") ? fs.readFileSync(".data/submissions.jsonl", "utf8").trim().split("\n") : [];
  ok(lines.length === 1 && JSON.parse(lines[0]).kind === "contact", "demande enregistrée (repli fichier local)");

  // 4. validation serveur (contournement du navigateur)
  const post = (body, headers = {}) => p.request.post(base + "/api/submit", { data: body, headers });
  let r = await post({ kind: "contact", name: "x", email: "pas-un-mail", message: "m", consent: true });
  ok(r.status() === 422, "serveur : e-mail invalide -> 422");
  r = await post({ kind: "contact", name: "x", email: "a@b.fr", message: "m", consent: false });
  ok(r.status() === 422, "serveur : consentement absent -> 422");
  r = await post({ kind: "contact", name: "x", email: "a@b.fr", message: "m", consent: true, extra: "champ inattendu" });
  ok(r.status() === 422, "serveur : champ inattendu refusé -> 422");
  r = await post({ kind: "inconnu" }); ok(r.status() === 400, "serveur : formulaire inconnu -> 400");
  r = await post({ kind: "accueil_doux", name: "x", email: "a@b.fr", contact_pref: "pigeon", consent: true }); ok(r.status() === 422, "serveur : valeur de liste invalide -> 422");
  r = await post({ kind: "contact", name: "bot", email: "a@b.fr", message: "spam", consent: true, website: "http://spam" });
  ok(r.status() === 200 && fs.readFileSync(".data/submissions.jsonl", "utf8").trim().split("\n").length === 1, "pot de miel : accepté silencieusement, rien enregistré");
  r = await post({ kind: "contact", name: "x", email: "a@b.fr", message: "m", consent: true }, { Origin: "https://evil.example" });
  ok(r.status() === 403, "origine étrangère -> 403");

  // 5. limitation de débit (5 / 10 min / IP)
  let last = 0; for (let i = 0; i < 6; i++) { last = (await post({ kind: "newsletter", email: `n${i}@ex.org`, consent: true })).status(); }
  ok(last === 429, "limitation de débit : 429 après 5 envois");

  // 6. admin protégé
  const a = await p.request.get(base + "/admin", { maxRedirects: 0 }); ok(a.status() >= 300 && a.status() < 400, "/admin sans session -> redirection");
  const a2 = await p.request.get(base + "/admin/demandes", { maxRedirects: 0 }); ok(a2.status() >= 300 && a2.status() < 400, "/admin/demandes sans session -> redirection");

  // 7. menu mobile
  const m = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await m.goto(base + "/", { waitUntil: "networkidle" });
  await m.getByRole("button", { name: "Ouvrir le menu" }).click();
  ok(await m.locator("#menu-mobile").isVisible(), "menu mobile s'ouvre");
  await m.keyboard.press("Escape"); ok(!(await m.locator("#menu-mobile").isVisible()), "Échap ferme le menu");
  await m.getByRole("button", { name: "Ouvrir le menu" }).click();
  await m.locator("#menu-mobile").getByRole("link", { name: "Notre impact" }).click(); await m.waitForURL("**/notre-impact"); await m.waitForTimeout(400);
  ok(!(await m.locator("#menu-mobile").isVisible()), "navigation depuis le menu mobile");
  const overflow = await m.evaluate(() => document.documentElement.scrollWidth > window.innerWidth); ok(!overflow, "pas de défilement horizontal (mobile)");

  ok(errs.length === 0, "aucune erreur console : " + errs.join(" | "));
  await b.close();
})();
