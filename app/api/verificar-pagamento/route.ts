import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

function getAdminSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
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
  try {
    const { paymentId } = await req.json();
    if (!paymentId) return NextResponse.json({ erro: "paymentId obrigatorio" }, { status: 400 });

    // Busca pagamento no MP
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
    });
    const pagamento = await mpRes.json();

    if (pagamento.status !== "approved") {
      return NextResponse.json({ status: pagamento.status });
    }

    const { curso_slug, email_aluna } = pagamento.metadata || {};
    if (!curso_slug || !email_aluna) {
      return NextResponse.json({ status: "approved", semMetadata: true });
    }

    const supabase = getAdminSupabase();

    // Verifica se já foi processado
    const { data: existente } = await supabase
      .from("compras")
      .select("id")
      .eq("pagamento_id", String(paymentId))
      .single();

    if (existente) {
      return NextResponse.json({ status: "approved", jaProcessado: true });
    }

    // Busca usuária
    const { data: listData } = await supabase.auth.admin.listUsers();
    const usuario = (listData?.users ?? []).find((u) => u.email === email_aluna);

    if (!usuario) {
      return NextResponse.json({ status: "approved", semUsuario: true });
    }

    // Insere compra
    await supabase.from("compras").insert({
      usuario_id: usuario.id,
      curso_slug,
      status: "aprovado",
      pagamento_id: String(paymentId),
    });

    // Envia email
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://floreer.com.br";
    const nome = NOMES_CURSOS[curso_slug] || curso_slug;
    const links = LINKS_WHATSAPP[curso_slug] || [];
    const nomes = NOMES_GRUPOS[curso_slug] || [];
    const gruposHtml = links.map((link, i) => `
      <a href="${link}" style="display:block;background:#FAFAF8;border:0.5px solid #E3DDD6;border-radius:8px;padding:12px 16px;text-decoration:none;color:#1A1815;font-size:13px;margin-bottom:8px;">
        Entrar no grupo ${nomes[i]}
      </a>`).join("");

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Floreer <ola@floreer.com.br>",
      to: email_aluna,
      subject: `Seu acesso ao Curso ${nome} esta pronto - Floreer`,
      html: `
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
            E-mail: ${email_aluna}<br/>
            Acesso: <a href="${siteUrl}/aluno" style="color:#B8864A;">${siteUrl}/aluno</a>
          </div>
          <p style="font-size:13px;color:#1A1815;font-weight:bold;margin-bottom:12px;">Entre na nossa comunidade no WhatsApp:</p>
          ${gruposHtml}
          <p style="font-size:11px;color:#C0B8B0;border-top:0.5px solid #E3DDD6;padding-top:16px;margin-top:8px;">
          <div style="background:#FFF8F0;border:0.5px solid #E3DDD6;border-radius:8px;padding:14px 18px;margin-bottom:16px;font-size:11px;color:#7A756E;line-height:1.7;">
            📬 <strong style="color:#1A1815;">Este email foi para Promocoes ou Spam?</strong><br/>
            Mova para sua Caixa de Entrada e clique em &quot;Nao e spam&quot; para garantir que voce receba todas as novidades da Floreer.
          </div>
          Floreer - floreer.com.br</p>
        </div>`,
    });

    return NextResponse.json({ status: "approved", processado: true });
  } catch (error) {
    console.error("Erro verificar-pagamento:", error);
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}
