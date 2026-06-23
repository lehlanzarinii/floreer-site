import { NextRequest, NextResponse } from "next/server";
import { getCurso } from "../../../lib/cursos";

export async function POST(req: NextRequest) {
  try {
    const { cursoSlug, email, nome } = await req.json();

    const curso = getCurso(cursoSlug);
    if (!curso) {
      return NextResponse.json({ erro: "Curso não encontrado" }, { status: 404 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Cria preferência no Mercado Pago
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        items: [
          {
            id: curso.slug,
            title: `Floreer — Curso ${curso.nome}`,
            description: curso.desc,
            quantity: 1,
            currency_id: "BRL",
            unit_price: curso.preco / 100, // em reais
          },
        ],
        payer: { email, name: nome },
        back_urls: {
          success: `${siteUrl}/checkout/sucesso?curso=${cursoSlug}`,
          failure: `${siteUrl}/checkout/falha`,
          pending: `${siteUrl}/checkout/pendente`,
        },
        auto_return: "approved",
        notification_url: `${siteUrl}/api/webhook`,
        metadata: { curso_slug: cursoSlug, email_aluna: email },
        payment_methods: {
          excluded_payment_types: [],
          installments: 12,
        },
      }),
    });

    const preference = await response.json();

    if (!response.ok) {
      console.error("Erro Mercado Pago:", preference);
      return NextResponse.json({ erro: "Erro ao criar preferência de pagamento" }, { status: 500 });
    }

    return NextResponse.json({
      preferenceId: preference.id,
      initPoint: preference.init_point, // URL de pagamento
    });
  } catch (error) {
    console.error("Erro checkout:", error);
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}
