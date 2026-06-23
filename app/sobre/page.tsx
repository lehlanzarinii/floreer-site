import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";

export default function SobrePage() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="px-6 md:px-10 py-16 md:py-24 max-w-2xl">
        <div className="label-tag mb-5">Sobre a Floreer</div>
        <h1 className="font-serif text-5xl md:text-6xl text-floreer-dark leading-[1.05] mb-7">
          Beleza é<br />muito mais<br />do que <em>técnica</em>
        </h1>
        <p className="text-floreer-muted text-sm leading-[1.9] mb-5">
          A Floreer nasceu de uma visão simples: que o universo da beleza feminina merece um espaço à altura. Um espaço pensado, bem feito, com identidade — e que cresce junto com quem aprende.
        </p>
        <p className="text-floreer-muted text-sm leading-[1.9]">
          Começamos pela maquiagem. Mas a ideia sempre foi maior: reunir num só lugar tudo que envolve cuidado, estética e bem-estar da mulher — do skincare ao visagismo, das unhas à coloração, do olhar profissional ao autoconhecimento através do espelho.
        </p>
      </section>

      <div className="border-t border-floreer-border mx-6 md:mx-10" />

      {/* VISÃO */}
      <section className="px-6 md:px-10 py-16 grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-2xl text-floreer-dark mb-5">O que estamos construindo</h2>
          <p className="text-sm text-floreer-muted leading-[1.9] mb-4">
            Imagine um espaço — digital por enquanto, físico no horizonte — onde a mulher encontra tudo. Médico estético, manicure, salão, pilates, botox, depilação, maquiagem, cuidado da pele. Um ecossistema de beleza completo, com a qualidade e a estética que o tema merece.
          </p>
          <p className="text-sm text-floreer-muted leading-[1.9]">
            Hoje, esse espaço existe na forma de cursos. Cada área do conhecimento tem sua identidade, seu método, seu universo visual. E tudo convive numa plataforma só — a Floreer.
          </p>
        </div>
        <div className="flex flex-col gap-6">
          {[
            { n: "01", t: "Conteúdo com método", d: "Cada curso é construído com estrutura pedagógica real — do básico ao avançado, sem atalhos." },
            { n: "02", t: "Estética intencional", d: "O design da plataforma e dos materiais faz parte do aprendizado. Beleza não é detalhe — é a essência." },
            { n: "03", t: "Plataforma própria", d: "Área do aluno, certificados, acesso vitalício — tudo numa casa só, sem depender de terceiros." },
            { n: "04", t: "Comunidade real", d: "Alunas conectadas pelo mesmo propósito crescem juntas. A Floreer é esse ponto de encontro." },
          ].map((p) => (
            <div key={p.n} className="pb-6 border-b border-floreer-border last:border-none last:pb-0">
              <p className="font-serif text-[11px] text-floreer-gold mb-1">{p.n}</p>
              <p className="text-sm font-medium text-floreer-dark mb-1">{p.t}</p>
              <p className="text-xs text-floreer-muted leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-floreer-dark px-6 md:px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl text-floreer-bg mb-2">Pronta para começar?</h2>
          <p className="text-sm text-[#7A756E]">Explore os cursos disponíveis e faça parte da Floreer.</p>
        </div>
        <Link href="/cursos" className="btn-gold flex-shrink-0">
          Ver cursos
        </Link>
      </section>

      <Footer />
    </>
  );
}
