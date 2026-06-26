"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../../lib/supabase";
import { getCurso } from "../../../../lib/cursos";

export default function CursoConteudoPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const curso = getCurso(slug);

  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pdfSignedUrl, setPdfSignedUrl] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [concluido, setConcluido] = useState(false);
  const [marcando, setMarcando] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let blobUrl: string | null = null;

    async function verificarECarregarPdf() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/aluno/login"); return; }
      setUserId(session.user.id);

      const { data: compras } = await supabase
        .from("compras")
        .select("curso_slug")
        .eq("usuario_id", session.user.id)
        .eq("status", "aprovado");

      const slugs = compras?.flatMap((c) =>
        c.curso_slug === "flor-completa" ? ["broto", "botao", "plena"] : [c.curso_slug]
      ) || [];

      if (!slugs.includes(slug)) {
        router.push("/aluno");
        return;
      }

      // Verifica se ja foi concluido
      const { data: conclusao } = await supabase
        .from("conclusoes")
        .select("id")
        .eq("usuario_id", session.user.id)
        .eq("curso_slug", slug)
        .single();
      if (conclusao) setConcluido(true);

      // Busca URL assinada
      const res = await fetch(`/api/ebook/${slug}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) {
        setErro("Nao foi possivel carregar o material. Tente novamente.");
        setCarregando(false);
        return;
      }

      const { signedUrl } = await res.json();
      setPdfSignedUrl(signedUrl);

      // Baixa como blob para exibir inline (evita download forcado)
      try {
        const pdfRes = await fetch(signedUrl);
        const blob = await pdfRes.blob();
        blobUrl = URL.createObjectURL(blob);
        setPdfBlobUrl(blobUrl);
      } catch {
        setPdfBlobUrl(signedUrl);
      }

      setCarregando(false);
    }

    verificarECarregarPdf();
    return () => { if (blobUrl) URL.revokeObjectURL(blobUrl); };
  }, [slug, router]);

  async function marcarConcluido() {
    if (!userId || concluido) return;
    setMarcando(true);
    const { error } = await supabase
      .from("conclusoes")
      .upsert({ usuario_id: userId, curso_slug: slug });
    if (!error) setConcluido(true);
    setMarcando(false);
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-floreer-bg flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-floreer-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-floreer-muted">Carregando material...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="min-h-screen bg-floreer-bg flex items-center justify-center flex-col gap-4">
        <p className="text-sm text-floreer-muted">{erro}</p>
        <Link href="/aluno" className="btn-primary">Voltar ao painel</Link>
      </div>
    );
  }

  if (!curso || !pdfBlobUrl) return null;

  return (
    <div className="min-h-screen bg-floreer-bg flex flex-col">
      <header className="border-b border-floreer-border bg-floreer-bg px-5 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/aluno"
            className="text-[11px] tracking-[1px] uppercase text-floreer-muted hover:text-floreer-dark transition-colors flex items-center gap-1.5"
          >
            &larr; Painel
          </Link>
          <span className="text-floreer-border">|</span>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex-shrink-0" style={{ background: curso.cor }} />
            <span className="text-sm font-medium text-floreer-dark">{`Curso ${curso.nome}`}</span>
            <span className="text-[10px] text-floreer-muted hidden md:inline">&middot; {curso.nivel}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {concluido ? (
            <span className="text-[11px] text-floreer-gold flex items-center gap-1">
              <span>&#10003;</span> Concluido
            </span>
          ) : (
            <button
              onClick={marcarConcluido}
              disabled={marcando}
              className="text-[11px] border border-floreer-gold text-floreer-gold px-4 py-1.5 rounded hover:bg-floreer-gold hover:text-white transition-colors disabled:opacity-50"
            >
              {marcando ? "Salvando..." : "Concluir curso"}
            </button>
          )}
          {pdfSignedUrl && (
            <a
              href={pdfSignedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[11px] bg-floreer-dark text-floreer-bg px-4 py-2 rounded hover:opacity-90 transition-opacity"
            >
              <span>&darr;</span>
              <span className="hidden sm:inline">Baixar PDF</span>
              <span className="sm:hidden">PDF</span>
            </a>
          )}
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        <iframe
          src={pdfBlobUrl}
          className="w-full flex-1"
          style={{ minHeight: "calc(100vh - 57px)", border: "none" }}
          title={`Curso ${curso.nome} - Floreer`}
        />
      </div>
    </div>
  );
}
