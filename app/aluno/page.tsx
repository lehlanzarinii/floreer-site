"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { cursos } from "../../lib/cursos";

export default function AlunoPage() {
  const router = useRouter();
  const [nomeAluna, setNomeAluna] = useState("");
  const [cursosComprados, setCursosComprados] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function verificarSessao() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/aluno/login");
        return;
      }

      const nome = session.user.user_metadata?.nome || session.user.email?.split("@")[0] || "Aluna";
      setNomeAluna(nome);

      // Buscar compras aprovadas
      const { data: compras } = await supabase
        .from("compras")
        .select("curso_slug")
        .eq("usuario_id", session.user.id)
        .eq("status", "aprovado");

      setCursosComprados(compras?.map((c) => c.curso_slug) || []);
      setCarregando(false);
    }

    verificarSessao();
  }, [router]);

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
            return (
              <div key={c.slug} className="mb-3">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className={`flex items-center gap-1 ${!temAcesso ? "text-[#C8C0B8]" : "text-floreer-muted"}`}>
                    {!temAcesso && <span>🔒</span>}
                    {c.nome}
                  </span>
                </div>
                <div className="h-[2px] bg-floreer-border rounded-full" />
              </div>
            );
          })}
          <button
            onClick={sair}
            className="text-[10px] text-floreer-muted hover:text-floreer-dark mt-4 block"
          >
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
          <button
            onClick={sair}
            className="text-xs text-floreer-muted hover:text-floreer-dark"
          >
            Sair
          </button>
        </div>

        {/* Meus cursos */}
        <p className="text-[10px] tracking-[2px] uppercase text-floreer-muted mb-4 flex items-center gap-2">
          <span className="inline-block w-3 h-px bg-floreer-muted" /> Meus cursos
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {cursos.map((c) => {
            const temAcesso = cursosComprados.includes(c.slug);
            return (
              <div key={c.slug} className={`card overflow-hidden ${!temAcesso ? "opacity-70" : ""}`}>
                <div
                  className="h-[76px] p-4 flex items-end relative"
                  style={{ background: temAcesso ? c.cor : "#F3F0EB" }}
                >
                  {!temAcesso && (
                    <div className="absolute top-3 left-3">
                      <span className="text-[#B0A89E] text-sm">🔒</span>
                    </div>
                  )}
                  <p
                    className="font-serif text-[17px] italic"
                    style={{ color: temAcesso ? "#3B2010" : "#B0A89E" }}
                  >
                    {c.nome}
                  </p>
                </div>
                <div className="p-4 bg-floreer-bg">
                  {temAcesso ? (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-floreer-gold uppercase tracking-wide">Acesso liberado</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-floreer-muted">{c.nivel}</span>
                      <Link
                        href={`/cursos/${c.slug}`}
                        className="text-[10px] bg-floreer-dark text-floreer-bg px-3 py-1.5 rounded"
                      >
                        Adquirir
      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {cursosComprados.length === 0 && (
          <div className="card p-8 text-center">
            <p className="font-serif text-xl text-floreer-dark mb-2">Você ainda não tem cursos</p>
            <p className="text-sm text-floreer-muted mb-5">Explore nossos cursos e comece sua jornada na beleza.</p>
            <Link href="/cursos" className="btn-primary inline-block">Ver cursos</Link>
          </div>
        )}
      </main>
    </div>
  );
}
