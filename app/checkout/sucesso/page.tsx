"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SucessoConteudo() {
  const searchParams = useSearchParams();
  const curso = searchParams.get("curso") || "";
  const pendente = searchParams.get("pendente") === "1";

  const nomes: Record<string, string> = {
    broto: "Broto",
    botao: "Botao",
    plena: "Plena",
    "flor-completa": "Flor Completa",
  };
  const nomeCurso = nomes[curso] || "do curso";

  return (
    <div className="min-h-screen bg-floreer-bg flex flex-col items-center justify-center px-6 text-center">
      <Link href="/" className="flex items-center gap-2 mb-12">
        <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="8" r="3.5" stroke="#B8864A" strokeWidth="1" />
          <circle cx="11" cy="11" r="2" fill="#B8864A" />
        </svg>
        <span className="font-serif text-[17px] text-floreer-dark tracking-[4px]">FLOREER</span>
      </Link>

      <div className="max-w-sm">
        {pendente ? (
          <>
            <p className="text-3xl mb-4">⏳</p>
            <h1 className="font-serif text-3xl text-floreer-dark mb-3">Pagamento em analise</h1>
            <p className="text-sm text-floreer-muted leading-relaxed mb-6">
              Seu pagamento do Curso {nomeCurso} esta sendo processado. Assim que confirmado, voce recebera um email com o acesso.
            </p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 bg-floreer-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-xl">✓</span>
            </div>
            <h1 className="font-serif text-3xl text-floreer-dark mb-3">Compra confirmada!</h1>
            <p className="text-sm text-floreer-muted leading-relaxed mb-2">
              Seu acesso ao Curso {nomeCurso} esta liberado.
            </p>
            <p className="text-sm text-floreer-muted leading-relaxed mb-8">
              Enviamos um email de boas-vindas com o link dos grupos do WhatsApp. Verifique sua caixa de entrada.
            </p>
          </>
        )}

        <Link href="/aluno/login" className="btn-primary inline-block mb-4">
          Acessar meu curso
        </Link>
        <p className="text-xs text-floreer-muted">
          Use o email e a senha que voce criou durante a compra.
        </p>
      </div>
    </div>
  );
}

export default function SucessoPage() {
  return (
    <Suspense>
      <SucessoConteudo />
    </Suspense>
  );
}
