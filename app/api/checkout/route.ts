import { NextRequest, NextResponse } from "next/server";
import { getCurso, florCompleta } from "../../../lib/cursos";
import { createClient } from "@supabase/supabase-js";

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
}

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

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.floreer.com.br";

    // Trava: nao deixa comprar de novo um curso que esse e-mail JA tem.
    try {
      const supabase = getAdminSupabase();
      const { data: listData } = await supabase.auth.admin.listUsers();
      const usuario = (listData?.users ?? []).find((u) => u.email === email);
      if (usuario) {
        const { data: comprasData } = await supabase
          .from("compras")
          .select("curso_slug")
          .eq("usuario_id", usuario.id)
          .eq("status", "aprovado");

        const tem = new Set<string>();
        (comprasData ?? []).forEach((c: { curso_slug: string }) => {
          if (c.curso_slug === "flor-completa") {
            tem.add("flor-completa"); tem.add("broto"); tem.add("botao"); tem.add("plena");
          } else {
            tem.add(c.curso_slug);
          }
        });

        if (tem.has(cursoSlug)) {
          return NextResponse.json(
            { erro: "Voce ja tem esse curso.", jaTemCurso: true },
            { status: 409 }
          );
        }
      }
    } catch (e) {
      // Se a checagem falhar, nao trava a venda — apenas registra.
      console.warn("checkout: nao foi possivel checar curso ja comprado:", e);
    }

    const titulo = isBundle
      ? "Floreer - Flor Completa (Trilha Completa)"
      : `Floreer - Curso ${curso!.nome}`;
    const preco = isBundle ? florCompleta.preco / 100 : curso!.preco / 100;
    const desc = isBundle ? florCompleta.desc : curso!.desc;

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
