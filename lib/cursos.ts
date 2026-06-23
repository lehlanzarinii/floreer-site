export type Curso = {
  slug: string;
  nivel: string;
  nome: string;
  desc: string;
  descLonga: string;
  preco: number;
  precoFormatado: string;
  modulos: number;
  aulas: number;
  cor: string;
  corHex: string;
  paraQuem: string[];
  vaiAprender: string[];
  conteudo: { num: string; titulo: string; aulas: number; gratis?: boolean }[];
};

export const cursos: Curso[] = [
  {
    slug: "broto",
    nivel: "Maquiagem · Nível 1",
    nome: "Broto",
    desc: "Automaquiagem do zero ao dia a dia",
    descLonga:
      "Do zero ao seu dia a dia — aprenda automaquiagem com método, do cuidado com a pele ao look completo.",
    preco: 29700,
    precoFormatado: "R$ 297,00",
    modulos: 12,
    aulas: 57,
    cor: "#F0C9B8",
    corHex: "#F0C9B8",
    paraQuem: [
      "Quem nunca maquiou e quer aprender do absoluto zero",
      "Quem se maquia mas sem técnica — e quer entender o porquê de cada passo",
      "Quem quer um look bonito e rápido para o dia a dia",
      "Quem tem dúvida sobre qual base, qual subtom, qual produto usar",
    ],
    vaiAprender: [
      "Entender seu subtom e escolher produtos certos para a sua pele",
      "Preparar a pele antes da maquiagem como base de tudo",
      "Fazer sobrancelha, olho, base e lábio com técnica real",
      "Montar looks completos — natural, dia e noite",
    ],
    conteudo: [
      { num: "M1", titulo: "Bem-vinda ao Broto — introdução e materiais", aulas: 4, gratis: true },
      { num: "M2", titulo: "Cuidado com a pele — base para a maquiagem", aulas: 5 },
      { num: "M3", titulo: "Colorimetria básica e subtom da pele", aulas: 5 },
      { num: "M4", titulo: "Base, corretivo e olheiras", aulas: 6 },
      { num: "M5", titulo: "Contorno, iluminador e blush", aulas: 5 },
      { num: "M6", titulo: "Sobrancelha — formato e técnica", aulas: 5 },
      { num: "M7", titulo: "Olhos — sombra e esfumado básico", aulas: 5 },
      { num: "M8", titulo: "Delineado e máscara de cílios", aulas: 4 },
      { num: "M9", titulo: "Lábios — batom e gloss", aulas: 4 },
      { num: "M10", titulo: "Pele mista e madura — adaptações", aulas: 5 },
      { num: "M11", titulo: "Looks completos — dia, noite e natural", aulas: 5 },
      { num: "M12", titulo: "Bônus — erros mais comuns e dicas finais", aulas: 4 },
    ],
  },
  {
    slug: "botao",
    nivel: "Maquiagem · Nível 2",
    nome: "Botão",
    desc: "Técnicas avançadas e maquiar outras pessoas",
    descLonga:
      "Técnicas avançadas, color correction, olho dramático e a transição para maquiar outras pessoas com confiança.",
    preco: 39700,
    precoFormatado: "R$ 397,00",
    modulos: 12,
    aulas: 52,
    cor: "#C98A6E",
    corHex: "#C98A6E",
    paraQuem: [
      "Quem já fez o Broto e quer evoluir as técnicas",
      "Quem quer aprender a maquiar outras pessoas",
      "Quem quer dominar olho dramático, cut crease e delineados",
      "Quem quer entender color correction de verdade",
    ],
    vaiAprender: [
      "Aplicar color correction de forma profissional",
      "Fazer cut crease, cat eye e delineado duplo",
      "Dominar ombré lips, overlining e cílios postiços",
      "Adaptar a maquiagem para diferentes rostos e clientes",
    ],
    conteudo: [
      { num: "M1", titulo: "Revisão e aprofundamento de bases", aulas: 4, gratis: true },
      { num: "M2", titulo: "Pele profissional — primer, pó e fixação", aulas: 4 },
      { num: "M3", titulo: "Contorno avançado por formato de rosto", aulas: 5 },
      { num: "M4", titulo: "Color correction — teoria e prática", aulas: 5 },
      { num: "M5", titulo: "Formatos de rosto — adaptação total", aulas: 4 },
      { num: "M6", titulo: "Sobrancelha avançada e design profissional", aulas: 4 },
      { num: "M7", titulo: "Cut crease e técnicas de olho avançado", aulas: 5 },
      { num: "M8", titulo: "Cílios postiços — tipos e aplicação", aulas: 4 },
      { num: "M9", titulo: "Delineado artístico — cat eye e duplo", aulas: 5 },
      { num: "M10", titulo: "Lábios avançados — ombré e overlining", aulas: 5 },
      { num: "M11", titulo: "Looks completos para clientes", aulas: 4 },
      { num: "M12", titulo: "Bônus — 5 erros mais comuns e fotografia", aulas: 3 },
    ],
  },
  {
    slug: "plena",
    nivel: "Maquiagem · Nível 3",
    nome: "Plena",
    desc: "Técnica profissional, negócio e identidade",
    descLonga:
      "Técnica profissional, maquiagem de noiva, fotografia, gestão do negócio e construção da sua identidade como maquiadora.",
    preco: 49700,
    precoFormatado: "R$ 497,00",
    modulos: 15,
    aulas: 62,
    cor: "#B68A4E",
    corHex: "#B68A4E",
    paraQuem: [
      "Quem já domina as técnicas do Botão e quer virar profissional",
      "Quem quer trabalhar com noivas, eventos e fotos",
      "Quem quer montar seu próprio negócio de maquiagem",
      "Quem quer construir uma identidade profissional sólida",
    ],
    vaiAprender: [
      "Maquiagem de noiva — técnica, corpo e durabilidade",
      "Adaptar a maquiagem para fotografia e vídeo",
      "Gestão de clientes, precificação e agenda",
      "Construir sua identidade visual e portfólio profissional",
    ],
    conteudo: [
      { num: "M1", titulo: "A maquiadora profissional — mentalidade e postura", aulas: 4, gratis: true },
      { num: "M2", titulo: "Pele impecável — técnica de alta cobertura", aulas: 4 },
      { num: "M3", titulo: "Olhos dramáticos e editoriais", aulas: 5 },
      { num: "M4", titulo: "Maquiagem para fotografia e luz", aulas: 4 },
      { num: "M5", titulo: "Noiva — conceito, técnica e durabilidade", aulas: 6 },
      { num: "M6", titulo: "Eventos — festa, formatura e madrinhas", aulas: 4 },
      { num: "M7", titulo: "Maquiagem masculina e drag", aulas: 3 },
      { num: "M8", titulo: "Airbrush e técnicas avançadas de produto", aulas: 4 },
      { num: "M9", titulo: "Colorimetria avançada — pele e maquiagem", aulas: 4 },
      { num: "M10", titulo: "Gestão do negócio — precificação e agenda", aulas: 5 },
      { num: "M11", titulo: "Marketing e portfólio — como se vender", aulas: 4 },
      { num: "M12", titulo: "Clientes difíceis — comunicação e postura", aulas: 4 },
      { num: "M13", titulo: "Visagismo aplicado à maquiagem", aulas: 4 },
      { num: "M14", titulo: "Construindo sua identidade profissional", aulas: 4 },
      { num: "M15", titulo: "Bônus — erros que afastam clientes e próximos passos", aulas: 3 },
    ],
  },
];

export function getCurso(slug: string): Curso | undefined {
  return cursos.find((c) => c.slug === slug);
}
