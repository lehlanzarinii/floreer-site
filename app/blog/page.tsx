import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";

export default function BlogPage() {
  return (
    <>
      <Navbar />

      <section className="px-6 md:px-10 py-24 flex flex-col items-center text-center">
        <div className="label-tag mb-5">Blog Floreer</div>
        <h1 className="font-serif text-4xl md:text-5xl text-floreer-dark mb-5">
          Em breve
        </h1>
        <p className="text-sm text-floreer-muted leading-relaxed max-w-sm mb-9">
          Conteúdo sobre beleza, técnica, negócio e carreira — com a identidade e a profundidade que o tema merece. Estamos preparando tudo com cuidado.
        </p>
        <Link href="/cursos" className="btn-primary">
          Ver cursos disponíveis
        </Link>
      </section>

      <Footer />
    </>
  );
}
