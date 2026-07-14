import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Endpoint leve de "keep-alive": faz uma consulta trivial no banco só para
// manter o projeto Supabase ativo (evita a pausa automática do plano grátis).
export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
    await supabase.from("compras").select("id").limit(1);
    return NextResponse.json({ ok: true, ts: new Date().toISOString() });
  } catch (e) {
    console.error("ping: erro ao consultar Supabase:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
