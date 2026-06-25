import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { florCompleta } from "../lib/cursos";

const cursos = [
  {
    slug: "broto",
    nivel: "Maquiagem · Nível 1",
    nome: "Broto",
    desc: "Automaquiagem do zero ao dia a dia — base, pele, sobrancelha e muito mais.",
    modulos: 12,
    aulas: 57,
    cor: "bg-floreer-broto",
    texto: "text-[#3B2010]",
  },
  {
    slug: "botao",
    nivel: "Maquiagem · Nível 2",
    nome: "Botão",
    desc: "Técnicas avançadas, color correction, olho dramático e maquiar outras pessoas.",
    modulos: 12,
    aulas: 52,
    cor: "bg-floreer-botao",
    texto: "text-[#3B2010]",
  },
  {
    slug: "plena",
    nivel: "Maquiagem · Nível 3",
    nome: "Plena",
    desc: "Técnica profissional, maquiagem noiva, fotografia e gestão do negócio.",
    modulos: 15,
    aulas: 62,
    cor: "bg-floreer-plena",
    texto: "text-[#3B2010]",
  },
];

const emBreve = [
  "Unhas",
  "Coloração pessoal",
  "Extensão de cílios",
  "Skincare",
  "Visagismo",
];

const pilares = [
  {
    num: "01",
    titulo: "Conteúdo com método",
    texto: "Cada curso é estruturado do básico ao avançado — com profundidade real, não conteúdo raso.",
  },
  {
    num: "02",
    titulo: "Identidade por área",
    texto: "Cada universo de curso tem seu próprio design — coeso, bonito e intencional.",
  },
  {
    num: "03",
    titulo: "Plataforma própria",
    texto: "Área do aluno, certificados e conteúdo — tudo numa casa só, sem depender de terceiros.",
  },
  {
    num: "04",
    titulo: "Comunidade",
    texto: "Alunas conectadas pelo mesmo propósito crescem juntas. Acesso ao grupo exclusivo de alunas Floreer.",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="px-6 md:px-10 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="label-tag mb-5">Educação em beleza</div>
          <h1 className="text-5xl md:text-6xl text-floreer-dark leading-[1.05] mb-5">
            Aprenda<br />a arte<br />da <em>beleza</em>
          </h1>
          <p className="text-floreer-muted text-sm leading-[1.8] max-w-sm mb-9">
            Uma plataforma de educação em beleza — construída para quem quer aprender com método, profundidade e estética.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/cursos" className="btn-primary">Ver cursos</Link>
            <Link href="/sobre" className="btn-outline">Conheça a Floreer</Link>
          </div>
        </div>

        {/* Course strips */}
        <div className="flex flex-col gap-px border border-floreer-border rounded-xl overflow-hidden">
          {cursos.map((c) => (
            <Link
              key={c.slug}
              href={`/cursos/${c.slug}`}
              className="flex items-center justify-between px-7 py-5 bg-floreer-bg hover:bg-floreer-card transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-2.5 h-2.5 rounded-full ${c.cor}`} />
                <div>
                  <p className="text-[10px] tracking-[1.5px] uppercase text-floreer-muted mb-1">{c.nivel}</p>
                  <p className="font-serif text-lg italic text-floreer-dark">{c.nome}</p>
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-floreer-muted">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </Link>
          ))}
          <div className="px-7 py-4 bg-floreer-card border-t border-floreer-border">
            <p className="text-[10px] text-floreer-muted">+ cursos de unhas, coloração, cílios, skincare e mais</p>
          </div>
        </div>
      </section>

      <div className="border-t border-floreer-border mx-6 md:mx-10" />

      {/* CURSOS */}
      <section className="px-6 md:px-10 py-16">
        <div className="flex items-baseline justify-between mb-10">
          <div>
            <div className="label-tag mb-2">Maquiagem</div>
            <h2 className="text-3xl text-floreer-dark">Três cursos, do zero ao profissional</h2>
          </div>
          <Link href="/cursos" className="text-[11px] text-floreer-muted underline underline-offset-2 hidden md:block">
            Ver todos
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-floreer-border rounded-xl overflow-hidden">
          {cursos.map((c) => (
            <div key={c.slug} className="bg-floreer-bg flex flex-col">
              <div className={`${c.cor} h-40 p-6 flex flex-col justify-end`}>
                <p className={`text-[9px] tracking-[2px] uppercase ${c.texto} opacity-50 mb-1`}>{c.nivel}</p>
                <p className={`font-serif text-[26px] italic ${c.texto}`}>{c.nome}</p>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <p className="text-xs text-floreer-muted leading-relaxed mb-4 flex-1">{c.desc}</p>
                <div className="flex items-center justify-between border-t border-floreer-border pt-4">
                  <span className="text-[10px] text-[#B0A89E]">{c.modulos} módulos · {c.aulas} slides</span>
                  <Link href={`/cursos/${c.slug}`} className="text-[10px] tracking-wider uppercase text-floreer-gold font-medium">
                    Saiba mais →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Flor Completa */}
        <div className="mt-8 bg-floreer-dark rounded-xl overflow-hidden">
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

        {/* Em breve */}
        <div className="mt-8">
          <p className="text-[10px] tracking-[2px] uppercase text-floreer-muted mb-3">Em breve na plataforma</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-floreer-border rounded-xl overflow-hidden">
            {emBreve.map((nome) => (
              <div key={nome} className="bg-floreer-card px-5 py-4">
                <p className="text-[9px] tracking-[1.5px] uppercase text-floreer-gold mb-1">Breve</p>
                <p className="text-[12px] text-floreer-muted">{nome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POR QUE FLOREER */}
      <section className="bg-floreer-dark px-6 md:px-10 py-16 grid md:grid-cols-2 gap-12 items-start">
        <div>
          <div className="label-tag mb-4" style={{ color: "#B8864A" }}>
            <span style={{ background: "#B8864A", width: 16, height: "0.5px", display: "inline-block" }} />
            Por que a Floreer
          </div>
          <h2 className="text-3xl text-floreer-bg leading-tight mb-4">
            Uma plataforma que cresce com você
          </h2>
          <p className="text-[#7A756E] text-sm leading-[1.8]">
            Não é um curso avulso numa plataforma de outra pessoa. A Floreer é um espaço construído com identidade, método e cuidado — onde cada área da beleza tem o espaço que merece.
          </p>
        </div>
        <div className="flex flex-col gap-6">
          {pilares.map((p) => (
            <div key={p.num} className="pb-6 border-b border-[#2A2720] last:border-none last:pb-0">
              <p className="font-serif text-[11px] text-floreer-gold mb-1.5">{p.num}</p>
              <p className="text-sm font-medium text-floreer-bg mb-1">{p.titulo}</p>
              <p className="text-xs text-[#7A756E] leading-relaxed">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
