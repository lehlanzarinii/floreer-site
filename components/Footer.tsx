import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-floreer-bg border-t border-floreer-border px-6 md:px-10 py-7 flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <p className="font-serif text-[15px] text-floreer-dark tracking-[4px]">FLOREER</p>
        <p className="text-[11px] text-floreer-muted mt-1">floreer.com.br · Plataforma de educação em beleza</p>
      </div>
      <div className="flex gap-6">
        <Link href="/cursos" className="text-[11px] text-floreer-muted hover:text-floreer-dark transition-colors">Cursos</Link>
        <Link href="/sobre" className="text-[11px] text-floreer-muted hover:text-floreer-dark transition-colors">Sobre</Link>
        <Link href="/contato" className="text-[11px] text-floreer-muted hover:text-floreer-dark transition-colors">Contato</Link>
        <Link href="/privacidade" className="text-[11px] text-floreer-muted hover:text-floreer-dark transition-colors">Privacidade</Link>
      </div>
      <p className="text-[11px] text-floreer-muted">© {new Date().getFullYear()} Floreer</p>
    </footer>
  );
}
