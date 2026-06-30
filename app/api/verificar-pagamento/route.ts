import { NextRequest, NextResponse } from "next/server";
import { processarCompra } from "../../../lib/processar-compra";

export const dynamic = "force-dynamic";

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

    // Mesma peca do webhook: libera o acesso E manda o e-mail (sempre juntos).
    const r = await processarCompra(paymentId, curso_slug, email_aluna);

    return NextResponse.json({
      status: "approved",
      processado: r.ok && !r.jaProcessado,
      jaProcessado: r.jaProcessado === true,
    });
  } catch (error) {
    console.error("Erro verificar-pagamento:", error);
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}
