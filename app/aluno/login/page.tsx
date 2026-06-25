"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [modo, setModo] = useState<"login" | "cadastro">("login");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setMensagem("");
    setCarregando(true);

    if (modo === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) {
        setErro("Email ou senha incorretos.");
      } else {
        router.push("/aluno");
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: { data: { nome } },
      });
      if (error) {
        setErro("Erro ao criar conta. Tente novamente.");
      } else {
        setMensagem("Conta criada! Verifique seu email para confirmar o cadastro.");
      }
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
          {modo === "login" ? "Entrar" : "Criar conta"}
        </h1>
        <p className="text-sm text-floreer-muted mb-7">
          {modo === "login" ? "Acesse sua área do aluno." : "Cadastre-se para acessar seus cursos."}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {modo === "cadastro" && (
            <div>
              <label className="block text-[11px] text-floreer-muted tracking-wide mb-1.5">SEU NOME</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                required
                className="w-full bg-white border border-floreer-border rounded-md px-4 py-2.5 text-sm text-floreer-dark placeholder:text-[#C0B8B0] focus:outline-none focus:border-floreer-gold"
              />
            </div>
          )}

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
          {mensagem && <p className="text-xs text-green-600">{mensagem}</p>}

          <button
            type="submit"
            disabled={carregando}
            className="btn-primary w-full mt-1 disabled:opacity-60"
          >
            {carregando ? "Aguarde..." : modo === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <p className="text-xs text-floreer-muted text-center mt-6">
          {modo === "login" ? (
            <>Não tem conta?{" "}
              <button onClick={() => setModo("cadastro")} className="text-floreer-gold underline">
                Cadastre-se
              </button>
            </>
          ) : (
            <>Já tem conta?{" "}
              <button onClick={() => setModo("login")} className="text-floreer-gold underline">
                Entrar
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
