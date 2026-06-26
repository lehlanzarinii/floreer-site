import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const SLUGS_VALIDOS = ["broto", "botao", "plena"];

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;

  // Valida slug
  if (!SLUGS_VALIDOS.includes(slug)) {
    return NextResponse.json({ erro: "Curso inválido" }, { status: 400 });
  }

  // Pega o token de autorização do cookie de sessão Supabase
  const supabaseAnon = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          cookie: req.headers.get("cookie") || "",
        },
      },
    }
  );

  const { data: { session } } = await supabaseAnon.auth.getSession();

  if (!session) {
    return NextResponse.json({ erro: "Não autenticada" }, { status: 401 });
  }

  const supabase = getAdminSupabase();

  // Verifica se a aluna tem compra aprovada para este curso
  const { data: compras } = await supabase
    .from("compras")
    .select("curso_slug")
    .eq("usuario_id", session.user.id)
    .eq("status", "aprovado");

  const slugsComprados = compras?.flatMap((c) =>
    c.curso_slug === "flor-completa" ? ["broto", "botao", "plena"] : [c.curso_slug]
  ) || [];

  if (!slugsComprados.includes(slug)) {
    return NextResponse.json({ erro: "Sem acesso a este curso" }, { status: 403 });
  }

  // Gera URL assinada com validade de 1 hora
  const { data: signedData, error } = await supabase.storage
    .from("ebooks")
    .createSignedUrl(`${slug}.pdf`, 3600);

  if (error || !signedData?.signedUrl) {
    console.error("Erro ao gerar URL assinada:", error);
    return NextResponse.json({ erro: "Erro ao acessar arquivo" }, { status: 500 });
  }

  // Redireciona para a URL assinada
  return NextResponse.redirect(signedData.signedUrl);
}
