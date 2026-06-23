import { cursos, florCompleta } from "../../lib/cursos";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";

export default function FlorCompletaPage() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="bg-floreer-dark px-6 md:px-10 py-16 md:py-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="text-[9px] tracking-[2px] uppercase text-floreer-gold border border-floreer-gold/30 px-3 py-1.5 rounded-full">
              30% de desconto
            </span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl italic text-floreer-bg leading-[1.05] mb-5">
            Flor Completa
          </h1>
          <p className="text-[#7A756E] text-sm leading-[1.9] max-w-sm mb-8">
            Os três cursos da trilha de maquiagem Floreer em um só acesso — do zero à carreira profissional, com acesso vitalício.
          </p>

          {/* Preço */}
          <div className="flex items-baseline gap-3 mb-8">
            <span className="font-serif text-4xl text-floreer-bg">{florCompleta.precoFormatado}</span>
            <span className="text-sm text-[#5A5550] line-through">{florCompleta.precoOriginal}</span>
            <span className="text-xs text-floreer-gold">você economiza {florCompleta.economia}</span>
          </div>

          <Link
            href="/checkout/flor-completa"
            className="inline-block bg-floreer-gold text-floreer-dark text-xs font-medium px-10 py-4 rounded tracking-wide hover:opacity-90 transition-opacity"
          >
            Quero a Flor Completa
          </Link>
          <p className="text-[11px] text-[#5A5550] mt-3">Acesso imediato · Vitalício · Certificado em cada curso</p>
        </div>
      </section>

      {/* O QUE ESTÁ INCLUÍDO */}
      <section className="px-6 md:px-10 py-14">
        <div className="label-tag mb-3">Incluído no bundle</div>
        <h2 className="text-3xl text-floreer-dark mb-10">Três cursos, um único acesso</h2>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {cursos.map((c, i) => (
            <div key={c.slug} className="card overflow-hidden">
              <div className="h-36 p-5 flex flex-col justify-end" style={{ background: c.cor }}>
                <p className="text-[9px] tracking-[2px] uppercase text-[#3B2010] opacity-50 mb-1">
                  Curso {i + 1} de 3
                </p>
                <p className="font-serif text-2xl italic text-[#3B2010]">{c.nome}</p>
              </div>
              <div className="p-5 bg-floreer-bg">
                <p className="text-xs text-floreer-muted leading-relaxed mb-4">{c.desc}</p>
                <div className="flex items-center justify-between border-t border-floreer-border pt-3">
                  <span className="text-[10px] text-[#B0A89E]">{c.modulos} módulos · {c.aulas} slides</span>
                  <span className="text-[10px] text-floreer-gold line-through">{c.precoFormatado}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo do valor */}
        <div className="bg-floreer-card border border-floreer-border rounded-xl p-7 max-w-md">
          <p className="text-[10px] tracking-[2px] uppercase text-floreer-muted mb-5">Resumo</p>
          {cursos.map((c) => (
            <div key={c.slug} className="flex justify-between text-xs text-floreer-muted mb-3">
              <span>Curso {c.nome}</span>
              <span>{c.precoFormatado}</span>
            </div>
          ))}
          <div className="border-t border-floreer-border pt-4 mt-4">
            <div className="flex justify-between text-xs text-floreer-muted mb-2">
              <span>Subtotal</span>
              <span className="line-through">{florCompleta.precoOriginal}</span>
            </div>
            <div className="flex justify-between text-xs text-floreer-gold mb-4">
              <span>Desconto (30%)</span>
              <span>− {florCompleta.economia}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-floreer-dark">
              <span>Total Flor Completa</span>
              <span>{florCompleta.precoFormatado}</span>
            </div>
          </div>
        </div>
      </section>

      {/* GARANTIAS */}
      <section className="bg-floreer-dark px-6 md:px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 className="text-2xl text-floreer-bg mb-2">Tudo em um só lugar</h2>
          <p className="text-sm text-[#7A756E]">Acesso completo à trilha de maquiagem Floreer.</p>
        </div>
        <div className="flex flex-col gap-3">
          {[
            "Acesso vitalício aos 3 cursos",
            "Certificado de conclusão em cada curso",
            "Comunidade exclusiva de alunas",
            "Pagamento seguro via Mercado Pago",
          ].map((g) => (
            <div key={g} className="flex items-center gap-2.5 text-xs text-[#7A756E]">
              <span className="text-floreer-gold">✓</span>
              {g}
            </div>
          ))}
        </div>
        <Link
          href="/checkout/flor-completa"
          className="flex-shrink-0 inline-block bg-floreer-gold text-floreer-dark text-xs font-medium px-8 py-3.5 rounded tracking-wide hover:opacity-90 transition-opacity"
        >
          Quero a Flor Completa — {florCompleta.precoFormatado}
        </Link>
      </section>

      <Footer />
    </>
  );
}
