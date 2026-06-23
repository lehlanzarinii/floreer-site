"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { cursos } from "../../lib/cursos";

// Dados simulados — em produção vêm do Supabase
const cursosComprados = ["broto"]; // cursos que a aluna tem acesso
const progresso: Record<string, number> = { broto: 35 }; // % concluído por curso
const ultimaAula = { curso: "broto", modulo: "M4", titulo: "Base, corretivo e olheiras", aula: "4.3" };

export default function AlunoPage() {
  const [nomeAluna, setNomeAluna] = useState("Maria Letícia");

  return (
    <div className="min-h-screen bg-floreer-bg flex">
      {/* Sidebar */}
      <aside className="w-52 border-r border-floreer-border flex flex-col py-7 hidden md:flex flex-shrink-0">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 px-5 mb-10">
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="8" r="3.5" stroke="#B8864A" strokeWidth="1" />
            <circle cx="11" cy="11" r="2" fill="#B8864A" />
          </svg>
          <span className="font-serif text-[15px] text-floreer-dark tracking-[3px]">FLOREER</span>
        </Link>

        {/* Menu */}
        <div className="px-4 mb-8">
          <p className="text-[9px] tracking-[2px] uppercase text-floreer-muted mb-2.5 px-2">Menu</p>
          {[
            { href: "/aluno", label: "Painel", icon: "⊞" },
            { href: "/aluno/cursos", label: "Meus cursos", icon: "📚" },
            { href: "/aluno/certificados", label: "Certificados", icon: "🎓" },
            { href: "/aluno/configuracoes", label: "Configurações", icon: "⚙" },
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

        {/* Progresso na sidebar */}
        <div className="px-5 border-t border-floreer-border pt-5 mt-auto">
          <p className="text-[9px] tracking-[2px] uppercase text-floreer-muted mb-4">Meu progresso</p>
          {cursos.map((c) => {
            const pct = progresso[c.slug] ?? null;
            const temAcesso = cursosComprados.includes(c.slug);
            return (
              <div key={c.slug} className="mb-3">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className={`flex items-center gap-1 ${!temAcesso ? "text-[#C8C0B8]" : "text-floreer-muted"}`}>
                    {!temAcesso && <span>🔒</span>}
                    {c.nome}
                  </span>
                  <span className={temAcesso ? "text-floreer-muted" : "text-[#C8C0B8]"}>
                    {pct !== null ? `${pct}%` : "—"}
                  </span>
                </div>
                <div className="h-[2px] bg-floreer-border rounded-full">
                  {pct !== null && (
                    <div className="h-[2px] bg-floreer-gold rounded-full" style={{ width: `${pct}%` }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-9 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-3 h-px bg-floreer-gold" />
              <span className="text-[10px] tracking-[2px] uppercase text-floreer-gold">Bem-vinda de volta</span>
            </div>
            <h1 className="font-serif text-3xl text-floreer-dark">Olá, {nomeAluna}</h1>
          </div>
          <div className="w-9 h-9 rounded-full bg-floreer-broto flex items-center justify-center text-xs font-medium text-[#3B2010]">
            {nomeAluna.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
        </div>

        {/* Continue */}
        <div className="bg-floreer-card border border-floreer-border rounded-xl p-5 flex items-center gap-5 mb-8">
          <div
            className="w-12 h-12 rounded-lg flex-shrink-0 flex items-end p-2"
            style={{ background: "#F0C9B8" }}
          >
            <span className="font-serif text-[12px] italic text-[#3B2010]">Broto</span>
          </div>
          <div className="flex-1">
            <p className="text-[9px] tracking-[1.5px] uppercase text-floreer-muted mb-1">Continue de onde parou</p>
            <p className="text-sm font-medium text-floreer-dark mb-2">
              {ultimaAula.modulo} · {ultimaAula.titulo}
            </p>
            <div className="h-[2px] bg-floreer-border rounded-full">
              <div className="h-[2px] bg-floreer-gold rounded-full" style={{ width: `${progresso.broto}%` }} />
            </div>
            <p className="text-[10px] text-floreer-muted mt-1">
              {progresso.broto}% concluído · Aula {ultimaAula.aula} pendente
            </p>
          </div>
          <Link
            href="/aluno/broto/aula"
            className="btn-primary flex-shrink-0 text-center"
          >
            Continuar
          </Link>
        </div>

        {/* Meus cursos */}
        <p className="text-[10px] tracking-[2px] uppercase text-floreer-muted mb-4 flex items-center gap-2">
          <span className="inline-block w-3 h-px bg-floreer-muted" /> Meus cursos
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {cursos.map((c) => {
            const temAcesso = cursosComprados.includes(c.slug);
            const pct = progresso[c.slug] ?? 0;
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
                    <>
                      <div className="h-[2px] bg-floreer-border rounded-full mb-2">
                        <div className="h-[2px] bg-floreer-gold rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-floreer-muted">{pct}% concluído</span>
                        <span className="text-[9px] tracking-[1px] uppercase text-floreer-gold">
                          {pct === 0 ? "Disponível" : pct === 100 ? "Concluído" : "Em curso"}
                        </span>
                      </div>
                    </>
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

        {/* Últimas aulas */}
        <p className="text-[10px] tracking-[2px] uppercase text-floreer-muted mb-4 flex items-center gap-2">
          <span className="inline-block w-3 h-px bg-floreer-muted" /> Módulo 4 · Base, corretivo e olheiras
        </p>
        <div className="card overflow-hidden mb-8">
          <div className="px-5 py-3.5 border-b border-floreer-border">
            <p className="text-xs font-medium text-floreer-dark">Broto — módulo atual</p>
          </div>
          {[
            { num: "4.1", titulo: "Escolhendo a base certa para o seu subtom", status: "done" },
            { num: "4.2", titulo: "Técnica de aplicação — esponja vs pincel", status: "done" },
            { num: "4.3", titulo: "Corretivo e o triângulo invertido", status: "next" },
            { num: "4.4", titulo: "Olheiras — tipo, cor e cobertura", status: "locked" },
          ].map((aula, i, arr) => (
            <div
              key={aula.num}
              className={`flex items-center gap-4 px-5 py-3.5 ${i < arr.length - 1 ? "border-b border-floreer-border" : ""}`}
            >
              <span className="font-serif text-[11px] italic text-floreer-gold w-6">{aula.num}</span>
              <span className="text-xs text-floreer-dark flex-1">{aula.titulo}</span>
              <span
                className={`text-[9px] tracking-[1px] uppercase px-2.5 py-1 rounded-full ${
                  aula.status === "done"
                    ? "bg-floreer-gold/10 text-floreer-gold"
                    : aula.status === "next"
                    ? "bg-floreer-dark text-floreer-bg"
                    : "bg-floreer-border text-floreer-muted"
                }`}
              >
                {aula.status === "done" ? "Concluída" : aula.status === "next" ? "Próxima" : "🔒 Bloqueada"}
              </span>
            </div>
          ))}
        </div>

        {/* Certificado */}
        <p className="text-[10px] tracking-[2px] uppercase text-floreer-muted mb-4 flex items-center gap-2">
          <span className="inline-block w-3 h-px bg-floreer-muted" /> Certificado
        </p>
        <div className="card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-floreer-gold/10 flex items-center justify-center text-xl flex-shrink-0">
            🎓
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-floreer-dark mb-0.5">Certificado de conclusão — Broto</p>
            <p className="text-[11px] text-floreer-muted">Disponível ao concluir 100% do curso · gerado em PDF</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-medium text-floreer-gold">{progresso.broto}%</p>
            <p className="text-[9px] text-floreer-muted">concluído</p>
          </div>
        </div>
      </main>
    </div>
  );
}
