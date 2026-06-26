import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import { posts } from "../../lib/posts";

export default function BlogPage() {
  return (
    <>
      <Navbar />

      <section className="px-6 md:px-10 py-14 max-w-3xl">
        <div className="label-tag mb-5">Blog Floreer</div>
        <h1 className="font-serif text-4xl text-floreer-dark mb-2">
          Beleza com metodo
        </h1>
        <p className="text-sm text-floreer-muted mb-12">
          Tecnica, carreira e tudo que a gente aprendeu sobre maquiagem.
        </p>

        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card p-7 hover:border-floreer-gold transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="label-tag text-[9px]">{post.categoria}</span>
                <span className="text-[10px] text-floreer-muted">{post.data}</span>
                <span className="text-[10px] text-floreer-muted">· {post.tempoLeitura}</span>
              </div>
              <h2 className="font-serif text-xl text-floreer-dark mb-2 group-hover:text-floreer-gold transition-colors">
                {post.titulo}
              </h2>
              <p className="text-sm text-floreer-muted leading-relaxed">
                {post.resumo}
              </p>
              <span className="text-[11px] text-floreer-gold mt-4 inline-block">
                Ler artigo
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
