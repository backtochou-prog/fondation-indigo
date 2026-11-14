import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero, Eyebrow, Ph } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { StoryScene, Constellation } from "@/components/scenes";
import { getSettings } from "@/lib/data";
import { founderStory, promise } from "@/lib/story";

export const metadata: Metadata = { title: "Notre histoire", description: "Une âme qui s'est toujours sentie différente décide de créer le lieu qu'elle aurait aimé trouver : Fondation Indigo, à Strasbourg." };
export const revalidate = 300;

/** Charte — Article 2. Texte d'origine de la fondation, repris tel quel (ne pas réécrire le fond). */
const pillars = [
  { t: "Pur et Authentique", d: "Nous disons vrai. Nous ne jouons pas un rôle. Nous accueillons avec le cœur, sans masque, sans promesse magique. Ce que nous ne savons pas, nous le disons. Ce que nous promettons, nous le faisons." },
  { t: "Sans Jugement", d: "Ici, on ne te demandera pas de couper tes ailes pour rentrer dans une case. Tu peux venir comme tu es. Fatigué, triste, perdu, en colère, en éveil. Tu es bienvenu." },
  { t: "Terre et Ciel", d: "Nous apprenons l'équilibre. Être relié au Ciel, aux étoiles, aux guides, aux anges, au Créateur, sans fuir la Terre. Être ancré, manger, dormir, travailler, aimer, tout en gardant sa lumière." },
  { t: "Dignité et Sécurité", d: "Chaque âme est protégée. Notre Ancre Psy, notre référente bienveillance, veille sur le cadre. Pas de dépendance. Pas de gourou. Pas de promesse de guérison. Juste un cadre sûr, humain, éthique." },
];

export default async function Histoire() {
  const s = await getSettings();
  return (
    <>
      <PageHero eyebrow="Qui sommes-nous ?" title={<>Le lieu que j'aurais <span className="em-serif text-lavender">aimé trouver</span>.</>} />

      {/* L'histoire, dans la voix originale */}
      <section className="pb-20 md:pb-32">
        <div className="wrap grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-24">
          <div className="space-y-8">
            {founderStory.map((p, i) => (
              <Reveal key={i}>
                <p className={`font-display leading-[1.3] text-star ${i === 0 ? "text-[clamp(1.9rem,3.4vw,2.8rem)]" : "text-[clamp(1.5rem,2.4vw,2.1rem)]"}`}>{p}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={150} className="lg:pt-4">
            <figure>
              {s.founder_photo_url ? (
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem_2rem_2rem_0.5rem]"><Image src={s.founder_photo_url} alt="Portrait de la fondatrice" fill sizes="(min-width:1024px) 30vw, 100vw" className="object-cover" /></div>
              ) : (
                <div className="overflow-hidden rounded-[2rem_2rem_2rem_0.5rem]"><StoryScene label="Paysage de brume — illustration temporaire" className="aspect-[4/5] w-full" /></div>
              )}
              <figcaption className="mt-4 text-sm text-mist/75">
                La fondatrice — <Ph value={s.founder_name} label="Nom à confirmer" />. <span className="opacity-80">Le portrait est facultatif.</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Pourquoi un tel lieu / Pourquoi Strasbourg */}
      <section className="on-dark relative overflow-hidden bg-indigo py-24 text-star md:py-32">
        <Constellation seed={14} className="absolute -left-12 bottom-0 w-[36rem] max-w-[95%] opacity-45" />
        <div className="wrap relative grid gap-14 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <Eyebrow className="text-lavender">Pourquoi Strasbourg ?</Eyebrow>
            <h2 className="t-h2 mt-5">Parce que c'est ici que j'ai compris que je n'étais pas seule.</h2>
          </Reveal>
          <Reveal delay={120} className="space-y-5 text-star/90">
            <p>À Strasbourg, comme partout, des personnes se sentent différentes depuis toujours. La fondatrice constate qu'elles n'ont, selon elle, aucun lieu où poser leur âme sans être jugées.</p>
            <p>Ce constat est le point de départ du projet. Il fait l'objet d'une vérification : nous recensons les lieux et les associations qui existent déjà, pour nous y relier plutôt que de les concurrencer.</p>
            <p><Link href="/notre-impact#besoin" className="link-u font-semibold">Voir les chiffres et leur statut de vérification</Link></p>
          </Reveal>
        </div>
      </section>

      {/* Mission & vision */}
      <section className="section">
        <div className="wrap grid gap-14 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <Eyebrow className="text-lavender">Notre mission</Eyebrow>
            <h2 className="t-h2 mt-5">Un monde où chacun a déjà sa place.</h2>
            <p className="mt-6">Créer un lieu d'accueil à Strasbourg où l'on peut être écouté, rencontrer d'autres personnes et s'exprimer par l'écriture, l'art, le souffle ou la nature — sans pression de changer.</p>
          </Reveal>
          <Reveal delay={120}>
            <Eyebrow className="text-lavender">Notre vision</Eyebrow>
            <p className="mt-5 font-display text-[clamp(1.8rem,3vw,2.5rem)] leading-tight text-star">« {promise.main} »</p>
            <p className="mt-6">Fondation Indigo est un espace complémentaire : un lieu d'écoute, de lien et de bien-être. Il ne remplace ni un suivi médical, ni un accompagnement psychologique, ni un traitement. Il n'établit aucun diagnostic.</p>
          </Reveal>
        </div>
      </section>

      {/* Charte — Article 2 */}
      <section id="charte" className="bg-night-2 section scroll-mt-20">
        <div className="wrap">
          <Reveal className="max-w-2xl">
            <Eyebrow className="text-lavender">Notre charte · Article 2</Eyebrow>
            <h2 className="t-h2 mt-5">Nos valeurs : nos 4 piliers.</h2>
          </Reveal>
          <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-lavender/25 bg-lavender/25 md:grid-cols-2">
            {pillars.map((v, i) => (
              <Reveal as="li" key={v.t} delay={i * 80} className="bg-night p-8 md:p-10">
                <p className="font-display text-5xl text-gold">{i + 1}</p>
                <h3 className="t-h3 mt-4">{v.t}</h3>
                <p className="mt-4 text-[1.02rem] leading-relaxed text-star/90">{v.d}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section text-center">
        <Reveal className="wrap-narrow">
          <h2 className="t-h2">L'avenir que nous voulons bâtir.</h2>
          <p className="mx-auto mt-6 max-w-xl">Un lieu stable, chaleureux, où l'on se retrouve autour d'une table. Étape après étape, avec transparence.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/nos-actions" className="btn btn-solid">Découvrir nos actions</Link>
            <Link href="/devenir-mecene" className="btn btn-line">Soutenir Indigo</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
