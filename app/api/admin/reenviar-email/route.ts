import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "floreer-admin-2026";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const LINKS_WHATSAPP: Record<string, string[]> = {
  broto: ["https://chat.whatsapp.com/KUOJt71q22rLFiFbvWKBU0", "https://chat.whatsapp.com/GPpxohO0oDe8qEYxPthCRO"],
  botao: ["https://chat.whatsapp.com/KUOJt71q22rLFiFbvWKBU0", "https://chat.whatsapp.com/FJh8NKNzG2R9KLo16glaAN"],
  plena: ["https://chat.whatsapp.com/KUOJt71q22rLFiFbvWKBU0", "https://chat.whatsapp.com/LVPYjPf3cd65f9EHrlWpTS"],
  "flor-completa": ["https://chat.whatsapp.com/KUOJt71q22rLFiFbvWKBU0", "https://chat.whatsapp.com/GPpxohO0oDe8qEYxPthCRO", "https://chat.whatsapp.com/FJh8NKNzG2R9KLo16glaAN", "https://chat.whatsapp.com/LVPYjPf3cd65f9EHrlWpTS"],
};

const NOMES_GRUPOS: Record<string, string[]> = {
  broto: ["Floreer Comunidade", "Floreer Broto"],
  botao: ["Floreer Comunidade", "Floreer Botao"],
  plena: ["Floreer Comunidade", "Floreer Plena"],
  "flor-completa": ["Floreer Comunidade", "Floreer Broto", "Floreer Botao", "Floreer Plena"],
};

const NOMES_CURSOS: Record<string, string> = {
  broto: "Broto", botao: "Botao", plena: "Plena", "flor-completa": "Flor Completa",
};

export async function POST(req: NextRequest) {
  const { email, cursoSlug, secret } = await req.json();

  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ erro: "Nao autorizado" }, { status: 401 });
  }

  if (!email || !cursoSlug) {
    return NextResponse.json({ erro: "email e cursoSlug sao obrigatorios" }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://floreer.com.br";
  const nome = NOMES_CURSOS[cursoSlug] || cursoSlug;
  const links = LINKS_WHATSAPP[cursoSlug] || ["https://chat.whatsapp.com/KUOJt71q22rLFiFbvWKBU0"];
  const nomes = NOMES_GRUPOS[cursoSlug] || ["Floreer Comunidade"];

  const gruposHtml = links.map((link, i) => `
    <a href="${link}" style="display:block;background:#FAFAF8;border:0.5px solid #E3DDD6;border-radius:8px;padding:12px 16px;text-decoration:none;color:#1A1815;font-size:13px;margin-bottom:8px;">
      Entrar no grupo ${nomes[i]}
    </a>
  `).join("");

  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px 20px;color:#1A1815;background:#FAFAF8;">
      <p style="font-size:16px;letter-spacing:4px;margin-bottom:32px;">FLOREER</p>
      <p style="font-size:15px;margin-bottom:12px;">Ola! Seja bem-vinda</p>
      <p style="font-size:14px;line-height:1.7;color:#7A756E;margin-bottom:28px;">
        Sua compra foi confirmada e seu acesso ao Curso ${nome} esta liberado agora mesmo.
      </p>
      <a href="${siteUrl}/aluno" style="display:inline-block;background:#1A1815;color:#FAFAF8;padding:13px 30px;text-decoration:none;font-size:12px;letter-spacing:1.5px;border-radius:4px;margin-bottom:32px;">
        ACESSAR MEU CURSO
      </a>
      <div style="background:#F3F0EB;border-radius:8px;padding:18px 22px;font-size:12px;color:#7A756E;line-height:1.9;margin-bottom:24px;">
        E-mail: ${email}<br/>
        Acesso: <a href="${siteUrl}/aluno" style="color:#B8864A;">${siteUrl}/aluno</a>
      </div>
      <p style="font-size:13px;color:#1A1815;font-weight:bold;margin-bottom:12px;">Entre na nossa comunidade no WhatsApp:</p>
      ${gruposHtml}
      <div style="background:#FFF8F0;border:0.5px solid #E3DDD6;border-radius:8px;padding:14px 18px;margin-top:16px;font-size:11px;color:#7A756E;line-height:1.7;">
        📬 <strong style="color:#1A1815;">Este email foi para Promocoes ou Spam?</strong><br/>
        Mova para sua Caixa de Entrada e clique em &quot;Nao e spam&quot; para garantir que voce receba todas as novidades da Floreer.
      </div>
      <p style="font-size:11px;color:#C0B8B0;border-top:0.5px solid #E3DDD6;padding-top:16px;margin-top:8px;">
        Floreer - floreer.com.br
      </p>
    </div>
  `;

  try {
    const resend = getResend();
    await resend.emails.send({
      from: "Floreer <ola@floreer.com.br>",
      to: email,
      subject: `Seu acesso ao Curso ${nome} esta pronto - Floreer`,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro ao reenviar email:", err);
    return NextResponse.json({ erro: "Erro ao enviar email" }, { status: 500 });
  }
}
