import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Floreer — Educação em Beleza",
  description:
    "Plataforma de cursos de beleza — maquiagem, unhas, skincare e muito mais.",
  openGraph: {
    title: "Floreer",
    description: "Aprenda beleza do jeito certo.",
    url: "https://floreer.com.br",
    siteName: "Floreer",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${playfair.variable}`}>
        {children}
      </body>
    </html>
  );
}
