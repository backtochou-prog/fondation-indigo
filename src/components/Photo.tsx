import Image from "next/image";

/**
 * Point d'entrée UNIQUE pour la photographie finale.
 * Déposer le fichier dans /public/photos puis passer src="/photos/xxx.jpg"
 * (ou renseigner l'URL dans l'admin). Sans src : la scène SVG temporaire s'affiche.
 */
export function Photo({ src, alt, fallback, className }: { src?: string; alt: string; fallback: React.ReactNode; className?: string }) {
  if (!src) return <div className={className} role="img" aria-label={alt}>{fallback}</div>;
  return (
    <div className={`relative ${className ?? ""}`}>
      <Image src={src} alt={alt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
    </div>
  );
}
