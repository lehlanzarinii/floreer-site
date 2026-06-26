"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

export default function NovaSenhaPage() {
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    // Supabase processa o hash da URL automaticamente e cria a sessão
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setPronto(true);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (senha !== confirmar) { setErro("As senhas nao coincidem."); return; }
    if (senha.length < 6) { setErro("A senha deve ter no minimo 6 caracteres."); return; }
    setErro(""); setCarregando(true);
    const { error } = await supabase.auth.updateUser({ password: senha });
    if (error) {
      setErro("Erro ao redefinir senha. Tente solicitar um novo link.");
    } else {
      setSucesso(true);
      setTimeout(() => router.push("/aluno"), 2000);
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
        <h1 className="font-serif text-3xl text-floreer-dark mb-1">Nova senha</h1>
        <p className="text-sm text-floreer-muted mb-7">Escolha uma nova senha para sua conta.</p>

        {sucesso ? (
          <div className="text-center">
            <p className="text-sm text-green-600 mb-4">Senha redefinida com sucesso! Redirecionando...</p>
          </div>
        ) : !pronto ? (
          <p className="text-sm text-floreer-muted">Verificando link... se nada acontecer, solicite um novo link de redefinicao.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] text-floreer-muted tracking-wide mb-1.5">NOVA SENHA</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-white border border-floreer-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-floreer-gold"
              />
            </div>
            <div>
              <label className="block text-[11px] text-floreer-muted tracking-wide mb-1.5">CONFIRMAR SENHA</label>
              <input
                type="password"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-white border border-floreer-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-floreer-gold"
              />
            </div>
            {erro && <p className="text-xs text-red-500">{erro}</p>}
            <button type="submit" disabled={carregando} className="btn-primary w-full mt-1 disabled:opacity-60">
              {carregando ? "Salvando..." : "Salvar nova senha"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
