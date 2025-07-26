"use client";
 
declare global {
  interface Window {
    dataLayer: any[];
  }
}
import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "true");
    setVisible(false);
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-ETZGPHCT13";
    script.async = true;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      // @ts-ignore
      window.dataLayer.push(args);
    }
    gtag("js", new Date());
    gtag("config", "G-ETZGPHCT13");
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "false");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-zinc-800 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-center sm:text-left">
        Ce site utilise Google Analytics pour améliorer l’expérience utilisateur. Souhaitez-vous l’activer ?
      </p>
      <div className="flex gap-2">
        <button
          onClick={decline}
          className="bg-zinc-600 hover:bg-zinc-700 text-sm px-3 py-1 rounded"
        >
          Refuser
        </button>
        <button
          onClick={accept}
          className="bg-indigo-600 hover:bg-indigo-500 text-sm px-3 py-1 rounded"
        >
          Accepter
        </button>
      </div>
    </div>
  );
}