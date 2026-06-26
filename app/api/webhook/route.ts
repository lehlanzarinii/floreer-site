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
  const nome = nomeCurs