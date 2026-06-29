import { NextRequest, NextResponse } from "next/server";
import { getCurso, florCompleta } from "../../../lib/cursos";

export async function POST(req: NextRequest) {
  try {
    const { cursoSlug, email } = await req.json();

    if (!email) {
      return NextResponse.json({ erro: "Informe um e-mail" }, { status: 400 });
    }

    const isBundle = cursoSlug === "flor-completa";
    const curso = isBundle ? null : getCurso(cursoSlug);

    if (!isBundle && !curso) {
      return NextResponse.json({ erro: "Curso nao encontrado" }, { status: 404 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://floreer.com.br";

    const titulo = isBundle
      ? "Floreer - Flor Completa (Trilha Completa)"
      : `Floreer - Curso ${curso!.nome}`;
    const preco = isBundle ? florCompleta.preco / 100 : curso!.preco / 100;
    const desc = isBundle ? florCompleta.desc : curso!.desc;

    // A conta da aluna NÃO é criada aqui. Quem cria a conta e libera o acesso
    // é o webhook, DEPOIS do pagamento aprovado (checkout enxuto = mais vendas).
    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        items: [
          {
            id: cursoSlug,
            title: titulo,
            description: desc,
            quantity: 1,
            currency_id: "BRL",
            unit_price: preco,
          },
        ],
        payer: { email },
        back_urls: {
          success: `${siteUrl}/checkout/sucesso?curso=${cursoSlug}`,
          failure: `${siteUrl}/checkout/${cursoSlug}`,
          pending: `${siteUrl}/checkout/sucesso?curso=${cursoSlug}&pendente=1`,
        },
        auto_return: "approved",
        notification_url: `${siteUrl}/api/webhook`,
        metadata: { curso_slug: cursoSlug, email_aluna: email },
        payment_methods: { installments: 6 },
      }),
    });

    const preference = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error("Erro Mercado Pago:", preference);
      return NextResponse.json({ erro: "Erro ao criar preferencia de pagamento" }, { status: 500 });
    }

    return NextResponse.json({ initPoint: preference.init_point });
  } catch (error) {
    console.error("Erro checkout:", error);
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}
