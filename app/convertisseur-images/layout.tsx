export const metadata = {
    title: "Convertisseur d'images – microgenie.app",
    description: "Convertissez vos images dans plus de 10 formats modernes. Rapide, gratuit et sans perte de qualité.",
    keywords: "convertisseur image, image png, jpeg, webp, gif, tiff, avif, heif, convertisseur gratuit",
    robots: "index, follow",
    openGraph: {
      title: "Convertisseur d'images – microgenie.app",
      description: "Outil gratuit et rapide pour convertir vos images en PNG, JPEG, AVIF, et bien plus.",
      url: "https://microgenie.app/convertisseur-images",
      siteName: "microgenie.app",
      type: "website",
      images: [
        {
          url: "/og-image-convertisseur.jpg",
          width: 1200,
          height: 630,
          alt: "Interface de conversion d'image sur microgenie.app",
        },
      ],
    },
  };
  
  export default function ConvertisseurLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  }