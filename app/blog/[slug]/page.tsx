import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { getPost } from "../../../lib/posts";

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  return (
    <>
      <Navbar />

      <section className="px-6 md:px-10 py-14 max-w-2xl">
        {/* Voltar */}
        <Link
          href="/blog"
          className="text-[11px] tracking-[2px] uppercase text-floreer-muted hover:text-floreer-dark mb-8 inline-flex items-center gap-1.5"
        >
          ← Blog
        </Link>

        {/* Cabeçalho */}
        <div className="mt-6 mb-10">
          <div className="label-tag mb-4">{post.categoria}</div>
          <h1 className="font-serif text-3xl md:text-4xl text-floreer-dark leading-snug mb-4">
            {post.titulo}
          </h1>
          <div className="flex items-center gap-3 text-[11px] text-floreer-muted">
            <span>{post.data}</span>
            <span className="w-px h-3 bg-floreer-border" />
            <span>{post.tempoLeitura} de leitura</span>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="h-px bg-floreer-border mb-10" />

        {/* Conteúdo */}
        <div
          className="prose-floreer text-sm text-floreer-muted leading-[1.9] flex flex-col gap-5"
          dangerouslySetInnerHTML={{ __html: post.conteudo }}
        />

        {/* CTA */}
        <div className="mt-14 card p-8 text-center">
          <div className="label-tag mb-4 mx-auto w-fit">Comece agora</div>
          <p className="font-serif text-2xl text-floreer-dark mb-2">
            Escolha seu nível na Floreer
          </p>
          <p className="text-sm text-floreer-muted mb-6">
            Broto, Botão e Plena — três cursos para cada fase da sua jornada na maquiagem.
          </p>
          <Link href="/cursos" className="btn-primary inline-block">
            Ver cursos
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
