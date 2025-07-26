

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaHome } from "react-icons/fa";

export default function SuiviPage() {
  const pathname = usePathname();
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map(segment =>
      segment
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );

  const pathLinks = segments.map((name, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/").toLowerCase().replace(/\s+/g, "-");
    return (
      <span key={href} className="flex items-center gap-1">
        <Link href={href} className="hover:text-indigo-400 transition">
          {name}
        </Link>
        {index < segments.length - 1 && <span className="text-indigo-500">→</span>}
      </span>
    );
  });

  return (
    <nav aria-label="Fil d’Ariane" className="text-base md:text-lg font-semibold mb-6 px-4">
      <div className="flex flex-wrap items-center gap-x-1.5 text-zinc-300">
        <Link href="/" className="flex items-center gap-1 hover:text-indigo-400 transition">
          <FaHome className="inline-block" />
          <span>Accueil</span>
        </Link>
        {segments.length > 0 && <span className="text-indigo-500">→</span>}
        {pathLinks}
      </div>
    </nav>
  );
}