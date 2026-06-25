export type Post = {
  slug: string;
  titulo: string;
  resumo: string;
  data: string;
  tempoLeitura: string;
  categoria: string;
  conteudo: string; // HTML
};

export const posts: Post[] = [
  {
    slug: "qual-e-o-seu-nivel-na-maquiagem",
    titulo: "Qual é o seu nível na maquiagem? Entenda cada fase da sua jornada",
    resumo:
      "Toda maquiadora começa do zero. Mas saber exatamente em qual fase você está — e o que aprender a seguir — faz toda a diferença entre evoluir rápido ou ficar dando voltas no mesmo lugar.",
    data: "24 de junho de 2026",
    tempoLeitura: "5 min",
    categoria: "Maquiagem",
    conteudo: `
<p>Toda maquiadora começa do zero. Mas saber exatamente em qual fase você está — e o que aprender a seguir — faz toda a diferença entre evoluir rápido ou ficar dando voltas no mesmo lugar.</p>

<p>A maquiagem tem uma curva de aprendizado clara, com fases bem definidas. Reconhecer onde você está agora é o primeiro passo para chegar onde quer estar.</p>

<h2>Fase 1 — A iniciante: aprendendo a linguagem</h2>

<p>Você está nessa fase se:</p>

<ul>
  <li>Nunca se maquiou ou se maquia sem entender o porquê de cada passo</li>
  <li>Não sabe qual base combina com a sua pele — subtom, cobertura, acabamento</li>
  <li>Sente que o resultado fica "pesado" ou "artificial" mas não sabe onde está errando</li>
  <li>Usa poucos produtos porque tem medo de exagerar</li>
</ul>

<p>Nessa fase, o mais importante não é aprender muitas técnicas — é entender a base. Colorimetria, preparo de pele, ordem de aplicação. Quando você entende o <em>porquê</em> de cada passo, tudo começa a fazer sentido e o resultado melhora rápido.</p>

<p>A conquista dessa fase é conseguir fazer um look completo — base, olhos, lábios — de forma consistente, sem depender de tutoriais passo a passo toda vez.</p>

<h2>Fase 2 — A intermediária: técnica e confiança</h2>

<p>Você está nessa fase se:</p>

<ul>
  <li>Já se vira bem na automaquiagem, mas quer ir além do básico</li>
  <li>Quer aprender olho dramático, cat eye, cut crease</li>
  <li>Pensa em maquiar outras pessoas — amigas, familiares, clientes</li>
  <li>Sente que falta "aquele algo a mais" para o look ficar profissional</li>
</ul>

<p>Aqui, você já tem vocabulário. Agora é hora de expandir o repertório técnico e começar a transição de quem se maquia para quem maquia outras pessoas. Essa é uma virada importante — maquiar outra pessoa é completamente diferente de se maquiar.</p>

<p>Color correction, contorno avançado por formato de rosto, cílios postiços, delineado artístico. São técnicas que pedem prática, mas que quando dominadas abrem uma nova dimensão na sua maquiagem.</p>

<h2>Fase 3 — A profissional: negócio e identidade</h2>

<p>Você está nessa fase se:</p>

<ul>
  <li>Já tem técnica sólida e quer tornar isso uma carreira</li>
  <li>Quer trabalhar com noivas, eventos, fotografia</li>
  <li>Precisa entender precificação, gestão de clientes, agenda</li>
  <li>Quer construir uma identidade visual reconhecível — um estilo próprio</li>
</ul>

<p>A técnica ainda evolui aqui — maquiagem de alta cobertura, airbrush, adaptação para foto e vídeo, visagismo. Mas o diferencial de verdade passa a ser o negócio: como se apresentar, como cobrar, como fidelizar clientes, como se destacar num mercado competitivo.</p>

<p>Essa fase transforma uma habilidade em uma fonte de renda real e sustentável.</p>

<h2>Em qual fase você está?</h2>

<p>Não existe resposta errada. Cada fase tem seu valor e seu tempo. O que importa é não ficar parada — a evolução na maquiagem é consistente para quem aprende com método, não tentativa e erro.</p>

<p>Na Floreer, cada curso foi criado para uma fase específica dessa jornada. O <strong>Broto</strong> leva quem nunca maquiou a um look completo e bonito. O <strong>Botão</strong> transforma a automaquiagem em técnica de verdade e abre as portas para maquiar outras pessoas. A <strong>Plena</strong> é para quem quer fazer disso uma carreira profissional sólida.</p>

<p>Você pode começar em qualquer ponto da trilha — ou percorrer os três.</p>
    `,
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
