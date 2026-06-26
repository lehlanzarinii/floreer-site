"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function ContatoPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErro("");

    const res = await fetch("/api/contato", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, mensagem }),
    });

    if (!res.ok) {
      setErro("Erro ao enviar. Tente novamente ou fale pelo Instagram.");
    } else {
      setSucesso(true);
      setNome("");
      setEmail("");
      setMensagem("");
    }

    setEnviando(false);
  }

  return (
    <>
      <Navbar />

      <section className="px-6 md:px-10 py-16 grid md:grid-cols-2 gap-16 items-start max-w-4xl">
        <div>
          <div className="label-tag mb-5">Contato</div>
          <h1 className="font-serif text-4xl text-floreer-dark mb-5">
            Fale com a gente
          </h1>
          <p className="text-sm text-floreer-muted leading-[1.9] mb-8">
            Tem duvidas sobre algum curso, precisa de suporte ou quer saber mais sobre a Floreer? Manda uma mensagem.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-sm text-floreer-muted">
              <span className="text-floreer-gold">@</span>
              floreer.beleza@gmail.com
            </div>
            <div className="flex items-center gap-3 text-sm text-floreer-muted">
              <span className="text-floreer-gold">ig</span>
              @floreer_beleza no Instagram
            </div>
          </div>
        </div>

        <div className="card p-7">
          {sucesso ? (
            <div className="flex flex-col items-center justify-center text-center py-8 gap-3">
              <span className="text-2xl">ok</span>
              <p className="font-serif text-xl text-floreer-dark">Mensagem enviada!</p>
              <p className="text-sm text-floreer-muted">Respondemos em ate 24 horas.</p>
              <button
                onClick={() => setSucesso(false)}
                className="text-xs text-floreer-gold underline mt-2"
              >
                Enviar outra mensagem
              </button>
            </div>
          ) : (
            <>
              <p className="text-[10px] tracking-[2px] uppercase text-floreer-muted mb-6">Envie uma mensagem</p>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-[11px] text-floreer-muted tracking-wide mb-1.5">SEU NOME</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome"
                    required
                    className="w-full bg-floreer-bg border border-floreer-border rounded-md px-4 py-2.5 text-sm text-floreer-dark placeholder:text-[#C0B8B0] focus:outline-none focus:border-floreer-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-floreer-muted tracking-wide mb-1.5">E-MAIL</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="w-full bg-floreer-bg border border-floreer-border rounded-md px-4 py-2.5 text-sm text-floreer-dark placeholder:text-[#C0B8B0] focus:outline-none focus:border-floreer-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-floreer-muted tracking-wide mb-1.5">MENSAGEM</label>
                  <textarea
                    rows={4}
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    placeholder="Como podemos ajudar?"
                    required
                    className="w-full bg-floreer-bg border border-floreer-border rounded-md px-4 py-2.5 text-sm text-floreer-dark placeholder:text-[#C0B8B0] focus:outline-none focus:border-floreer-gold resize-none"
                  />
                </div>
                {erro && <p className="text-xs text-red-500">{erro}</p>}
                <button
                  type="submit"
                  disabled={enviando}
                  className="btn-primary w-full mt-1 disabled:opacity-60"
                >
                  {enviando ? "Enviando..." : "Enviar mensagem"}
                </button>
              </form>
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
