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
          Beleza com método
        </h1>
        <p className="text-sm text-floreer-muted mb-12">
          Técnica, carreira e tudo que a gente aprendeu sobre maquiagem.
        </p>

        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card p-7 hover:border-floreer-gold transition-colors grou