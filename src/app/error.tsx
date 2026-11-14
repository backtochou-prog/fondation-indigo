"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-night px-6 text-center">
      <div>
        <h1 className="t-h2">Un instant, quelque chose s'est mal passé.</h1>
        <button onClick={reset} className="btn btn-solid mt-8">Réessayer</button>
      </div>
    </main>
  );
}
