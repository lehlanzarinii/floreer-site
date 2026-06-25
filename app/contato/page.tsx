export const dynamic = "force-dynamic";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function ContatoPage() {
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
            Tem dúvidas sobre algum curso, precisa de suporte ou quer saber mais sobre a Floreer? Manda uma mensagem — respondemos em até 24 horas.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-sm text-floreer-muted">
              <span className="text-floreer-gold">✉</span>
              floreer.beleza@gmail.com
            </div>
            <div className="flex items-center gap-3 text-sm text-floreer-muted">
              <span className="text-floreer-gold">📱</span>
              @floreer_beleza no Instagram
            </div>
          </div>
        </div>

        <div className="card p-7">
          <p className="text-[10px] tracking-[2px] uppercase text-floreer-muted mb-6">Envie uma mensagem</p>
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-[11px] text-floreer-muted tracking-wide mb-1.5">SEU NOME</label>
              <input
                type="text"
                placeholder="Seu nome"
                className="w-full bg-floreer-bg border border-floreer-border rounded-md px-4 py-2.5 text-sm text-floreer-dark placeholder:text-[#C0B8B0] focus:outline-none focus:border-floreer-gold"
              />
            </div>
            <div>
              <label className="block text-[11px] text-floreer-muted tracking-wide mb-1.5">E-MAIL</label>
              <input
                type="email"
                placeholder="seu@email.com"
                className="w-full bg-floreer-bg border border-floreer-border rounded-md px-4 py-2.5 text-sm text-floreer-dark placeholder:text-[#C0B8B0] focus:outline-none focus:border-floreer-gold"
              />
            </div>
            <div>
              <label className="block text-[11px] text-floreer-muted tracking-wide mb-1.5">MENSAGEM</label>
              <textarea
                rows={4}
                placeholder="Como podemos ajudar?"
                className="w-full bg-floreer-bg border border-floreer-border rounded-md px-4 py-2.5 text-sm text-floreer-dark placeholder:text-[#C0B8B0] focus:outline-none focus:border-floreer-gold resize-none"
              />
            </div>
            <button type="submit" className="btn-primary w-full mt-1">
              Enviar mensagem
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}
