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

  const [autorizado, setAutorizado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function verificar() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/aluno/login"); return; }

      // Verifica acesso ao curso (incluindo flor-completa)
      const { data: compras } = await supabase
        .from("compras")
        .select("curso_slug")
        .eq("usuario_id", session.user.id)
        .eq("status", "aprovado");

      const slugs = compras?.flatMap((c) =>
        c.curso_slug === "flor-completa" ? ["broto", "botao", "plena"] : [c.curso_slug]
      ) || [];

      if (slugs.includes(slug)) {
        setAutorizado(true);
      } else {
        router.push("/aluno");
      }
      setCarregando(false);
    }
    verificar();
  }, [slug, router]);

  if (carregando) {
    return (
      <div className="min-h-screen bg-floreer-bg flex items-center justify-center">
        <p className="text-sm text-floreer-muted">Carregando...</p>
      </div>
    );
  }

  if (!autorizado || !curso) return null;

  // URL da API protegida — verifica auth + compra no servidor antes de servir o PDF
  const pdfApiUrl = `/api/ebook/${slug}`;

  return (
    <div className="min-h-screen bg-floreer-bg flex flex-col">
      {/* Header */}
      <header className="border-b border-floreer-border bg-floreer-bg px-5 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/aluno"
            className="text-[11px] tracking-[1px] uppercase text-floreer-muted hover:text-floreer-dark transition-colors flex items-center gap-1.5"
          >
            ← Painel
          </Link>
          <span className="text-floreer-border">|</span>
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
              style={{ background: curso.cor }}
            />
            <span className="text-sm font-medium text-floreer-dark">{`Curso ${curso.nome}`}</span>
            <span className="text-[10px] text-floreer-muted hidden md:inline">· {curso.nivel}</span>
          </div>
        </div>

        <a
          href={pdfApiUrl}
          download={`Floreer-${curso.nome}.pdf`}
          className="flex items-center gap-2 text-[11px] bg-floreer-dark text-floreer-bg px-4 py-2 rounded hover:opacity-90 transition-opacity"
        >
          <span>↓</span>
          <span className="hidden sm:inline">Baixar PDF</span>
          <span className="sm:hidden">PDF</span>
        </a>
      </header>

      {/* Viewer — iframe aponta para API protegida, nunca para arquivo público */}
      <div className="flex-1 flex flex-col">
        <iframe
          src={pdfApiUrl}
          className="w-full flex-1"
          style={{ minHeight: "calc(100vh - 57px)", border: "none" }}
          title={`Curso ${curso.nome} — Floreer`}
        />
      </div>
    </div>
  );
}
