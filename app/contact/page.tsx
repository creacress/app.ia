import ContactForm from "../../components/ContactForm";
import SuiviPage from "@/components/SuiviPage";

export const metadata = {
  title: "Contact – microgenie.app",
  description: "Besoin d'aide ou de nous contacter ? Retrouvez ici toutes les informations utiles pour réclamations, support ou collaboration.",
};

export default function ContactPage() {
  return (
      <main className="min-h-screen bg-black text-white px-6 py-20 font-sans relative">
        <SuiviPage />
      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-6 tracking-tight">
        Contact & Support
      </h1>
      <p className="text-center text-gray-300 max-w-2xl mx-auto mb-12">
        Une question ? Une réclamation ? Une suggestion ? Nous sommes là pour vous aider à tirer le meilleur parti de <span className="text-indigo-400 font-semibold">microgenie.app</span>.
      </p>

      <section className="max-w-3xl mx-auto mb-16">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-400">Qui sommes-nous ?</h2>
        <p className="text-gray-400 leading-relaxed">
          microgenie.app est une plateforme proposant des outils IA gratuits et pratiques pour simplifier votre quotidien : résumé PDF, nettoyage Excel, conversion d’images, création de CV, etc.
        </p>
        <p className="text-gray-400 mt-4 leading-relaxed">
          Notre mission est de rendre l'intelligence artificielle accessible à tous, sans publicité, sans collecte de données, et sans frais cachés.
        </p>
      </section>

      <section className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-400">Nous écrire</h2>
        <ContactForm />
      </section>

      <section className="max-w-3xl mx-auto mt-16 text-gray-400 text-sm">
        <h2 className="text-lg font-semibold mb-2 text-indigo-400">Informations pratiques</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Support : <a href="mailto:support@microgenie.app" className="text-indigo-300 underline hover:text-indigo-400">contact@webcresson.com</a></li>
          <li>Collaborations & partenariats : <a href="mailto:hello@microgenie.app" className="text-indigo-300 underline hover:text-indigo-400">contact@webcresson.com</a></li>
          <li>Temps de réponse : sous 48h ouvrées</li>
          <li>Suivez-nous sur <a href="https://www.linkedin.com/in/alexis-cresson/" target="_blank" rel="noopener noreferrer" className="text-indigo-300 underline hover:text-indigo-400">Linkedin</a></li>
        </ul>
      </section>
    </main>
  );
}