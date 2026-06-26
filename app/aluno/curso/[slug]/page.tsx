"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../../lib/supabase";
import { getCurso } from "../../../../lib/cursos";

export default function CursoConteudoPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const curso = getCurso(slug);

  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [concluido, setConcluido] = useState(false);
  const [marcando, setMarcando] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.4);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<any>(null);
  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
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

      if (!slugs.includes(slug)) { router.push("/aluno"); return; }

      const { data: conclusao } = await supabase
        .from("conclusoes")
        .select("id")
        .eq("usuario_id", session.user.id)
        .eq("curso_slug", slug)
        .single();
      if (conclusao) setConcluido(true);

      const res = await fetch(`/api/ebook/${slug}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) {
        setErro("Nao foi possivel carregar o material. Tente novamente.");
        setCarregando(false);
        return;
      }

      const { signedUrl } = await res.json();

      try {
        const pdfRes = await fetch(signedUrl);
        const buffer = await pdfRes.arrayBuffer();
        setPdfData(buffer);
      } catch {
        setErro("Erro ao carregar o arquivo. Tente novamente.");
      }

      setCarregando(false);
    }

    verificarECarregarPdf();
  }, [slug, router]);

  // Carrega PDF.js e renderiza
  useEffect(() => {
    if (!pdfData) return;

    async function carregarPdf() {
      // Carrega PDF.js do CDN
      if (!(window as any).pdfjsLib) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
          script.onload = () => resolve();
          script.onerror = reject;
          document.head.appendChild(script);
        });
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      }

      const pdfjsLib = (window as any).pdfjsLib;
      const loadingTask = pdfjsLib.getDocument({ data: pdfData });
      const pdfDoc = await loadingTask.promise;
      pdfDocRef.current = pdfDoc;
      setNumPages(pdfDoc.numPages);
      renderPage(pdfDoc, 1);
    }

    carregarPdf();
  }, [pdfData]);

  const renderPage = useCallback(async (pdfDoc: any, pageNum: number) => {
    if (!canvasRef.current || !pdfDoc) return;

    // Cancela render anterior
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
    }

    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderTask = page.render({ canvasContext: ctx, viewport });
    renderTaskRef.current = renderTask;
    try {
      await renderTask.promise;
    } catch {
      // Render cancelado — normal ao trocar de página
    }
  }, [scale]);

  useEffect(() => {
    if (pdfDocRef.current) {
      renderPage(pdfDocRef.current, currentPage);
    }
  }, [currentPage, scale, renderPage]);

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

  if (!curso) return null;

  return (
    <div className="min-h-screen bg-floreer-bg flex flex-col" onContextMenu={(e) => e.preventDefault()}>
      {/* Header */}
      <header className="border-b border-floreer-border bg-floreer-bg px-5 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/aluno"
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
      </header>

      {/* Controles de página */}
      {numPages > 0 && (
        <div className="bg-[#1a1a1a] text-white flex items-center justify-center gap-4 py-2 text-xs flex-shrink-0">
          <button
            onClick={() => setScale((s) => Math.max(0.7, s - 0.2))}
            className="px-2 py-1 rounded hover:bg-white/10"
          >−</button>
          <span>{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale((s) => Math.min(3, s + 0.2))}
            className="px-2 py-1 rounded hover:bg-white/10"
          >+</button>
          <span className="mx-2 text-white/30">|</span>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded hover:bg-white/10 disabled:opacity-30"
          >‹</button>
          <span>{currentPage} / {numPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
            disabled={currentPage === numPages}
            className="px-2 py-1 rounded hover:bg-white/10 disabled:opacity-30"
          >›</button>
        </div>
      )}

      {/* Canvas — sem toolbar do browser */}
      <div className="flex-1 overflow-auto bg-[#525659] flex justify-center py-6 px-4">
        <canvas
          ref={canvasRef}
          style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.4)", userSelect: "none" }}
        />
      </div>
    </div>
  );
}
