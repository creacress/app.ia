import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const mode = formData.get('mode') || 'image';

    const form = new FormData();
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        form.append(key, value);
      } else {
        form.append(key, value, value.name);
      }
    }

    form.append('mode', mode.toString());

    const res = await fetch('https://support.microgenie.app//pdf-compress', {
      method: 'POST',
      body: form,
    });

    const data = await res.json();

    const originalSize = data.originalSize;
    const compressedSize = data.compressedSize;
    const alert = data.alert;
    const gainPercent = data.gainPercent;

    if (!res.ok || !data?.url) {
      return NextResponse.json({ error: data?.error || 'Erreur compression.' }, { status: res.status });
    }

    return NextResponse.json({ url: data.url, originalSize, compressedSize, alert, gainPercent });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur côté proxy Next.js' }, { status: 500 });
  }
}