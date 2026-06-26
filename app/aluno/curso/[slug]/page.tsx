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

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function verificarECarregarPdf() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/aluno/login"); return; }

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

      const res = await fetch(`/api/ebook/${slug}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) {
        setErro("Nao foi possivel carregar o material. Tente novamente.");
        setCarregando(false);
        return;
      }

      const { signedUrl } = await res.json();
      setPdfUrl(signedUrl);
      setCarregando(false);
    }
    verificarECarregarPdf();
  }, [slug, router]);

  if (carregando) {
    return (
      <div className="min-h-screen bg-floreer-bg flex items-center justify-center">
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

  if (!curso || !pdfUrl) return null;

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

        <a
          href={pdfUrl}
          download={`Floreer-${curso.nome}.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[11px] bg-floreer-dark text-floreer-bg px-4 py-2 rounded hover:opacity-90 transition-opacity"
        >
          <span>&darr;</span>
          <span className="hidden sm:inline">Baixar PDF</span>
          <span className="sm:hidden">PDF</span>
        </a>
      </header>

      <div className="flex-1 flex flex-col">
        <iframe
          src={pdfUrl}
          className="w-full flex-1"
          style={{ minHeight: "calc(100vh - 57px)", border: "none" }}
          title={`Curso ${curso.nome} - Floreer`}
        />
      </div>
    </div>
  );
}
