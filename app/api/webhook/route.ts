import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

function getSupabase() {
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
          headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` },
        }
      );
      const pagamento = await pagamentoRes.json();

      if (pagamento.status === "approved") {
        const { curso_slug, email_aluna } = pagamento.metadata;
        const supabase = getSupabase();
        const resend = getResend();

        // Busca ou cria a aluna no banco
        let { data: usuario } = await supabase
          .from("usuarios")
          .select("id")
          .eq("email", email_aluna)
          .single();

        if (!usuario) {
          // Cria conta via Supabase Auth
          const { data: authData } = await supabase.auth.admin.createUser({
            email: email_aluna,
            email_confirm: true,
          });
          usuario = authData.user;
        }

        if (usuario) {
          // Registra a compra
          await supabase.from("compras").insert({
            usuario_id: usuario.id,
            curso_slug,
            status: "aprovado",
            pagamento_id: body.data.id,
          });

          // Envia e-mail de boas-vindas
          await resend.emails.send({
            from: "Floreer <ola@floreer.com.br>",
            to: email_aluna,
            subject: `Seu acesso ao ${curso_slug.charAt(0).toUpperCase() + curso_slug.slice(1)} está pronto ✦ Floreer`,
            html: emailBoasVindas(email_aluna, curso_slug),
          });
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook erro:", error);
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}

function emailBoasVindas(email: string, cursoSlug: string): string {
  const nomeCurso = cursoSlug.charAt(0).toUpperCase() + cursoSlug.slice(1);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://floreer.com.br";

  return `
    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #1A1815;">
      <p style="font-size: 18px; letter-spacing: 4px; margin-bottom: 32px;">FLOREER</p>
      <p style="font-size: 15px; margin-bottom: 12px;">Olá!</p>
      <p style="font-size: 14px; line-height: 1.7; color: #7A756E; margin-bottom: 24px;">
        Sua compra foi confirmada e seu acesso ao <strong style="color: #1A1815;">Curso ${nomeCurso}</strong>
        está liberado agora mesmo. Clique abaixo para entrar na plataforma e começar sua jornada.
      </p>
      <a href="${siteUrl}/aluno" style="display: inline-block; background: #1A1815; color: #FAFAF8; padding: 12px 28px; text-decoration: none; font-size: 12px; letter-spacing: 1px; border-radius: 4px; margin-bottom: 28px;">
        Acessar meu curso
      </a>
      <div style="background: #F3F0EB; border-radius: 8px; padding: 16px 20px; font-size: 12px; color: #7A756E; line-height: 1.8; margin-bottom: 24px;">
        <strong style="color: #1A1815;">Seus dados de acesso</strong><br/>
        E-mail: ${email}<br/>
        Senha: a que você criou no cadastro<br/>
        Plataforma: <a href="${siteUrl}/aluno" style="color: #B8864A;">${siteUrl}/aluno</a>
      </div>
      <p style="font-size: 11px; color: #C0B8B0; border-top: 0.5px solid #E3DDD6; padding-top: 16px;">
        Floreer · floreer.com.br · Se tiver dúvidas, responda este e-mail.
      </p>
    </div>
  `;
}
