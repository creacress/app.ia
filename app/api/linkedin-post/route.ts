import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { input, tone } = await req.json();

  if (!input || input.trim().length === 0) {
    return NextResponse.json({ error: 'Texte requis' }, { status: 400 });
  }

  try {
    const prompts: Record<string, string> = {
      professionnel: "Tu es un expert en communication digitale. Tu rédiges des posts LinkedIn clairs, professionnels et factuels, adaptés à un public business.",
      fun: "Tu es un copywriter créatif. Tu rédiges des posts LinkedIn légers, drôles et engageants, avec une touche d’humour.",
      provocateur: "Tu es un stratège en communication virale. Tu rédiges des posts LinkedIn provocateurs, qui suscitent le débat et l’engagement.",
      humain: "Tu es un conseiller en communication authentique. Tu rédiges des posts LinkedIn sincères, vulnérables et profondément humains.",
    };
    const systemPrompt = prompts[tone] ?? prompts["professionnel"];

    const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-medium',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: `Voici le contexte fourni par l'utilisateur pour générer un post :\n${input}`,
          }
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!mistralResponse.ok) {
      return NextResponse.json({ error: 'Erreur Mistral' }, { status: 500 });
    }

    const { choices } = await mistralResponse.json();
    const output = choices?.[0]?.message?.content;

    return NextResponse.json({ output });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}