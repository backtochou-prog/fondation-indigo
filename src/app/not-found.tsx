import Link from "next/link";
export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-night px-6 text-center">
      <div>
        <p className="t-eyebrow text-lavender">Page introuvable</p>
        <h1 className="t-h1 mt-4">Ce chemin ne mène nulle part.</h1>
        <p className="mx-auto mt-5 max-w-md">Mais votre place, elle, existe. Revenons à l'accueil.</p>
        <Link href="/" className="btn btn-solid mt-8">Retour à l'accueil</Link>
      </div>
    </main>
  );
}
