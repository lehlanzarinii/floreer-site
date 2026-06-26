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
    const { cursoSlug, email, nome, senha } = await req.json();

    const isBundle = cursoSlug === "flor-completa";
    const curso = isBundle ? null : getCurso(cursoSlug);

    if (!isBundle && !curso) {
      return NextResponse.json({ erro: "Curso não encontrado" }, { status: 404 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://floreer.com.br";

    // Cria conta Supabase com email já confirmado
    if (email && senha) {
      const supabase = getAdminSupabase();
      const { error: createError } = await supabase.auth.admin.createUser({
        email,
        password: senha,
        user_metadata: { nome },
        email_confirm: true,
      });

      // Ignora erro de usuária já cadastrada
      if (createError && !createError.message.toLowerCase().includes("already")) {
        console.warn("Aviso ao criar usuária:", createError.message);
      }
    }

    // Monta dados do item
    const titulo = isBundle
      ? "Floreer — Flor Completa (Trilha Completa)"
      : `Floreer — Curso ${curso!.nome}`;
    const preco = isBundle ? florCompleta.preco / 100 : curso!.preco / 100;
    const desc = isBundle ? florCompleta.desc : curso!.desc;

    // Cria preferência no Mercado Pago
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
        payer: { email, name: nome },
        back_urls: {
          success: `${siteUrl}/checkout/sucesso?curso=${cursoSlug}`,
          failure: `${siteUrl}/checkout/${cursoSlug}`,
          pending: `${siteUrl}/checkout/sucesso?curso=${cursoSlug}&pendente=1`,
        },
        auto_return: "approved",
        notification_url: `${siteUrl}/api/webhook`,
        metadata: { curso_slug: cursoSlug, email_aluna: email, nome_aluna: nome },
        payment_methods: { installments: 6 },
      }),
    });

    const preference = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error("Erro Mercado Pago:", preference);
      return NextResponse.json({ erro: "Erro ao criar preferência de pagamento" }, { status: 500 });
    }

    return NextResponse.json({ initPoint: preference.init_point });
  } catch (error) {
    console.error("Erro checkout:", error);
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}
