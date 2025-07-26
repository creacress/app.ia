import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, message } = await req.json();

    if (!email || !message) {
      return NextResponse.json(
        { success: false, error: "Champs requis manquants." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

    await transporter.sendMail({
      from: `"Formulaire contact" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: "Nouveau message via le formulaire de contact",
      text: `Email: ${email}\n\nMessage:\n${message}`,
    });

    return NextResponse.json({ success: true, message: "Message envoyé avec succès." });
  } catch (err) {
    console.error("Erreur SMTP:", err);
    return NextResponse.json(
      { success: false, error: "Erreur lors de l'envoi du message." },
      { status: 500 }
    );
  }
}