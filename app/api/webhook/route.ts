import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
}

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Mercado Pago envia notificações de pagamento
    if (body.type === "payment" && body.data?.id) {
      // Busca detalhes do pagamento
      const pagamentoRes = await fetch(
        `https://api.mercadopago.com/v1/payments/${body.data.id}`,
        {
          headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
        }
      );
      const pagamento = await pagamentoRes.json();

      if (pagamento.status === "approved") {
        const { curso_slug, email_aluna } = pagamento.metadata || {};

        if (!email_aluna || !curso_slug) {
          console.warn("Webhook: metadata ausente no pagamento", body.data.id);
          return NextResponse.json({ ok: true });
        }

        const supabase = getAdminSupabase();
        const resend = getResend();

        // Busca a usuária pelo email
        const listResult = await supabase.auth.admin.listUsers();
        const users = listResult.data?.users ?? [];
        const usuario = users.find((u) => u.email === email_aluna);

        if (usuario) {
          // Verifica se compra já foi registrada (idempotência)
          const { data: compraExistente } = await supabase
            .from("compras")
            .select("id")
            .eq("pagamento_id", String(body.data.id))
            .single();

          if (!compraExistente) {
            // Registra a compra
            await supabase.from("compras").insert({
              usuario_id: usuario.id,
              curso_slug,
              status: "aprovado",
              pagamento_id: String(body.data.id),
            });

            // Envia e-mail de boas-vindas
            await resend.emails.send({
              from: "Floreer <ola@floreer.com.br>",
              to: email_aluna,
              subject: `Seu acesso ao ${nomeCurso(curso_slug)} está pronto ✦ Floreer`,
              html: emailBoasVindas(email_aluna, curso_slug),
            });
          }
        } else {
          console.warn("Webhook: usuária não encontrada para email", email_aluna);
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook erro:", error);
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}

function nomeCurso(slug: string): string {
  const nomes: Record<string, string> = {
    broto: "Broto",
    botao: "Botão",
    plena: "Plena",
    "flor-completa": "Flor Completa",
  };
  return nomes[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
}

const LINKS_WHATSAPP: Record<string, string[]> = {
  broto: [
    "https://chat.whatsapp.com/KUOJt71q22rLFiFbvWKBU0",
    "https://chat.whatsapp.com/GPpxohO0oDe8qEYxPthCRO",
  ],
  botao: [
    "https://chat.whatsapp.com/KUOJt71q22rLFiFbvWKBU0",
    "https://chat.whatsapp.com/FJh8NKNzG2R9KLo16glaAN",
  ],
  plena: [
    "https://chat.whatsapp.com/KUOJt71q22rLFiFbvWKBU0",
    "https://chat.whatsapp.com/LVPYjPf3cd65f9EHrlWpTS",
  ],
  "flor-completa": [
    "https://chat.whatsapp.com/KUOJt71q22rLFiFbvWKBU0",
    "https://chat.whatsapp.com/GPpxohO0oDe8qEYxPthCRO",
    "https://chat.whatsapp.com/FJh8NKNzG2R9KLo16glaAN",
    "https://chat.whatsapp.com/LVPYjPf3cd65f9EHrlWpTS",
  ],
};

const NOMES_GRUPOS: Record<string, string[]> = {
  broto: ["Floreer Comunidade", "Floreer Broto"],
  botao: ["Floreer Comunidade", "Floreer Botão"],
  plena: ["Floreer Comunidade", "Floreer Plena"],
  "flor-completa": ["Floreer Comunidade", "Floreer Broto", "Floreer Botão", "Floreer Plena"],
};

function emailBoasVindas(email: string, cursoSlug: string): string {
  const nome = nomeCurso(cursoSlug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://floreer.com.br";
  const links = LINKS_WHATSAPP[cursoSlug] || ["https://chat.whatsapp.com/KUOJt71q22rLFiFbvWKBU0"];
  const nomes = NOMES_GRUPOS[cursoSlug] || ["Floreer Comunidade"];

  const gruposHtml = links.map((link, i) => `
    <a href="${link}" style="display: block; background: #FAFAF8; border: 0.5px solid #E3DDD6; border-radius: 8px; padding: 12px 16px; text-decoration: none; color: #1A1815; font-size: 13px; margin-bottom: 8px;">
      <span style="color: #B8864A; margin-right: 8px;">💬</span>
      Entrar no grupo <strong>${nomes[i]}</strong>
    </a>
  `).join("");

  return `
    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #1A1815; background: #FAFAF8;">
      <p style="font-size: 16px; letter-spacing: 4px; margin-bottom: 32px; color: #1A1815;">FLOREER</p>
      <p style="font-size: 15px; margin-bottom: 12px;">Olá! Seja bem-vinda ✨</p>
      <p style="font-size: 14px; line-height: 1.7; color: #7A756E; margin-bottom: 28px;">
        Sua compra foi confirmada e seu acesso ao <strong style="color: #1A1815;">Curso ${nome}</strong> está liberado agora mesmo.
        Clique abaixo para entrar na plataforma e começar sua jornada.
      </p>
      <a href="${siteUrl}/aluno" style="display: inline-block; background: #1A1815; color: #FAFAF8; padding: 13px 30px; text-decoration: none; font-size: 12px; letter-spacing: 1.5px; border-radius: 4px; margin-bottom: 32px;">
        ACESSAR MEU CURSO
      </a>
      <div style="background: #F3F0EB; border-radius: 8px; padding: 18px 22px; font-size: 12px; color: #7A756E; line-height: 1.9; margin-bottom: 24px;">
        <strong style="color: #1A1815; display: block; margin-bottom: 4px;">Seus dados de acesso</strong>
        E-mail: ${email}<br/>
        Senha: a que você escolheu no cadastro<br/>
        Acesso: <a href="${siteUrl}/aluno" style="color: #B8864A;">${siteUrl}/aluno</a>
      </div>
      <p style="font-size: 13px; color: #1A1815; font-weight: bold; margin-bottom: 12px;">Entre na nossa comunidade no WhatsApp:</p>
      ${gruposHtml}
      <p style="font-size: 12px; color: #7A756E; line-height: 1.7; margin-top: 24px; margin-bottom: 24px;">
        Tem dúvidas? Responda este e-mail ou fale com a gente pelo Instagram <strong style="color: #1A1815;">@floreer_beleza</strong>.
      </p>
      <p style="font-size: 11px; color: #C0B8B0; border-top: 0.5px solid #E3DDD6; padding-top: 16px; margin-top: 8px;">
        Floreer · floreer.com.br
      </p>
    </div>
  `;
}
