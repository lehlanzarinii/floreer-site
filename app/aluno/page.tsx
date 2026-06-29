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
  const [cursosComprados, setCursosComprados] = useState<string[]>([]);
  const [cursosConcluidos, setCursosConcluidos] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [certCurso, setCertCurso] = useState<string | null>(null);
  const [certNome, setCertNome] = useState("");

  useEffect(() => {
    async function verificarSessao() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/aluno/login"); return; }

      const nome = session.user.user_metadata?.nome || session.user.email?.split("@")[0] || "Aluna";
      setNomeAluna(nome);

      const [comprasRes, conclusoesRes] = await Promise.all([
        supabase.from("compras").select("curso_slug").eq("usuario_id", session.user.id).eq("status", "aprovado"),
        supabase.from("conclusoes").select("curso_slug").eq("usuario_id", session.user.id),
      ]);

      const slugs = comprasRes.data?.flatMap((c) =>
        c.curso_slug === "flor-completa" ? ["broto", "botao", "plena"] : [c.curso_slug]
      ) || [];
      setCursosComprados(slugs);
      setCursosConcluidos(conclusoesRes.data?.map((c) => c.curso_slug) || []);
      setCarregando(false);
    }
    verificarSessao();
  }, [router]);

  function abrirCertificado(cursoSlug: string) {
    setCertCurso(cursoSlug);
    // Pré-preenche com o nome salvo, se já for um nome de verdade.
    setCertNome(nomeAluna && nomeAluna !== "Aluna" && !nomeAluna.includes("@") ? nomeAluna : "");
  }

  function confirmarCertificado(e: React.FormEvent) {
    e.preventDefault();
    const nome = certNome.trim();
    if (!certCurso || nome.length < 3) return;
    const curso = cursos.find((c) => c.slug === certCurso);
    if (!curso) return;
    gerarCertificado({
      nomeAluna: nome,
      cursoSlug: certCurso,
      nomeCurso: `Curso ${curso.nome}`,
      nivel: curso.nivel,
      desc: `${curso.desc} - ${curso.modulos} modulos - ${curso.aulas} aulas`,
    });
    // Guarda o nome para as próximas vezes.
    supabase.auth.updateUser({ data: { nome } });
    setNomeAluna(nome);
    setCertCurso(null);
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
            { href: "/aluno", label: "Painel", icon: "[]" },
            { href: "/cursos", label: "Ver cursos", icon: "=" },
          ].map((item) => (
            <Link key={item.href} href={item.href}
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
                <div className="text-[10px] mb-1">
                  <span className={`flex items-center gap-1 ${!temAcesso ? "text-[#C8C0B8]" : concluido ? "text-floreer-gold" : "text-floreer-muted"}`}>
                    {concluido ? "v" : !temAcesso ? "x" : "-"} {c.nome}
                  </span>
                </div>
                <div className={`h-[2px] rounded-full ${concluido ? "bg-floreer-gold" : "bg-floreer-border"}`} />
              </div>
            );
          })}
          <button onClick={sair} className="text-[10px] text-floreer-muted hover:text-floreer-dark mt-4 block">
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-9 overflow-auto">
        <div className="flex items-center justify-between mb-7">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-3 h-px bg-floreer-gold" />
              <span className="text-[10px] tracking-[2px] uppercase text-floreer-gold">Bem-vinda</span>
            </div>
            <h1 className="font-serif text-3xl text-floreer-dark">Ola, {nomeAluna}</h1>
          </div>
          <button onClick={sair} className="text-xs text-floreer-muted hover:text-floreer-dark">Sair</button>
        </div>

        <p className="text-[10px] tracking-[2px] uppercase text-floreer-muted mb-4 flex items-center gap-2">
          <span className="inline-block w-3 h-px bg-floreer-muted" /> Meus cursos
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {cursos.map((c) => {
            const temAcesso = cursosComprados.includes(c.slug);
            const concluido = cursosConcluidos.includes(c.slug);
            return (
              <div key={c.slug} className={`card overflow-hidden ${!temAcesso ? "opacity-60" : ""}`}>
                <div className="h-[76px] p-4 flex items-end relative" style={{ background: temAcesso ? c.cor : "#F3F0EB" }}>
                  {concluido && (
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] bg-floreer-gold text-white px-2 py-0.5 rounded-full">Concluida</span>
                    </div>
                  )}
                  <p className="font-serif text-[17px] italic" style={{ color: temAcesso ? "#3B2010" : "#B0A89E" }}>
                    {c.nome}
                  </p>
                </div>

                <div className="p-4 bg-floreer-bg flex flex-col gap-2.5">
                  {temAcesso ? (
                    <>
                      <Link href={`/aluno/curso/${c.slug}`} className="btn-primary block text-center">
                        {concluido ? "Rever curso" : "Acessar curso"}
                      </Link>
                      {concluido ? (
                        <button onClick={() => abrirCertificado(c.slug)} className="btn-gold w-full">
                          Baixar Certificado
                        </button>
                      ) : (
                        <p className="text-[10px] text-center text-floreer-muted py-1">
                          Conclua o curso para liberar o certificado
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-floreer-muted">{c.nivel}</span>
                      <Link href={`/cursos/${c.slug}`} className="btn-primary">Adquirir</Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {cursosComprados.length === 0 && (
          <div className="card p-8 text-center">
            <p className="font-serif text-xl text-floreer-dark mb-2">Voce ainda nao tem cursos</p>
            <p className="text-sm text-floreer-muted mb-5">Explore nossos cursos e comece sua jornada na beleza.</p>
            <Link href="/cursos" className="btn-primary inline-block">Ver cursos</Link>
          </div>
        )}

        {cursosComprados.length > 0 && (
          <div className="card p-6 mt-2">
            <p className="text-[10px] tracking-[2px] uppercase text-floreer-muted mb-4 flex items-center gap-2">
              <span className="inline-block w-3 h-px bg-floreer-muted" /> Grupos do WhatsApp
            </p>
            <p className="text-xs text-floreer-muted mb-4">Entre nos grupos da sua turma para tirar duvidas e trocar experiencias.</p>
            <div className="flex flex-col gap-2">
              <a href="https://chat.whatsapp.com/KUOJt71q22rLFiFbvWKBU0" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 border border-floreer-border rounded-lg px-4 py-3 hover:border-floreer-gold transition-colors group">
                <span className="text-lg">💬</span>
                <div>
                  <p className="text-xs font-medium text-floreer-dark group-hover:text-floreer-gold transition-colors">Floreer Comunidade</p>
                  <p className="text-[10px] text-floreer-muted">Grupo geral de todas as alunas</p>
                </div>
              </a>
              {cursosComprados.includes("broto") && (
                <a href="https://chat.whatsapp.com/GPpxohO0oDe8qEYxPthCRO" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 border border-floreer-border rounded-lg px-4 py-3 hover:border-floreer-gold transition-colors group">
                  <span className="text-lg">🌱</span>
                  <div>
                    <p className="text-xs font-medium text-floreer-dark group-hover:text-floreer-gold transition-colors">Floreer Broto</p>
                    <p className="text-[10px] text-floreer-muted">Grupo exclusivo do Curso Broto</p>
                  </div>
                </a>
              )}
              {cursosComprados.includes("botao") && (
                <a href="https://chat.whatsapp.com/FJh8NKNzG2R9KLo16glaAN" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 border border-floreer-border rounded-lg px-4 py-3 hover:border-floreer-gold transition-colors group">
                  <span className="text-lg">🌸</span>
                  <div>
                    <p className="text-xs font-medium text-floreer-dark group-hover:text-floreer-gold transition-colors">Floreer Botao</p>
                    <p className="text-[10px] text-floreer-muted">Grupo exclusivo do Curso Botao</p>
                  </div>
                </a>
              )}
              {cursosComprados.includes("plena") && (
                <a href="https://chat.whatsapp.com/LVPYjPf3cd65f9EHrlWpTS" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 border border-floreer-border rounded-lg px-4 py-3 hover:border-floreer-gold transition-colors group">
                  <span className="text-lg">🌺</span>
                  <div>
                    <p className="text-xs font-medium text-floreer-dark group-hover:text-floreer-gold transition-colors">Floreer Plena</p>
                    <p className="text-[10px] text-floreer-muted">Grupo exclusivo do Curso Plena</p>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}
      </main>

      {certCurso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-6 z-50" onClick={() => setCertCurso(null)}>
          <div className="bg-floreer-bg rounded-xl p-7 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-xl text-floreer-dark mb-2">Nome no certificado</h3>
            <p className="text-sm text-floreer-muted mb-5">
              Digite seu nome completo exatamente como deve aparecer no certificado.
            </p>
            <form onSubmit={confirmarCertificado} className="flex flex-col gap-3">
              <input
                type="text"
                autoFocus
                value={certNome}
                onChange={(e) => setCertNome(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full bg-white border border-floreer-border rounded-md px-4 py-2.5 text-sm text-floreer-dark placeholder:text-[#C0B8B0] focus:outline-none focus:border-floreer-gold"
              />
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setCertCurso(null)}
                  className="flex-1 text-sm text-floreer-muted border border-floreer-border rounded-md py-2.5 hover:text-floreer-dark"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={certNome.trim().length < 3}
                  className="btn-gold flex-1 disabled:opacity-50"
                >
                  Gerar certificado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
