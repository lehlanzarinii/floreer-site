import Link from "next/link";
import { getCurso } from "../../../lib/cursos";

export default function SucessoPage({
  searchParams,
}: {
  searchParams: { curso?: string };
}) {
  const curso = searchParams.curso ? getCurso(searchParams.curso) : null;

  return (
    <div className="min-h-screen bg-floreer-bg flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-floreer-gold/10 flex items-center justify-center text-3xl mx-auto mb-6">
          ✨
        </div>
        <h1 className="font-serif text-3xl text-floreer-dark mb-3">
          Seja bem-vinda{curso ? ` ao ${curso.nome}` : ""}!
        </h1>
        <p className="text-sm text-floreer-muted leading-relaxed mb-8">
          Seu acesso foi liberado agora mesmo. Confira seu e-mail para os detalhes da conta e acesse a plataforma para começar.
        </p>
        <div className="flex flex-col gap-3 items-center">
          <div className="flex items-center gap-2 text-xs text-floreer-muted">
            <span className="text-floreer-gold">✓</span>
            {curso ? `Curso ${curso.nome}` : "Curso"} liberado na sua conta
          </div>
          <div className="flex items-center gap-2 text-xs text-floreer-muted">
            <span className="text-floreer-gold">✓</span>
            E-mail de confirmação enviado
          </div>
          <div className="flex items-center gap-2 text-xs text-floreer-muted">
            <span className="text-floreer-gold">✓</span>
            Acesso vitalício garantido
          </div>
        </div>
        <Link href="/aluno" className="btn-primary inline-block mt-8">
          Ir para a área do aluno
        </Link>
        <p className="text-xs text-floreer-muted mt-4">
          <Link href="/" className="hover:text-floreer-dark">Voltar para o início</Link>
        </p>
      </div>
    </div>
  );
}
