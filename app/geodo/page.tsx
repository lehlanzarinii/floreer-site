import { cursos, geodo } from "../../lib/cursos";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";

export default function GeodoPage() {
  const cursosBundle = cursos.filter((c) => geodo.cursosSlugs.includes(c.slug));
  const txtCard = (slug: string) => (slug === "lavanda" ? "#3B2340" : "#FFFFFF");
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="px-6 md:px-10 py-16 md:py-24" style={{ backgroundColor: geodo.cor }}>
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="text-[9px] tracking-[2px] uppercase text-floreer-gold border border-floreer-gold/30 px-3 py-1.5 rounded-full">
              30% de desconto
            </span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl italic leading-[1.05] mb-5" style={{ color: "#F0E7FA" }}>
            Geodo
          </h1>
          <p className="text-sm leading-[1.9] max-w-sm mb-8" style={{ color: "#B9ACC8" }}>
            Os três cursos da linha de unha Floreer em um só acesso — da primeira unha ao seu próprio negócio, com acesso vitalício.
          </p>

          <div className="flex items-baseline gap-3 mb-8">
            <span className="font-serif text-4xl" style={{ color: "#F0E7FA" }}>{geodo.precoFormatado}</span>
            <span className="text-sm line-through" style={{ color: "#7E7191" }}>{geodo.precoOriginal}</span>
            <span className="text-xs text-floreer-gold">você economiza {geodo.economia}</span>
          </div>

          <Link
            href="/checkout/geodo"
            className="inline-block bg-floreer-gold text-floreer-dark text-xs font-medium px-10 py-4 rounded tracking-wide hover:opacity-90 transition-opacity"
          >
            Quero o Geodo
          </Link>
          <p className="text-[11px] mt-3" style={{ color: "#7E7191" }}>Acesso imediato · Vitalício · Certificado em cada curso</p>
        </div>
      </section>

      {/* O QUE ESTÁ INCLUÍDO */}
      <section className="px-6 md:px-10 py-14">
        <div className="label-tag mb-3">Incluído no combo</div>
        <h2 className="text-3xl text-floreer-dark mb-10">Três cursos, um único acesso</h2>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {cursosBundle.map((c, i) => (
            <div key={c.slug} className="card overflow-hidden">
              <div className="h-36 p-5 flex flex-col justify-end" style={{ background: c.cor }}>
                <p className="text-[9px] tracking-[2px] uppercase mb-1" style={{ color: txtCard(c.slug), opacity: 0.6 }}>
                  Curso {i + 1} de 3
                </p>
                <p className="font-serif text-2xl italic" style={{ color: txtCard(c.slug) }}>{c.nome}</p>
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
          {cursosBundle.map((c) => (
            <div key={c.slug} className="flex justify-between text-xs text-floreer-muted mb-3">
              <span>Curso {c.nome}</span>
              <span>{c.precoFormatado}</span>
            </div>
          ))}
          <div className="border-t border-floreer-border pt-4 mt-4">
            <div className="flex justify-between text-xs text-floreer-muted mb-2">
              <span>Subtotal</span>
              <span className="line-through">{geodo.precoOriginal}</span>
            </div>
            <div className="flex justify-between text-xs text-floreer-gold mb-4">
              <span>Desconto (30%)</span>
              <span>− {geodo.economia}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-floreer-dark">
              <span>Total Geodo</span>
              <span>{geodo.precoFormatado}</span>
            </div>
          </div>
        </div>
      </section>

      {/* GARANTIAS */}
      <section className="px-6 md:px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-8" style={{ backgroundColor: geodo.cor }}>
        <div>
          <h2 className="text-2xl mb-2" style={{ color: "#F0E7FA" }}>Tudo em um só lugar</h2>
          <p className="text-sm" style={{ color: "#B9ACC8" }}>Acesso completo à linha de unha Floreer.</p>
        </div>
        <div className="flex flex-col gap-3">
          {[
            "Acesso vitalício aos 3 cursos",
            "Certificado de conclusão em cada curso",
            "Comunidade exclusiva de alunas",
            "Pagamento seguro via Mercado Pago",
          ].map((g) => (
            <div key={g} className="flex items-center gap-2.5 text-xs" style={{ color: "#B9ACC8" }}>
              <span className="text-floreer-gold">✓</span>
              {g}
            </div>
          ))}
        </div>
        <Link
          href="/checkout/geodo"
          className="flex-shrink-0 inline-block bg-floreer-gold text-floreer-dark text-xs font-medium px-8 py-3.5 rounded tracking-wide hover:opacity-90 transition-opacity"
        >
          Quero o Geodo — {geodo.precoFormatado}
        </Link>
      </section>

      <Footer />
    </>
  );
}
