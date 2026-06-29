"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState, useRef } from "react";

function SucessoConteudo() {
  const searchParams = useSearchParams();
  const curso = searchParams.get("curso") || "";
  const pendente = searchParams.get("pendente") === "1";
  const paymentId = searchParams.get("payment_id");
  const [confirmado, setConfirmado] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tentativasRef = useRef(0);
  const comprouRef = useRef(false);

  const nomes: Record<string, string> = {
    broto: "Broto", botao: "Botao", plena: "Plena", "flor-completa": "Flor Completa",
  };
  const precos: Record<string, number> = {
    broto: 50, botao: 100, plena: 150, "flor-completa": 210,
  };
  const nomeCurso = nomes[curso] || "do curso";

  // Dispara o evento de Compra no Pixel da Meta (uma única vez)
  function rastrearCompra() {
    if (comprouRef.current) return;
    const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
    if (typeof window !== "undefined" && fbq) {
      fbq("track", "Purchase", {
        value: precos[curso] ?? 0,
        currency: "BRL",
        content_name: nomeCurso,
        content_type: "product",
      });
      comprouRef.current = true;
    }
  }

  useEffect(() => {
    if (!paymentId) return;

    async function verificar() {
      try {
        const res = await fetch("/api/verificar-pagamento", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId }),
        });
        const data = await res.json();
        if (data.processado || data.jaProcessado || data.status === "approved") {
          setConfirmado(true);
          rastrearCompra();
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      } catch {
        // silencioso
      }
      tentativasRef.current += 1;
      // Para de tentar após 2 minutos (24 tentativas × 5s)
      if (tentativasRef.current >= 24 && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    // Verifica imediatamente
    verificar();

    // Para PIX (pendente), fica checando a cada 5 segundos
    if (pendente) {
      intervalRef.current = setInterval(verificar, 5000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId]);

  const mostrarSucesso = !pendente || confirmado;

  // Garante o disparo da Compra quando a tela de sucesso aparece (ex.: cartão aprovado na hora)
  useEffect(() => {
    if (mostrarSucesso) rastrearCompra();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mostrarSucesso]);

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
        {!mostrarSucesso ? (
          <>
            <p className="text-3xl mb-4">⏳</p>
            <h1 className="font-serif text-3xl text-floreer-dark mb-3">Confirmando pagamento...</h1>
            <p className="text-sm text-floreer-muted leading-relaxed mb-6">
              Estamos verificando seu PIX. Isso pode levar alguns segundos.
            </p>
            <div className="flex justify-center gap-1.5 mb-8">
              <span className="w-2 h-2 bg-floreer-gold rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-floreer-gold rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-floreer-gold rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
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
              Enviamos um e-mail para voce <strong>criar sua senha</strong> e acessar o curso. Verifique sua caixa de entrada (e a aba Promocoes/Spam).
            </p>
          </>
        )}

        <Link href="/aluno/login" className="btn-primary inline-block mb-4">
          Ir para a area da aluna
        </Link>
        <p className="text-xs text-floreer-muted">
          Crie sua senha pelo link do e-mail e depois entre com o seu e-mail.
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
