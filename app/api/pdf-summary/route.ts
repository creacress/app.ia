export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { Buffer } from "buffer";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return new Response(JSON.stringify({ error: "No file provided." }), {
      status: 400,
    });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Envoi du PDF à l'API Flask distante pour extraction du texte
  let text = "";
  let isPartial = false;
  try {
    const formDataToSend = new FormData();
    formDataToSend.append("file", new Blob([buffer]), file.name);
    const extractRes = await fetch("https://support.microgenie.app/extract", {
      method: "POST",
      body: formDataToSend,
    });
    if (extractRes.status === 413) {
      return new Response(
        JSON.stringify({
          summary: "Le document est trop volumineux. Seuls les 10 000 premiers caractères ont été analysés.",
          partial: true,
          truncated: true,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!extractRes.ok) {
      throw new Error("Flask API non disponible");
    }
    const extractData = await extractRes.json();
    const FULL_TEXT = extractData.text || "Document vide.";
    isPartial = FULL_TEXT.length > 3000;
    text = FULL_TEXT.slice(0, 3000);
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erreur lors de l’analyse PDF (Flask API)." }), {
      status: 502,
    });
  }

  const mistralRes = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistral-small",
      messages: [
        {
          role: "system",
          content:
            "Tu es un assistant IA spécialisé dans la synthèse de documents. Ton rôle est de produire un résumé en français, structuré, fidèle au contenu original, et adapté au type de document. Analyse d'abord le type (ex : article, rapport, religieux, éducatif...) puis fournis un résumé organisé avec un titre, les idées principales, et si possible les conseils ou conclusions. Sois concis, clair et professionnel.",
        },
        {
          role: "user",
          content: "Merci de détecter le type de document et d’adapter ton résumé. Organise ton texte avec des paragraphes logiques, un ton cohérent, et une structure claire (titre, contenu, conseils si présents).",
        },
        {
          role: "user",
          content: `${text.length < 100 ? "Le document est très court. Essaie quand même de le résumer au mieux.\n\n" : ""}${text}`,
        },
      ],
    }),
  });

  const raw = await mistralRes.text();
  const json = JSON.parse(raw);
  const summary = json.choices?.[0]?.message?.content || "Aucun résumé généré.";

  return new Response(JSON.stringify({ summary, partial: isPartial, truncated: isPartial }), {
    headers: { "Content-Type": "application/json" },
  });
}