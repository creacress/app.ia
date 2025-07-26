import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const form = new FormData();
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        form.append(key, value);
      } else {
        form.append(key, value, value.name);
      }
    }

    const res = await fetch('https://support.microgenie.app//excel-cleaner', {
      method: 'POST',
      body: form,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur côté proxy Next.js' }, { status: 500 });
  }
}