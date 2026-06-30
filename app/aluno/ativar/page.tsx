"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Pagina intermediaria (a prova de robos de e-mail): o link de criar senha
// so e gerado quando a ALUNA clica no botao, e nao quando um robo abre o link.
function AtivarConteudo() {
  const params = useSearchParams();
  const pid = params.get("pid");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function ativar() {
    if (!pid) {
      setErro("Link invalido. Use o botao do seu e-mail de compra.");
      return;
    }
    setLoading(true);
    setErro("");
    try {
      const res = await fetch("/api/link-acesso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: pid }),
      });
      const data = await res.json();
      if (data?.link) {
        window.location.href = data.link;
        return;
      }
      setErro("Nao foi possivel ativar agora. Tente novamente em instantes.");
    } catch {
      setErro("Erro ao ativar. Tente novamente.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-floreer-bg flex flex-col items-center justify-center px-6 text-center">
      <Link href="/" className="flex items-center gap-2 mb-10">
        <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="8" r="3.5" stroke="#B8864A" strokeWidth="1" />
          <circle cx="11" cy="11" r="2" fill="#B8864A" />
        </svg>
        <span className="font-serif text-[17px] text-floreer-dark tracking-[4px]">FLOREER</span>
      </Link>

      <div className="max-w-sm">
        <h1 className="font-serif text-3xl text-floreer-dark mb-3">Ativar meu acesso</h1>
        <p className="text-sm text-floreer-muted leading-relaxed mb-7">
          Clique abaixo para criar sua senha e entrar na area da aluna.
        </p>
        {erro && <p className="text-xs text-red-500 mb-4">{erro}</p>}
        <button onClick={ativar} disabled={loading} className="btn-primary inline-block disabled:opacity-60">
          {loading ? "Ativando..." : "Criar minha senha e acessar"}
        </button>
      </div>
    </div>
  );
}

export default function AtivarPage() {
  return (
    <Suspense>
      <AtivarConteudo />
    </Suspense>
  );
}
