import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
}

// Gera o link de "criar senha" para mostrar na tela de sucesso,
// SOMENTE se o pagamento estiver realmente aprovado (rede de seguranca:
// o acesso nao depende so do e-mail chegar).
export async function POST(req: NextRequest) {
  try {
    const { paymentId } = await req.json();
    if (!paymentId) {
      return NextResponse.json({ pronto: false });
    }

    const pagRes = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      { headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` } }
    );
    const pagamento = await pagRes.json();

    if (pagamento.status !== "approved") {
      return NextResponse.json({ pronto: false });
    }

    const email = pagamento?.metadata?.email_aluna;
    if (!email) {
      return NextResponse.json({ pronto: false });
    }

    const supabase = getAdminSupabase();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.floreer.com.br";

    // Garante que a conta existe (caso o webhook ainda nao tenha rodado).
    await supabase.auth.admin.createUser({ email, email_confirm: true });

    const { data: linkData } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo: `${siteUrl}/aluno/nova-senha` },
    });

    const link = linkData?.properties?.action_link || `${siteUrl}/aluno/login`;
    return NextResponse.json({ pronto: true, link });
  } catch (e) {
    console.error("link-acesso erro:", e);
    return NextResponse.json({ pronto: false });
  }
}
