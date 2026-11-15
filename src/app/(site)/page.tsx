import Link from "next/link";
import Image from "next/image";
import { StoryScene, CercleScene, AteliersScene, AccueilScene, Constellation, StarRule } from "@/components/scenes";
import { Photo } from "@/components/Photo";
import { testimony } from "@/lib/testimony";
import { Reveal } from "@/components/Reveal";
import { ArrowLink, Eyebrow } from "@/components/ui";
import { StatsBlock } from "@/components/blocks";
import { getObjectives, getStats } from "@/lib/data";
import { founderStory, problemText, programs, promise } from "@/lib/story";

export const revalidate = 300;

const scenes = { cercle: CercleScene, ateliers: AteliersScene, accueil: AccueilScene } as const;

export default async function Home() {
  const [stats, objectives] = await Promise.all([getStats(), getObjectives()]);
  const keyObjectives = objectives.filter((o) => o.target).slice(0, 2);

  return (
    <>
      {/* 1 — HERO : l'image fournie par la fondation, puis la question */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
        <div className="relative min-h-[26rem] flex-1 md:min-h-[40rem] [mask-image:linear-gradient(to_bottom,black_52%,transparent_100%)]">
          <Image src="/brand/hero-indigo.jpg" alt="Un cœur ailé couronné d'or, au centre d'une galaxie indigo et violette" fill priority sizes="100vw" className="object-cover object-[50%_24%]" />
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-night/60 to-transparent" />
        </div>
        <div className="wrap relative -mt-20 pb-24 text-center anim-ascend md:-mt-20 md:pb-28">
          <h1 className="t-display mx-auto max-w-[27ch] !text-[clamp(2.3rem,4.6vw,4.2rem)]">Et si vous n'aviez plus besoin de vous cacher pour être <span className="em-serif text-lavender">vous-même</span> ?</h1>
          <p className="t-lead mx-auto mt-5 max-w-xl text-star/90">Un lieu pour se rencontrer, s'écouter et retrouver sa place.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/notre-histoire" className="btn btn-solid">Découvrir la Fondation</Link>
            <Link href="/devenir-mecene" className="btn btn-line">Soutenir notre mission</Link>
          </div>
          <StarRule className="mx-auto mt-12 max-w-md" />
          <p className="mt-4 font-display text-xl italic text-lavender">Votre âme a sa place.</p>
        </div>
      </section>

      {/* 2 — PHILOSOPHIE */}
      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-24">
          <Reveal><Eyebrow className="text-lavender">La promesse</Eyebrow></Reveal>
          <Reveal>
            <p className="font-display text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.04] text-star">« {promise.main} »</p>
            <p className="t-lead mt-10 max-w-xl">Il existe des personnes qui se sentent différentes depuis toujours. Fondation Indigo veut créer le lieu qu'elles auraient aimé trouver plus tôt : un endroit où l'on peut exister sans justifier sa sensibilité, sa personnalité ni sa singularité.</p>
          </Reveal>
        </div>
      </section>

      {/* 3 — HISTOIRE DE LA FONDATRICE */}
      <section className="bg-night-2">
        <div className="grid lg:grid-cols-2">
          <Photo alt="Paysage de brume et branches, illustration temporaire" fallback={<StoryScene className="h-full w-full" />} className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[44rem]" />
          <div className="flex items-center px-[1.25rem] py-16 md:px-16 lg:px-20 lg:py-28">
            <Reveal className="max-w-xl">
              <Eyebrow className="text-lavender">Qui sommes-nous ?</Eyebrow>
              <h2 className="t-h2 mt-5">Un lieu né d'une expérience personnelle.</h2>
              <div className="mt-8 space-y-5 font-display text-[1.55rem] leading-[1.35] text-star">
                <p>{founderStory[0]}</p>
                <p className="text-star/70">{founderStory[1].split(". ")[0]}.</p>
              </div>
              <div className="mt-9"><ArrowLink href="/notre-histoire" className="text-star">Lire l'histoire en entier</ArrowLink></div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3 bis — TÉMOIGNAGE DE LA FONDATRICE */}
      <section id="temoignage" className="section scroll-mt-20">
        <div className="wrap-narrow">
          <Reveal>
            <Eyebrow className="text-lavender">Témoignage de la fondatrice</Eyebrow>
            <p className="mt-4 text-sm text-mist/80">Ces mots sont ceux de la fondatrice, tirés de sa propre expérience. Ils ne constituent ni un enseignement ni une promesse pour les personnes qui viennent à la Fondation.</p>
          </Reveal>
          {testimony.map((stanza, i) => (
            <div key={i} className="mt-10">
              <p className="font-display text-[clamp(1.25rem,2vw,1.5rem)] italic leading-[1.55] text-star/95">
                {stanza.map((line) => <span key={line} className="block">{line}</span>)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4 — LE PROBLÈME */}
      <section className="on-dark section relative overflow-hidden bg-indigo text-star">
        <Constellation className="absolute -right-10 top-6 w-[38rem] max-w-[95%] opacity-60" />
        <div className="wrap relative">
          <Reveal className="max-w-3xl">
            <Eyebrow className="text-lavender">Pourquoi ?</Eyebrow>
            <h2 className="t-h2 mt-5">On leur a dit : « Rentre dans la case. »</h2>
            <p className="t-lead mt-8 text-star/90">{problemText.intro} {problemText.lines.join(" ")}</p>
            <p className="mt-6 text-star/85">{problemText.result} {problemText.close}</p>
          </Reveal>
          <div className="mt-16"><StatsBlock stats={stats} tone="dark" /></div>
          <p className="mt-10 max-w-2xl text-sm text-star/75">Chiffres du projet d'origine, en cours de vérification : <Link href="/notre-impact#besoin" className="link-u font-semibold">voir les sources et leur statut</Link>.</p>
        </div>
      </section>

      {/* 5 — LES TROIS PROGRAMMES */}
      <section className="section">
        <div className="wrap">
          <Reveal className="max-w-2xl">
            <Eyebrow className="text-lavender">Quoi ? La solution</Eyebrow>
            <h2 className="t-h2 mt-5">Trois portes, à votre rythme.</h2>
          </Reveal>
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {programs.map((p, i) => {
              const Scene = scenes[p.id as keyof typeof scenes];
              return (
                <Reveal key={p.id} delay={i * 130} className={i === 1 ? "md:mt-16" : i === 2 ? "md:mt-6" : ""}>
                  <Link href={p.href} className="group block">
                    <div className="overflow-hidden rounded-[2rem_2rem_2rem_0.5rem]">
                      <Scene label={`${p.name} — illustration`} className="aspect-[4/5] w-full transition-transform duration-[1200ms] ease-[var(--ease-calm)] group-hover:scale-[1.04]" />
                    </div>
                    <p className="mt-6 font-display text-lg text-lavender">{p.n}</p>
                    <h3 className="t-h3 mt-1">{p.name}</h3>
                    <p className="mt-3 text-[0.97rem]">{p.tagline}</p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gold">{p.facts.join(" · ")}</p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6 — NOTRE PROMESSE */}
      <section className="relative overflow-hidden bg-indigo-deep py-24 md:py-36">
        <Constellation seed={9} count={9} className="absolute -left-10 bottom-0 w-[40rem] max-w-[95%] opacity-40" />
        <div className="wrap relative">
          <Eyebrow className="text-star">Notre promesse</Eyebrow>
          <ul className="mt-8 grid gap-1">
            {promise.rules.map((r, i) => (
              <Reveal as="li" key={r} delay={i * 110} className={`font-display text-[clamp(2.4rem,7vw,6rem)] leading-[1.02] text-star ${i === 3 ? "em-serif mt-4 !text-gold" : ""}`}>{r}</Reveal>
            ))}
          </ul>
          <div className="mt-12"><ArrowLink href="/notre-histoire#charte" className="text-star">Lire notre charte : nos 4 piliers</ArrowLink></div>
        </div>
      </section>

      {/* 7 — IMPACT ET OBJECTIFS */}
      <section className="section">
        <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <Reveal>
            <Eyebrow className="text-lavender">Impact et objectifs</Eyebrow>
            <h2 className="t-h2 mt-5">Ce que nous visons, et ce que nous prouverons.</h2>
            <p className="mt-6 max-w-md">Les objectifs sont des cibles. Les résultats réalisés n'apparaîtront qu'une fois constatés, dans des rapports publics.</p>
            <div className="mt-8"><ArrowLink href="/notre-impact" className="text-star">Voir l'impact et la transparence</ArrowLink></div>
          </Reveal>
          <Reveal delay={150}>
            <dl className="grid gap-8 sm:grid-cols-2">
              {keyObjectives.map((o) => (
                <div key={o.label} className="border-t border-lavender/25 pt-5">
                  <dt className="text-sm font-semibold text-lavender">Objectif · {o.label}</dt>
                  <dd className="mt-2 font-display text-6xl text-star">{o.target}</dd>
                  <dd className="mt-1 text-sm text-mist/75">{o.unit}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* 8 — MÉCÉNAT */}
      <section className="relative overflow-hidden bg-indigo py-20 md:py-28">
        <Constellation seed={5} count={8} className="absolute -right-8 top-0 w-[34rem] max-w-[90%] opacity-35" />
        <div className="wrap relative grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <Eyebrow className="text-star">Devenir mécène</Eyebrow>
            <h2 className="t-h2 mt-5 max-w-2xl">Avant les chiffres, il y a une personne. Et toutes celles qui lui ressemblent.</h2>
            <p className="mt-6 max-w-xl text-mist">Découvrez l'histoire, le besoin, la solution — puis le budget de démarrage sur six mois, poste par poste : vous saurez où va chaque euro.</p>
          </Reveal>
          <Reveal delay={150} className="lg:justify-self-end">
            <div className="flex flex-wrap gap-3">
              <Link href="/devenir-mecene" className="btn btn-solid">Soutenir Indigo</Link>
              <Link href="/devenir-mecene#budget" className="btn btn-line !text-star">Voir le budget</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 9 — APPEL FINAL */}
      <section className="on-dark relative isolate overflow-hidden bg-indigo-deep py-28 text-center text-star md:py-40">
        <div className="wrap-narrow">
          <Reveal>
            <p className="font-display text-[clamp(2.6rem,6.5vw,5.4rem)] leading-[1.02]"><span className="em-serif text-gold">Bienvenue</span> chez toi.</p>
            <p className="mx-auto mt-8 max-w-md text-star/85">Vous n'avez rien à prouver ni à expliquer. Si vous n'osez pas encore venir en groupe, commencez par un rendez-vous d'écoute de 45 minutes, gratuit.</p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/nos-actions/accueil-doux" className="btn btn-light">Demander un Accueil Doux</Link>
              <Link href="/nous-rejoindre" className="btn btn-line-light">Trouver ma place</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
