import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const { nome, email, mensagem } = await req.json();

  if (!nome || !email || !mensagem) {
    return NextResponse.json({ error: "Campos obrigatórios" }, { status: 400 });
  }

  // Salvar no Supabase
  await supabase.from("mensagens").insert({ nome, email, mensagem });

  // Enviar email de notificação
  await resend.emails.send({
    from: "Floreer <onboarding@resend.dev>",
    to: "floreer.beleza@gmail.com",
    subject: `Nova mensagem de contato — ${nome}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1A1815; font-weight: normal; margin-bottom: 24px;">Nova mensagem via floreer.com.br</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #8A8078; font-size: 12px; width: 80px;">Nome</td>
            <td style="padding: 10px 0; color: #1A1815; font-size: 14px;">${nome}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #8A8078; font-size: 12px;">E-mail</td>
            <td style="padding: 10px 0; color: #1A1815; font-size: 14px;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #8A8078; font-size: 12px; vertical-align: top;">Mensagem</td>
            <td style="padding: 10px 0; color: #1A1815; font-size: 14px; line-height: 1.6;">${mensagem}</td>
          </tr>
        </table>
        <p style="margin-top: 32px; color: #8A8078; font-size: 11px;">Floreer · floreer.com.br</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
