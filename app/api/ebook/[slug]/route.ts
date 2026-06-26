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

  if (!SLUGS_VALIDOS.includes(slug)) {
    return NextResponse.json({ erro: "Curso inválido" }, { status: 400 });
  }

  // Lê o token do header Authorization: Bearer <token>
  const authHeader = req.headers.get("authorization") || "";
  const accessToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!accessToken) {
    return NextResponse.json({ erro: "Não autenticada" }, { status: 401 });
  }

  const supabase = getAdminSupabase();

  // Verifica o token com admin client
  const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

  if (userError || !user) {
    return NextResponse.json({ erro: "Token inválido" }, { status: 401 });
  }

  // Verifica compra aprovada
  const { data: compras } = await supabase
    .from("compras")
    .select("curso_slug")
    .eq("usuario_id", user.id)
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

  // Retorna a URL assinada como JSON — o client carrega no iframe
  return NextResponse.json({ signedUrl: signedData.signedUrl });
}
