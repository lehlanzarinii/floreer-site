import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { processarCompra } from "../../../lib/processar-compra";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: any;

  try {
    body = await req.json();
  } catch {
    // MP às vezes envia como query params em vez de JSON
    const url = new URL(req.url);
    const topic = url.searchParams.get("topic");
    const id = url.searchParams.get("id") || url.searchParams.get("data.id");
    body = { type: topic === "payment" ? "payment" : topic, data: { id } };
  }

  // Responde 200 imediatamente para o MP não retentar
  waitUntil(processarPagamento(body));
  return NextResponse.json({ ok: true });
}

async function processarPagamento(body: any) {
  try {
    const paymentId = body?.data?.id;
    const tipo = body?.type || body?.action?.split(".")?.[0];

    if (tipo !== "payment" || !paymentId) return;

    const pagamentoRes = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      { headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` } }
    );
    const pagamento = await pagamentoRes.json();

    if (pagamento.status !== "approved") return;

    const { curso_slug, email_aluna } = pagamento.metadata || {};
    if (!email_aluna || !curso_slug) {
      console.warn("Webhook: metadata ausente no pagamento", paymentId);
      return;
    }

    await processarCompra(paymentId, curso_slug, email_aluna);
    console.log("Webhook: compra processada para", email_aluna, curso_slug);
  } catch (error) {
    console.error("Webhook processarPagamento erro:", error);
  }
}
