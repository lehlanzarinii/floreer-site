import { cursos, florCompleta } from "../../lib/cursos";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";

export default function CursosPage() {
  return (
    <>
      <Navbar />

      <section className="px-6 md:px-10 py-14">
        <div className="label-tag mb-3">Todos os cursos</div>
        <h1 className="font-serif text-4xl text-floreer-dark mb-2">Trilha de maquiagem</h1>
        <p className="text-sm text-floreer-muted mb-12 max-w-md">
          Três cursos pensados para você evoluir do zero ao profissional, no seu ritmo.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-16">
          {cursos.map((c) => (
            <Link key={c.slug} href={`/cursos/${c.slug}`} className="card overflow-hidden hover:shadow-sm transition-shadow group">
              <div className="h-44 p-6 flex flex-col justify-end" style={{ background: c.cor }}>
                <p className="text-[9px] tracking-[2px] uppercase text-[#3B2010] opacity-50 mb-1">{c.nivel}</p>
                <p className="font-serif text-3xl italic text-[#3B2010]">{c.nome}</p>
              </div>
              <div className="p-6 bg-floreer-bg">
                <p className="text-xs text-floreer-muted leading-relaxed mb-5">{c.desc}</p>
                <div className="flex items-center justify-between border-t border-floreer-border pt-4">
                  <span className="text-[10px] text-[#B0A89E]">{c.modulos} módulos · {c.aulas} slides</span>
                  <span className="text-[10px] tracking-wider uppercase text-floreer-gold font-medium group-hover:underline">
                    Ver curso →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bundle Flor Completa */}
        <div className="mt-4 bg-floreer-dark rounded-xl overflow-hidden">
          <div className="p-7 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-[9px] tracking-[2px] uppercase text-floreer-gold border border-floreer-gold/30 px-3 py-1 rounded-full mb-4 inline-block">
                {florCompleta.desconto} de desconto
              </span>
              <h3 className="font-serif text-3xl italic text-floreer-bg mb-2">{florCompleta.nome}</h3>
              <p className="text-sm text-[#7A756E] mb-3">{florCompleta.desc}</p>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-2xl text-floreer-bg">{florCompleta.precoFormatado}</span>
                <span className="text-sm text-[#5A5550] line-through">{florCompleta.precoOriginal}</span>
                <span className="text-xs text-floreer-gold">economia de {florCompleta.economia}</span>
              </div>
            </div>
            <Link
              href="/flor-completa"
              className="flex-shrink-0 inline-block bg-floreer-gold text-floreer-dark text-xs font-medium px-8 py-3.5 rounded tracking-wide hover:opacity-90 transition-opacity"
            >
              Ver a Flor Completa →
            </Link>
          </div>
        </div>

        {/* Em breve */}
        <div className="border-t border-floreer-border pt-10">
          <p className="text-[10px] tracking-[2px] uppercase text-floreer-muted mb-6">Em breve na plataforma</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {["Unhas", "Coloração pessoal", "Extensão de cílios", "Skincare", "Visagismo"].map((nome) => (
              <div key={nome} className="bg-floreer-card border border-floreer-border rounded-lg px-5 py-4">
                <p className="text-[9px] tracking-[1.5px] uppercase text-floreer-gold mb-1">Em breve</p>
                <p className="text-[12px] text-floreer-muted">{nome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
