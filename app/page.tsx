export const metadata = {
  title: "microgenie.app – Microservices IA du quotidien pour booster votre productivité",
  description: "Découvrez 6 outils IA simples et gratuits : résumé PDF, post LinkedIn, nettoyage Excel, fiches de révision, compression d’image, CV IA. Optimisez votre quotidien avec microgenie.app.",
  keywords: "IA, résumé PDF, LinkedIn, Excel, révision, compression image, CV automatique, microservices, microgenie.app",
  robots: "index, follow",
  openGraph: {
    title: "microgenie.app – Microservices IA du quotidien",
    description: "6 outils IA simples et gratuits pour améliorer votre productivité au quotidien.",
    url: "https://microgenie.app",
    siteName: "microgenie.app",
    images: [
      {
        url: "https://microgenie.app/futuriste-IA.webp",
        width: 1200,
        height: 630,
        alt: "microgenie.app - Microservices IA",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
};

import { FaFilePdf, FaLinkedin, FaImage, FaFileExcel, FaClipboardList, FaCompress, FaUserTie } from "react-icons/fa";
import AnimatedServiceCard from "@/components/AnimatedServiceCard";
import CookieConsent from "@/components/CookieConsent";
import { StructuredData, BreadcrumbGenerator } from "@/components/StructuredData";

export default function Home() {
  const services = [
    {
      name: "Résumé PDF",
      path: "/pdf-summary",
      description: "Générez un résumé clair et concis de vos documents PDF.",
      icon: <FaFilePdf />,
    },
    {
      name: "Compressor PDF",
      path: "/pdf-compressor",
      description: "Réduisez la taille de vos fichiers PDF sans perte de qualité.",
      icon: <FaCompress />,
    },
    {
      name: "Post LinkedIn",
      path: "/linkedin-post",
      description: "Créez des posts LinkedIn engageants en quelques secondes.",
      icon: <FaLinkedin />,
    },
    {
      name: "Convertisseur Image",
      path: "/convertisseur-images",
      description: "Convertissez vos images dans différents formats facilement.",
      icon: <FaImage />,
    },
    {
      name: "Nettoyage Excel",
      path: "/excel-cleaner",
      description: "Optimisez et nettoyez vos fichiers Excel rapidement.",
      icon: <FaFileExcel />,
    },
    {
      name: "Fiches Révision",
      path: "/revision-cards",
      description: "Créez des fiches de révision personnalisées pour vos études.",
      icon: <FaClipboardList />,
    },
    {
      name: "Compression Image",
      path: "/image-compressor",
      description: "Compressez vos images pour un chargement plus rapide.",
      icon: <FaCompress />,
    },
    {
      name: "CV Automatique",
      path: "/cv-generator",
      description: "Générez un CV professionnel en quelques clics avec IA.",
      icon: <FaUserTie />,
    },
  ];

  return (
    
    <main id="ia-microservices" className="min-h-screen bg-black text-white px-6 py-20 font-sans" aria-label="Liste des microservices IA proposés par microgenie.app">
      <CookieConsent />
      <BreadcrumbGenerator />
      <StructuredData
        type="WebSite"
        data={{
          name: "microgenie.app",
          url: "https://www.microgenie.app",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://www.microgenie.app/search?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-6 tracking-tight">
        Bienvenue sur <span className="text-indigo-400">microgenie.app</span>
      </h1>
      <p className="text-center text-gray-300 max-w-xl mx-auto mb-12">
        Des microservices IA utiles au quotidien. Gratuits, instantanés, simples.
      </p>
      <p className="text-center text-gray-400 max-w-2xl mx-auto mb-8">
        Enfin une application qui propose des outils PDF, de conversion d’images et d’optimisation sans publicité, sans redirection trompeuse, et surtout sans tracking. Chez <span className="text-indigo-400 font-semibold">microgenie.app</span>, vos données ne sont ni collectées ni revendues. Profitez d’une technologie IA performante et instantanée, dans un environnement simple, sécurisé et respectueux de votre vie privée.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {services.map((s) => (
          <AnimatedServiceCard
            key={s.name}
            name={s.name}
            href={s.path}
            description={s.description}
            icon={s.icon}
            aria-label={`Accéder au service ${s.name} - ${s.description}`}
            className="fade-in hover:shadow-indigo-500/50 hover:shadow-lg hover:border-indigo-400 border border-transparent rounded-lg transition-all duration-300"
          />
        ))}
      </div>
      <div className="text-center mt-12">
        <a
          href="/contact"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors duration-300"
          aria-label="Contactez-nous pour en savoir plus"
        >
          Contactez-nous pour en savoir plus
        </a>
      </div>
    </main>
  );
}
