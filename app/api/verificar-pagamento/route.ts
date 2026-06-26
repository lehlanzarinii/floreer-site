import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getAdminSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
}

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

    // Se já foi processado (pelo webhook), só confirma
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

    // Insere compra (o webhook cuida do email — aqui só garante o acesso)
    await supabase.from("compras").insert({
      usuario_id: usuario.id,
      curso_slug,
      status: "aprovado",
      pagamento_id: String(paymentId),
    });

    return NextResponse.json({ status: "approved", processado: true });
  } catch (error) {
    console.error("Erro verificar-pagamento:", error);
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}
