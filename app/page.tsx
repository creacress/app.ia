export const metadata = {
  title: "microgenie.app – Microservices IA du quotidien",
  description: "6 outils IA simples et gratuits : résumé PDF, post LinkedIn, nettoyage Excel, fiches de révision, compression d’image, CV IA. Booste ta productivité.",
  keywords: "IA, résumé PDF, LinkedIn, Excel, révision, compression image, CV automatique, microservices, microgenie.app",
  robots: "index, follow",
};

import ServiceCard from "@/components/ServiceCard";

export default function Home() {
  const services = [
    { name: "Résumé PDF", path: "/pdf-summary" },
    { name: "Compressor PDF", path: "/pdf-compressor" },
    { name: "Post LinkedIn", path: "/linkedin-post" },
    { name: "Convertisseur Image", path: "/convertisseur-images" },
    { name: "Nettoyage Excel", path: "/excel-cleaner" },
    { name: "Fiches Révision", path: "/revision-cards" },
    { name: "Compression Image", path: "/image-compressor" },
    { name: "CV Automatique", path: "/cv-generator" },
  ];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20 font-sans">
      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-6 tracking-tight">
        Bienvenue sur <span className="text-indigo-400">microgenie.app</span>
      </h1>
      <p className="text-center text-gray-300 max-w-xl mx-auto mb-12">
        7 microservices IA utiles au quotidien. Gratuits, instantanés, simples.
      </p>
      <p className="text-center text-gray-400 max-w-2xl mx-auto mb-8">
        Enfin une application qui propose des outils PDF, de conversion d’images et d’optimisation sans publicité, sans redirection trompeuse, et surtout sans tracking. Chez <span className="text-indigo-400 font-semibold">microgenie.app</span>, vos données ne sont ni collectées ni revendues. Profitez d’une technologie IA performante et instantanée, dans un environnement simple, sécurisé et respectueux de votre vie privée.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {services.map((s) => (
          <ServiceCard key={s.name} name={s.name} href={s.path} />
        ))}
      </div>
    </main>
  );
}
