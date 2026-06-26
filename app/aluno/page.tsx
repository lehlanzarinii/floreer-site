"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { cursos } from "../../lib/cursos";
import { gerarCertificado } from "../../lib/certificado";

export default function AlunoPage() {
  const router = useRouter();
  const [nomeAluna, setNomeAluna] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [cursosComprados, setCursosComprados] = useState<string[]>([]);
  const [cursosConcluidos, setCursosConcluidos] = useState<string[]>([]);
  const [marcando, setMarcando] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function verificarSessao() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/aluno/login"); return; }

      const nome = session.user.user_metadata?.nome || session.user.email?.split("@")[0] || "Aluna";
      setNomeAluna(nome);
      setUserId(session.user.id);

      const [comprasRes, conclusoesRes] = await Promise.all([
        supabase
          .from("compras")
          .select("curso_slug")
          .eq("usuario_id", session.user.id)
          .eq("status", "aprovado"),
        supabase
          .from("conclusoes")
          .select("curso_slug")
          .eq("usuario_id", session.user.id),
      ]);

      // Expandir "flor-completa" para os 3 cursos individuais
      const slugs = comprasRes.data?.flatMap((c) =>
        c.curso_slug === "flor-completa" ? ["broto", "botao", "plena"] : [c.curso_slug]
      ) || [];
      setCursosComprados(slugs);
      setCursosConcluidos(conclusoesRes.data?.map((c) => c.curso_slug) || []);
      setCarregando(false);
    }
    verificarSessao();
  }, [router]);

  async function marcarConcluida(cursoSlug: string) {
    if (!userId) return;
    setMarcando(cursoSlug);
    const { error } = await supabase
      .from("conclusoes")
      .upsert({ usuario_id: userId, curso_slug: cursoSlug });
    if (!error) setCursosConcluidos((prev) => [...prev, cursoSlug]);
    setMarcando(null);
  }

  function baixarCertificado(cursoSlug: string) {
    const curso = cursos.find((c) => c.slug === cursoSlug);
    if (!curso) return;
    gerarCertificado({
      nomeAluna,
      cursoSlug,
      nomeCurso: `Curso ${curso.nome}`,
      nivel: curso.nivel,
      desc: `${curso.desc} · ${curso.modulos} módulos · ${curso.aulas} aulas`,
    });
  }

  async function sair() {
    await supabase.auth.signOut();
    router.push("/aluno/login");
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-floreer-bg flex items-center justify-center">
        <p className="text-sm text-floreer-muted">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-floreer-bg flex">
      {/* Sidebar */}
      <aside className="w-52 border-r border-floreer-border flex flex-col py-7 hidden md:flex flex-shrink-0">
        <Link href="/" className="flex items-center gap-2 px-5 mb-10">
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="8" r="3.5" stroke="#B8864A" strokeWidth="1" />
            <circle cx="11" cy="11" r="2" fill="#B8864A" />
          </svg>
          <span className="font-serif text-[15px] text-floreer-dark tracking-[3px]">FLOREER</span>
        </Link>

        <div className="px-4 mb-8">
          <p className="text-[9px] tracking-[2px] uppercase text-floreer-muted mb-2.5 px-2">Menu</p>
          {[
            { href: "/aluno", label: "Painel", icon: "⊞" },
            { href: "/cursos", label: "Ver cursos", icon: "📚" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-floreer-muted hover:bg-floreer-card hover:text-floreer-dark transition-colors mb-0.5"
            >
              <span className="text-sm">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="px-5 border-t border-floreer-border pt-5 mt-auto">
          <p className="text-[9px] tracking-[2px] uppercase text-floreer-muted mb-4">Meus cursos</p>
          {cursos.map((c) => {
            const temAcesso = cursosComprados.includes(c.slug);
            const concluido = cursosConcluidos.includes(c.slug);
            return (
              <div key={c.slug} className="mb-3">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className={`flex items-center gap-1 ${!temAcesso ? "text-[#C8C0B8]" : concluido ? "text-floreer-gold" : "text-floreer-muted"}`}>
                    {!temAcesso ? "🔒" : concluido ? "✓" : ""} {c.nome}
                  </span>
                </div>
                <div className={`h-[2px] rounded-full ${concluido ? "bg-floreer-gold" : "bg-floreer-border"}`} />
              </div>
            );
          })}
          <button onClick={sair} className="text-[10px] text-floreer-muted hover:text-floreer-dark mt-4 block">
            Sair →
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-9 overflow-auto">
        <div className="flex items-center justify-between mb-7">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-3 h-px bg-floreer-gold" />
              <span className="text-[10px] tracking-[2px] uppercase text-floreer-gold">Bem-vinda</span>
            </div>
            <h1 className="font-serif text-3xl text-floreer-dark">Olá, {nomeAluna}</h1>
          </div>
          <button onClick={sair} className="text-xs text-floreer-muted hover:text-floreer-dark">
            Sair
          </button>
        </div>

        <p className="text-[10px] tracking-[2px] uppercase text-floreer-muted mb-4 flex items-center gap-2">
          <span className="inline-block w-3 h-px bg-floreer-muted" /> Meus cursos
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {cursos.map((c) => {
            const temAcesso = cursosComprados.includes(c.slug);
            const concluido = cursosConcluidos.includes(c.slug);
            return (
              <div key={c.slug} className={`card overflow-hidden ${!temAcesso ? "opacity-60" : ""}`}>
                <div
                  className="h-[76px] p-4 flex items-end relative"
                  style={{ background: temAcesso ? c.cor : "#F3F0EB" }}
                >
                  {!temAcesso && (
                    <div className="absolute top-3 left-3">
                      <span className="text-[#B0A89E] text-sm">🔒</span>
                    </div>
                  )}
                  {concluido && (
                    <div className="absolute top-3 right-3">
                      <span classN