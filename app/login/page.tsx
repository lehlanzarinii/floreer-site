"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || "Erro ao entrar");
      window.location.href = "/aluno";
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Lado esquerdo — escuro */}
      <div className="bg-floreer-dark p-10 md:p-14 flex flex-col hidden md:flex">
        <Link href="/" className="flex items-center gap-2.5 mb-16">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="8" r="3.5" stroke="#B8864A" strokeWidth="1" />
            <circle cx="5.5" cy="13" r="2.5" stroke="#B8864A" strokeWidth="0.8" />
            <circle cx="16.5" cy="13" r="2.5" stroke="#B8864A" strokeWidth="0.8" />
            <circle cx="8" cy="18" r="2" stroke="#B8864A" strokeWidth="0.8" />
            <circle cx="14" cy="18" r="2" stroke="#B8864A" strokeWidth="0.8" />
            <circle cx="11" cy="11" r="2" fill="#B8864A" />
            <line x1="11" y1="13" x2="11" y2="21" stroke="#3A3530" strokeWidth="1" />
          </svg>
          <span className="font-serif text-[18px] text-floreer-bg tracking-[4px]">FLOREER</span>
        </Link>

        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-5">
            <span className="inline-block w-4 h-px bg-floreer-gold" />
            <span className="text-[10px] tracking-[2px] uppercase text-floreer-gold">Sua jornada na beleza</span>
          </div>
          <h2 className="font-serif text-4xl text-floreer-bg leading-tight mb-10">
            Aprenda,<br />evolua e <em>floresça</em>
          </h2>
          <div className="flex flex-col gap-3">
            {[
              { cor: "#F0C9B8", texto: "Broto — automaquiagem do zero" },
              { cor: "#C98A6E", texto: "Botão — técnicas avançadas" },
              { cor: "#B68A4E", texto: "Plena — nível profissional" },
              { cor: "#3A3530", texto: "+ cursos de unhas, cílios, skincare e mais" },
            ].map((item) => (
              <div key={item.texto} className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.cor }} />
                <span className="text-xs text-[#7A756E]">{item.texto}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-[#3A3530]">© {new Date().getFullYear()} Floreer · floreer.com.br</p>
      </div>

      {/* Lado direito — formulário */}
      <div className="bg-floreer-bg flex items-center justify-center p-8 md:p-14">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 md:hidden">
            <span className="font-serif text-[18px] text-floreer-dark tracking-[4px]">FLOREER</span>
          </Link>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block w-4 h-px bg-floreer-gold" />
            <span className="text-[10px] tracking-[2px] uppercase text-floreer-gold">Área do aluno</span>
          </div>
          <h1 className="font-serif text-2xl text-floreer-dark mb-8">Entrar na sua conta</h1>

          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg mb-5">
              {erro}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] text-floreer-muted tracking-wide mb-1.5">E-MAIL</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-floreer-card border border-floreer-border rounded-md px-4 py-2.5 text-sm text-floreer-dark placeholder:text-[#C0B8B0] focus:outline-none focus:border-floreer-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] text-floreer-muted tracking-wide mb-1.5">SENHA</label>
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-floreer-card border border-floreer-border rounded-md px-4 py-2.5 text-sm text-floreer-dark placeholder:text-[#C0B8B0] focus:outline-none focus:border-floreer-gold transition-colors"
              />
            </div>
            <div className="text-right">
              <Link href="/recuperar-senha" className="text-[11px] text-floreer-gold hover:opacity-80">
                Esqueci minha senha
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-center mt-1 disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-floreer-border" />
            <span className="text-[11px] text-floreer-muted">ou</span>
            <div className="flex-1 h-px bg-floreer-border" />
          </div>

          <a
            href="/api/auth/google"
            className="w-full flex items-center justify-center gap-2 border border-floreer-border rounded-md px-4 py-2.5 text-xs text-floreer-muted hover:bg-floreer-card transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#9A9188" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#9A9188" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#C0B8B0" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#C0B8B0" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Entrar com Google
          </a>

          <p className="text-center text-xs text-floreer-muted mt-6">
            Ainda não tem conta?{" "}
            <Link href="/cadastro" className="text-floreer-gold hover:opacity-80">
              Criar conta gratuita
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
