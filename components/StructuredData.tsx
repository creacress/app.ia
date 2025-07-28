"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

//////////////////////////////////////////////////////
// ✅ 1. Composant générique StructuredData
//////////////////////////////////////////////////////

interface StructuredDataProps {
  type: "WebSite" | "WebPage" | "Product" | "BreadcrumbList";
  data: Record<string, any>;
}

const StructuredData = ({ type, data }: StructuredDataProps) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <Script
      id={`structured-data-${type.toLowerCase()}`}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd, null, 2),
      }}
    />
  );
};

//////////////////////////////////////////////////////
// ✅ 2. Composant BreadcrumbGenerator (auto par URL)
//////////////////////////////////////////////////////

const BreadcrumbGenerator = () => {
  const pathname = usePathname();
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, i, arr) => ({
      "@type": "ListItem",
      position: i + 1,
      name: decodeURIComponent(segment.replace(/-/g, " ")),
      item: `https://www.microgenie.app/${arr.slice(0, i + 1).join("/")}`,
    }));

  return (
    <Script
      id="structured-data-breadcrumbs"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Accueil",
              item: "https://www.microgenie.app/",
            },
            ...segments.map((s, i) => ({
              ...s,
              position: i + 2,
            })),
          ],
        }),
      }}
    />
  );
};

export { StructuredData, BreadcrumbGenerator };