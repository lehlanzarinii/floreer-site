import { getCurso, cursos, florCompleta } from "../../../lib/cursos";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return cursos.map((c) => ({ slug: c.slug }));
}

export default function CursoPage({ params }: { params: { slug: string } }) {
  const curso = getCurso(params.slug);
  if (!curso) notFound();

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section
        className="px-6 md:px-10 py-14 grid md:grid-cols-2 gap-12 items-center"
        style={{ background: curso.cor }}
      >
        <div>
          <p className="text-[9px] tracking-[2.5px] uppercase opacity-50 mb-3 text-[#3B2010] flex items-center gap-2">
            <span className="inline-block w-4 h-px bg-[#3B2010] opacity-40" />
            {curso.nivel}
          </p>
          <h1 className="font-serif text-6xl italic text-[#3B2010] leading-none mb-4">
            {curso.nome}
          </h1>
          <p className="text-sm text-[#3B2010] opacity-60 leading-relaxed max-w-sm mb-7">
            {curso.descLonga}
          </p>

          {/* Stats */}
          <div className="flex gap-8 mb-8">
            {[
              { n: curso.modulos, l: "Módulos" },
              { n: curso.aulas, l: "Slides" },
              { n: "Vitalício", l: "Acesso" },
            ].map((s) => (
              <div key={s.l} className="border-l-[1.5px] border-[#3B2010] border-opacity-20 pl-4">
                <p className="font-serif text-2xl text-[#3B2010]">{s.n}</p>
                <p className="text-[10px] tracking-[1px] uppercase text-[#3B2010] opacity-45 mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href={`/checkout/${curso.slug}`}
            className="inline-block bg-[#3B2010] text-[#FAF8F8] text-xs font-medium px-8 py-3.5 rounded tracking-wide hover:opacity-90 transition-opacity"
          >
            Quero começar o {curso.nome}
          </Link>
          <p className="text-[10px] text-[#3B2010] opacity-40 mt-2">Acesso imediato após a compra</p>
        </div>

        {/* Cards de benefício */}
        <div className="flex flex-col gap-3">
          {[
            { icon: "📄", titulo: "Slides com conteúdo exclusivo", texto: "Material visual rico com diagramas criados exclusivamente para o curso" },
            { icon: "♾️", titulo: "Acesso vitalício", texto: "Estude no seu ritmo, volte sempre que quiser, sem prazo" },
            { icon: "🎓", titulo: "Certificado de conclusão", texto: "Reconhecimento oficial ao finalizar o curso, gerado em PDF" },
            { icon: "📱", titulo: "Acesso em qualquer dispositivo", texto: "Celular, tablet ou computador — onde você estiver" },
          ].map((b) => (
            <div
              key={b.titulo}
              className="flex items-start gap-4 p-4 rounded-lg"
              style={{ background: "rgba(255,255,255,0.4)", border: "0.5px solid rgba(59,32,16,0.1)" }}
            >
              <div
                className="w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 text-base"
                style={{ background: "rgba(59,32,16,0.07)" }}
              >
                {b.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-[#3B2010] mb-0.5">{b.titulo}</p>
                <p className="text-[11px] text-[#3B2010] opacity-55 leading-relaxed">{b.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTEÚDO */}
      <section className="px-6 md:px-10 py-14">
        <div className="label-tag mb-2">Conteúdo do curso</div>
        <h2 className="text-3xl text-floreer-dark mb-8">O que você vai aprender</h2>
        <div className="flex flex-col gap-px">
          {curso.conteudo.map((m, i) => (
            <div
              key={m.num}
              className={`flex items-center justify-between px-6 py-4 bg-floreer-card border border-floreer-border ${
                i === 0 ? "rounded-t-lg" : i === curso.conteudo.length - 1 ? "rounded-b-lg" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="font-serif text-sm italic text-floreer-gold w-8">{m.num}</span>
                <span className="text-sm text-floreer-dark">{m.titulo}</span>
              </div>
              <div className="flex items-center gap-3">
                {m.gratis && (
                  <span className="text-[9px] tracking-wider uppercase bg-floreer-gold/10 text-floreer-gold px-2.5 py-1 rounded-full">
                    Grátis
                  </span>
                )}
                <span className="text-[11px] text-floreer-muted">{m.aulas} slides</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-floreer-border mx-6 md:mx-10" />

      {/* PARA QUEM */}
      <section className="px-6 md:px-10 py-14 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl text-floreer-dark mb-7">Para quem é o {curso.nome}</h2>
          <ul className="flex flex-col gap-4">
            {curso.paraQuem.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-floreer-muted leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-floreer-gold flex-shrink-0 mt-1.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-3xl text-floreer-dark mb-7">O que você vai sair sabendo</h2>
          <ul className="flex flex-col gap-4">
            {curso.vaiAprender.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-floreer-muted leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-floreer-gold flex-shrink-0 mt-1.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA ESCURO */}
      <section className="bg-floreer-dark px-6 md:px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl text-floreer-bg mb-2">Pronta para começar?</h2>
          <p className="text-sm text-[#7A756E]">Acesso imediato, vitalício e em qualquer dispositivo.</p>
        </div>
        <Link
          href={`/checkout/${curso.slug}`}
          className="flex-shrink-0 text-xs font-medium px-8 py-3.5 rounded tracking-wide transition-opacity hover:opacity-90"
          style={{ background: curso.cor, color: "#3B2010" }}
        >
          Quero o {curso.nome} — {curso.precoFormatado}
        </Link>
      </section>

      {/* TRILHA */}
      <section className="bg-floreer-card px-6 md:px-10 py-14">
        <div className="label-tag mb-2">Trilha completa de maquiagem</div>
        <h2 className="text-2xl text-floreer-dark mb-8">Continue evoluindo depois do {curso.nome}</h2>
        <div className="grid md:grid-cols-3 gap-3 mb-8">
          {cursos.map((c) => (
            <Link key={c.slug} href={`/cursos/${c.slug}`} className="card overflow-hidden hover:shadow-sm transition-shadow">
              <div className="h-20 p-5 flex items-end" style={{ background: c.cor }}>
                <p className="font-serif text-xl italic text-[#3B2010]">{c.nome}</p>
              </div>
              <div className="p-4 flex items-center justify-between">
                <p className="text-xs text-floreer-muted">{c.desc}</p>
                {c.slug === curso.slug && (
                  <span className="text-[9px] tracking-[1px] uppercase text-floreer-gold ml-3 flex-shrink-0">
                    Você está aqui
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* FLOR COMPLETA */}
        <div className="bg-floreer-dark rounded-xl overflow-hidden">
          <div className="p-7 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-[9px] tracking-[2px] uppercase text-floreer-gold border border-floreer-gold/30 px-3 py-1 rounded-full mb-4 inline-block">
                {florCompleta.desconto} de desconto
              </span>
              <h3 className="font-serif text-2xl italic text-floreer-bg mb-2">{florCompleta.nome}</h3>
              <p className="text-sm text-[#7A756E] mb-3">{florCompleta.desc}</p>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-xl text-floreer-bg">{florCompleta.precoFormatado}</span>
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
      </section>

      <Footer />
    </>
  );
}
