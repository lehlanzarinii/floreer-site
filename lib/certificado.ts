import { jsPDF } from "jspdf";

interface CertData {
  nomeAluna: string;
  cursoSlug: string;
  nomeCurso: string;
  nivel: string;
  desc: string;
}

const CORES: Record<string, { bg: string; borda: string; ouro: string; escuro: string; muted: string }> = {
  broto:  { bg: "#FDF7F4", borda: "#C98A6E", ouro: "#C98A6E", escuro: "#3B2010", muted: "#9A7060" },
  botao:  { bg: "#FBF6F3", borda: "#8B5A42", ouro: "#8B5A42", escuro: "#2A1508", muted: "#7A5040" },
  plena:  { bg: "#FAFAF8", borda: "#B8864A", ouro: "#B8864A", escuro: "#1A1815", muted: "#8A8078" },
};

export function gerarCertificado(data: CertData) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = 297;
  const H = 210;
  const cx = W / 2;
  const cores = CORES[data.cursoSlug] || CORES.plena;

  // Fundo
  doc.setFillColor(cores.bg);
  doc.rect(0, 0, W, H, "F");

  // Borda dupla
  doc.setDrawColor(cores.borda);
  doc.setLineWidth(0.7);
  doc.rect(7, 7, W - 14, H - 14);
  doc.setLineWidth(0.25);
  doc.rect(10, 10, W - 20, H - 20);

  // Ornamentos de canto
  const canto = (x: number, y: number) => {
    doc.setDrawColor(cores.ouro);
    doc.setLineWidth(0.3);
    doc.line(x - 4, y, x + 4, y);
    doc.line(x, y - 4, x, y + 4);
    doc.setFillColor(cores.ouro);
    doc.circle(x, y, 1, "F");
  };
  canto(16, 16); canto(W - 16, 16); canto(16, H - 16); canto(W - 16, H - 16);

  // Linha topo decorativa
  doc.setDrawColor("#E3DDD6");
  doc.setLineWidth(0.2);
  doc.line(cx - 42, 20, cx - 6, 20);
  doc.line(cx + 6, 20, cx + 42, 20);
  doc.setFillColor(cores.ouro);
  doc.circle(cx, 20, 1.2, "F");

  // FLOREER
  doc.setTextColor(cores.escuro);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("F  L  O  R  E  E  R", cx, 29, { align: "center" });

  // Linha fina
  doc.setDrawColor("#E3DDD6");
  doc.setLineWidth(0.15);
  doc.line(cx - 18, 32, cx + 18, 32);

  // Certificado de Conclusão
  doc.setTextColor(cores.ouro);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  doc.text("Certificado de Conclusão", cx, 46, { align: "center" });

  // Certificamos que
  doc.setTextColor(cores.muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Certificamos que", cx, 58, { align: "center" });

  // Nome da aluna
  doc.setTextColor(cores.escuro);
  doc.setFont("helvetica", "bolditalic");
  doc.setFontSize(38);
  doc.text(data.nomeAluna, cx, 82, { align: "center" });

  // Linha sob o nome
  const nw = doc.getTextWidth(data.nomeAluna);
  doc.setDrawColor(cores.ouro);
  doc.setLineWidth(0.3);
  doc.line(cx - nw / 2 - 3, 85, cx + nw / 2 + 3, 85);

  // concluiu
  doc.setTextColor(cores.muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("concluiu com êxito o", cx, 95, { align: "center" });

  // Nome do curso
  doc.setTextColor(cores.escuro);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(data.nomeCurso, cx, 107, { align: "center" });

  // Nível
  doc.setTextColor(cores.ouro);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(data.nivel, cx, 115, { align: "center" });

  // Desc
  doc.setTextColor(cores.muted);
  doc.setFontSize(7.5);
  doc.text(data.desc, cx, 122, { align: "center" });

  // Linha divisória
  doc.setDrawColor("#E3DDD6");
  doc.setLineWidth(0.15);
  doc.line(cx - 52, 128, cx + 52, 128);

  // Data
  const hoje = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });
  doc.setTextColor(cores.muted);
  doc.setFontSize(8);
  doc.text(`Emitido em ${hoje}`, cx, 135, { align: "center" });

  // Assinatura
  doc.setDrawColor(cores.escuro);
  doc.setLineWidth(0.25);
  doc.line(cx - 25, 153, cx + 25, 153);

  doc.setTextColor(cores.escuro);
  doc.setFont("helvetica", "bolditalic");
  doc.setFontSize(13);
  doc.text("Floreer", cx, 159, { align: "center" });

  doc.setTextColor(cores.muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Escola de Beleza · floreer.com.br", cx, 165, { align: "center" });

  // Rodapé
  doc.setTextColor(cores.muted);
  doc.setFontSize(7);
  doc.text("floreer.com.br", cx, H - 8, { align: "center" });

  const filename = `certificado-floreer-${data.cursoSlug}-${data.nomeAluna
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")}.pdf`;
  doc.save(filename);
}
