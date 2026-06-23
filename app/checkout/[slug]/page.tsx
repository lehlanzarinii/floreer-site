"use client";
import { useState } from "react";
import { getCurso } from "../../../lib/cursos";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const curso = getCurso(params.slug as string);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [passo, setPasso] = useState<"dados" | "pagamento">("dados");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  if (!curso) return null;

  async function handleContinuar(e: React.FormEvent) {
    e.preventDefault();
    setPasso("pagamento");
  }

  async function handleCompra(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cursoSlug: curso!.slug, email, nome, senha }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || "Erro ao processar");
      // Redireciona para o Mercado Pago
      window.location.href = data.initPoint;
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : "Erro ao processar pagamento");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-floreer-bg grid md:grid-cols-2">
      {/* Resumo */}
      <div className="p-8 md:p-14 border-b md:border-b-0 md:border-r border-floreer-border flex flex-col">
        <Link href="/" className="font-serif text-[16px] text-floreer-dark tracking-[4px] mb-12 block">
          FLOREER
        </Link>
        <div className="flex-1">
          <p className="text-[10px] tracking-[2px] uppercase text-floreer-gold mb-4">Você está comprando</p>
          <div className="card p-5 mb-6">
            <div className="flex items-center gap-4 mb-5">
              <div
                className="w-10 h-10 rounded-lg flex items-end p-2 flex-shrink-0"
                style={{ background: curso.cor }}
              >
                <span className="font-serif text-[11px] italic text-[#3B2010]">{curso.nome}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-floreer-dark">{`Curso ${curso.nome}`}</p>
                <p className="text-[11px] text-floreer-muted">{curso.nivel} · Acesso vitalício</p>
              </div>
            </div>
            <div className="border-t border-floreer-border pt-4">
              <div className="flex justify-between text-xs text-floreer-muted mb-2">
                <span>Subtotal</span>
                <span>{curso.precoFormatado}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-floreer-dark">
                <span>Total</span>
                <span>{curso.precoFormatado}</span>
              </div>
            </div>
          </div>

          {/* Garantias */}
          <div className="flex flex-col gap-3">
            {[
              "Acesso imediato após o pagamento",
              "Acesso vitalício — sem prazo",
              "Certificado de conclusão em PDF",
              "Pagamento seguro via Mercado Pago",
            ].map((g) => (
              <div key={g} className="flex items-center gap-2.5 text-xs text-floreer-muted">
                <span className="text-floreer-gold">✓</span>
                {g}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="p-8 md:p-14 flex items-center">
        <div className="w-full max-w-sm">
          {passo === "dados" ? (
            <>
              <p className="text-[10px] tracking-[2px] uppercase text-floreer-gold mb-2">Passo 1 de 2</p>
              <h2 className="font-serif text-2xl text-floreer-dark mb-7">Seus dados</h2>

              {erro && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded mb-4">{erro}</div>
              )}

              <form onSubmit={handleContinuar} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[11px] text-floreer-muted tracking-wide mb-1.5">SEU NOME</label>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full bg-floreer-card border border-floreer-border rounded-md px-4 py-2.5 text-sm text-floreer-dark placeholder:text-[#C0B8B0] focus:outline-none focus:border-floreer-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-floreer-muted tracking-wide mb-1.5">E-MAIL</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-floreer-card border border-floreer-border rounded-md px-4 py-2.5 text-sm text-floreer-dark placeholder:text-[#C0B8B0] focus:outline-none focus:border-floreer-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-floreer-muted tracking-wide mb-1.5">CRIE SUA SENHA</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-floreer-card border border-floreer-border rounded-md px-4 py-2.5 text-sm text-floreer-dark placeholder:text-[#C0B8B0] focus:outline-none focus:border-floreer-gold"
                  />
                </div>
                <button type="submit" className="btn-primary w-full mt-2">
                  Continuar para o pagamento
                </button>
                <p className="text-center text-xs text-floreer-muted">
                  Já tem conta?{" "}
                  <Link href="/login" className="text-floreer-gold">Entrar</Link>
                </p>
              </form>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setPasso("dados")} className="text-floreer-muted text-xs hover:text-floreer-dark">
                  ← Voltar
                </button>
              </div>
              <p className="text-[10px] tracking-[2px] uppercase text-floreer-gold mb-2">Passo 2 de 2</p>
              <h2 className="font-serif text-2xl text-floreer-dark mb-7">Pagamento</h2>

              {erro && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded mb-4">{erro}</div>
              )}

              <p className="text-sm text-floreer-muted leading-relaxed mb-6">
                Clique abaixo para ser redirecionada ao Mercado Pago — lá você escolhe entre cartão de crédito, PIX ou boleto.
              </p>

              <form onSubmit={handleCompra}>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full text-center disabled:opacity-60"
                >
                  {loading ? "Redirecionando..." : `Finalizar compra — ${curso.precoFormatado}`}
                </button>
              </form>

              <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-floreer-muted">
                <span>🔒</span>
                Pagamento seguro via Mercado Pago
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
