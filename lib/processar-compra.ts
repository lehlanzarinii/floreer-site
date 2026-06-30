import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Peca UNICA que processa uma compra aprovada: garante a conta, libera o
// acesso (insere a compra) E manda o e-mail de criar senha — SEMPRE juntos.
// Usada pelo webhook e pela verificacao na tela de sucesso, pra o e-mail
// nunca deixar de ser enviado, independente de quem confirma primeiro.

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
}

export async function processarCompra(
  paymentId: string | number,
  cursoSlug: string,
  emailAluna: string
): Promise<{ ok: boolean; jaProcessado?: boolean }> {
  const supabase = getAdminSupabase();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.floreer.com.br";

  // Trava anti-duplicata (o Mercado Pago/avisos podem chegar 2x).
  const { data: existente } = await supabase
    .from("compras")
    .select("id")
    .eq("pagamento_id", String(paymentId))
    .single();

  if (existente) return { ok: true, jaProcessado: true };

  // 1) Garante a conta da aluna (sem senha — ela cria depois).
  let usuario: { id: string; email?: string } | undefined;
  const { data: criada, error: createError } =
    await supabase.auth.admin.createUser({
      email: emailAluna,
      email_confirm: true,
    });

  if (criada?.user) {
    usuario = criada.user;
  } else {
    if (createError && !createError.message.toLowerCase().includes("already")) {
      console.warn("processarCompra: erro ao criar usuaria:", createError.message);
    }
    const { data: listData } = await supabase.auth.admin.listUsers();
    usuario = (listData?.users ?? []).find((u) => u.email === emailAluna);
  }

  if (!usuario) {
    console.warn("processarCompra: usuaria nao encontrada para", emailAluna);
    return { ok: false };
  }

  // 2) Libera o acesso ao curso.
  await supabase.from("compras").insert({
    usuario_id: usuario.id,
    curso_slug: cursoSlug,
    status: "aprovado",
    pagamento_id: String(paymentId),
  });

  // 3) Link de ativacao: aponta pra uma pagina intermediaria, a prova dos
  // robos de e-mail (o link de senha de uso unico so e gerado quando a aluna
  // clica no botao da pagina, e nao quando um robo abre o e-mail).
  const linkAtivar = `${siteUrl}/aluno/ativar?pid=${paymentId}`;

  // 4) Envia o e-mail de boas-vindas.
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Floreer <ola@floreer.com.br>",
      to: emailAluna,
      subject: `Compra confirmada — crie sua senha e acesse o Curso ${nomeCurso(cursoSlug)}`,
      html: emailBoasVindas(emailAluna, cursoSlug, linkAtivar),
    });
  } catch (e) {
    console.error("processarCompra: erro ao enviar e-mail:", e);
  }

  return { ok: true };
}

export function nomeCurso(slug: string): string {
  const nomes: Record<string, string> = {
    broto: "Broto", botao: "Botao", plena: "Plena", "flor-completa": "Flor Completa",
  };
  return nomes[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
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

function emailBoasVindas(email: string, cursoSlug: string, linkSenha: string): string {
  const nome = nomeCurso(cursoSlug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.floreer.com.br";
  const links = LINKS_WHATSAPP[cursoSlug] || ["https://chat.whatsapp.com/KUOJt71q22rLFiFbvWKBU0"];
  const nomes = NOMES_GRUPOS[cursoSlug] || ["Floreer Comunidade"];

  const gruposHtml = links.map((link, i) => `
    <a href="${link}" style="display:block;background:#FAFAF8;border:0.5px solid #E3DDD6;border-radius:8px;padding:12px 16px;text-decoration:none;color:#1A1815;font-size:13px;margin-bottom:8px;">
      Entrar no grupo ${nomes[i]}
    </a>
  `).join("");

  return `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px 20px;color:#1A1815;background:#FAFAF8;">
      <p style="font-size:16px;letter-spacing:4px;margin-bottom:32px;">FLOREER</p>
      <p style="font-size:15px;margin-bottom:12px;">Sua compra foi confirmada! 🌸</p>
      <p style="font-size:14px;line-height:1.7;color:#7A756E;margin-bottom:24px;">
        Seu acesso ao Curso ${nome} está garantido. Para entrar na área da aluna,
        crie a sua senha no botão abaixo:
      </p>
      <a href="${linkSenha}" style="display:inline-block;background:#1A1815;color:#FAFAF8;padding:13px 30px;text-decoration:none;font-size:12px;letter-spacing:1.5px;border-radius:4px;margin-bottom:14px;">
        CRIAR MINHA SENHA E ACESSAR
      </a>
      <p style="font-size:11px;color:#9A9188;margin-bottom:28px;">
        Se o botão não funcionar, acesse ${siteUrl}/aluno/login e clique em
        &quot;Esqueci minha senha&quot; usando este e-mail.
      </p>
      <div style="background:#F3F0EB;border-radius:8px;padding:18px 22px;font-size:12px;color:#7A756E;line-height:1.9;margin-bottom:24px;">
        Seu login (e-mail): <strong style="color:#1A1815;">${email}</strong><br/>
        Área da aluna: <a href="${siteUrl}/aluno/login" style="color:#B8864A;">${siteUrl}/aluno/login</a>
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
}
