"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [modo, setModo] = useState<"login" | "reset">("login");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro(""); setMensagem(""); setCarregando(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) {
      setErro("Email ou senha incorretos.");
    } else {
      router.push("/aluno");
    }
    setCarregando(false);
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setErro(""); setMensagem(""); setCarregando(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://floreer.com.br"}/aluno/nova-senha`,
    });
    if (error) {
      setErro("Nao foi possivel enviar o email. Verifique o endereco.");
    } else {
      setMensagem("Email enviado! Verifique sua caixa de entrada e clique no link para redefinir sua senha.");
    }
    setCarregando(false);
  }

  return (
    <div className="min-h-screen bg-floreer-bg flex flex-col items-center justify-center px-6">
      <Link href="/" className="flex items-center gap-2 mb-10">
        <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="8" r="3.5" stroke="#B8864A" strokeWidth="1" />
          <circle cx="11" cy="11" r="2" fill="#B8864A" />
        </svg>
        <span className="font-serif text-[17px] text-floreer-dark tracking-[4px]">FLOREER</span>
      </Link>

      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl text-floreer-dark mb-1">
          {modo === "login" ? "Entrar" : "Redefinir senha"}
        </h1>
        <p className="text-sm text-floreer-muted mb-7">
          {modo === "login" ? "Acesse sua area do aluno." : "Enviaremos um link para o seu email."}
        </p>

        {modo === "login" ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] text-floreer-muted tracking-wide mb-1.5">E-MAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full bg-white border border-floreer-border rounded-md px-4 py-2.5 text-sm text-floreer-dark placeholder:text-[#C0B8B0] focus:outline-none focus:border-floreer-gold"
              />
            </div>
            <div>
              <label className="block text-[11px] text-floreer-muted tracking-wide mb-1.5">SENHA</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-white border border-floreer-border rounded-md px-4 py-2.5 text-sm text-floreer-dark placeholder:text-[#C0B8B0] focus:outline-none focus:border-floreer-gold"
              />
            </div>
            {erro && <p className="text-xs text-red-500">{erro}</p>}
            <button type="submit" disabled={carregando} className="btn-primary w-full mt-1 disabled:opacity-60">
              {carregando ? "Aguarde..." : "Entrar"}
            </button>
            <button
              type="button"
              onClick={() => { setModo("reset"); setErro(""); setMensagem(""); }}
              className="text-xs text-floreer-muted text-center hover:text-floreer-gold transition-colors"
            >
              Esqueci minha senha
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] text-floreer-muted tracking-wide mb-1.5">E-MAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full bg-white border border-floreer-border rounded-md px-4 py-2.5 text-sm text-floreer-dark placeholder:text-[#C0B8B0] focus:outline-none focus:border-floreer-gold"
              />
            </div>
            {erro && <p className="text-xs text-red-500">{erro}</p>}
            {mensagem && <p className="text-xs text-green-600">{mensagem}</p>}
            <button type="submit" disabled={carregando} className="btn-primary w-full mt-1 disabled:opacity-60">
              {carregando ? "Enviando..." : "Enviar link"}
            </button>
            <button
              type="button"
              onClick={() => { setModo("login"); setErro(""); setMensagem(""); }}
              className="text-xs text-floreer-muted text-center hover:text-floreer-gold transition-colors"
            >
              Voltar ao login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
