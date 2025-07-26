

# 📚 microgenie.app – Plateforme IA multifonction

## ✅ Fonctionnalités déjà en place

### 🔍 Résumé de PDF
- Upload de fichier PDF via formulaire.
- Extraction de texte côté backend (FastAPI).
- Appel à l’API Mistral pour un résumé intelligent.
- Limitation gratuite à 10 000 caractères avec popup d’upsell.
- Traduction automatique en français.
- Export du résumé en **PDF** et **Markdown**.
- Historique local (localStorage) des résumés consultables.
- Détection automatique de langue.
- Analyse du ton du document (admin, académique...).
- Drag & Drop de fichiers, badge format, animations UI (Lottie, transitions).

### ✍️ Génération de posts LinkedIn
- Interface stylée et cohérente.
- Formulaire de rédaction pour générer un post à partir d’un thème ou idée.

---

## 🛠️ Ce qu’il reste à faire

### Frontend
- [ ] Ajouter la page **Nettoyage de fichiers Excel**.
- [ ] Ajouter la page **Génération de fiches de révision**.
- [ ] Ajouter la page **Compression d’image intelligente**.
- [ ] Ajouter la page **CV IA designé automatiquement**.
- [ ] Composants UI globaux (SectionCard, Button, Badge, etc.) à centraliser dans `/components/ui`.
- [ ] Amélioration responsive mobile/tablette.
- [ ] Ajout de l’authentification si besoin (plan gratuit / premium).
- [ ] Intégration possible de Stripe ou autre paiement.

### Backend Python (FastAPI)
- [ ] Sécurisation par clé API ou token JWT.
- [ ] Routes pour les autres modules à créer :
  - `/clean-excel`
  - `/generate-cv`
  - `/compress-image`
  - etc.

### SEO / App Marketing
- [ ] Ajouter `metadata` optimisée pour chaque page.
- [ ] Sitemaps / robots.txt.
- [ ] OpenGraph et favicon personnalisés.

---

## 🚀 Tech Stack

- **Frontend** : Next.js 15+, TypeScript, Tailwind CSS
- **Backend** : FastAPI (Python)
- **API IA** : Mistral API
- **Build** : Vercel (Frontend), VPS (Backend Python)

---

## 📂 Structure du projet

```
microgenie.app/
├── app/
│   ├── pdf-summary/
│   ├── linkedin-post/
│   ├── ...
├── components/
│   ├── ui/
├── public/
├── styles/
├── utils/
API-APP-AI/  ← backend FastAPI
```

---

## 👨‍💻 Auteur
Projet développé par [WebCressonTech](https://www.predint.fr) — 2025