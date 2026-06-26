"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-floreer-bg border-b border-floreer-border h-16 px-6 md:px-10 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="8" r="3.5" stroke="#B8864A" strokeWidth="1" />
          <circle cx="5.5" cy="13" r="2.5" stroke="#B8864A" strokeWidth="0.8" />
          <circle cx="16.5" cy="13" r="2.5" stroke="#B8864A" strokeWidth="0.8" />
          <circle cx="8" cy="18" r="2" stroke="#B8864A" strokeWidth="0.8" />
          <circle cx="14" cy="18" r="2" stroke="#B8864A" strokeWidth="0.8" />
          <circle cx="11" cy="11" r="2" fill="#B8864A" />
          <line x1="11" y1="13" x2="11" y2="21" stroke="#C8C0B5" strokeWidth="1" />
        </svg>
        <span className="font-serif text-[18px] text-floreer-dark tracking-[4px]">
          FLOREER
        </span>
      </Link>

      {/* Links desktop */}
      <div className="hidden md:flex items-center gap-8">
        <Link href="/cursos" className="text-xs text-floreer-muted hover:text-floreer-dark transition-colors">
          Cursos
        </Link>
        <Link href="/sobre" className="text-xs text-floreer-muted hover:text-floreer-dark transition-colors">
          Sobre
        </Link>
        <Link href="/blog" className="text-xs text-floreer-muted hover:text-floreer-dark transition-colors">
          Blog
        </Link>
      </div>

      {/* CTA */}
      <div className="flex items-center gap-3">
        <Link href="/aluno" className="btn-primary hidden md:inline-block">
          Área do aluno
        </Link>
        {/* Mobile menu */}
        <button
          className="md:hidden text-floreer-muted"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <line x1="2" y1="5" x2="18" y2="5" stroke="currentColor" strokeWidth="1.5" />
            <line x1="2" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="1.5" />
            <line x1="2" y1="15" x2="18" y2="15" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="absolute top-16 left-0 right-0 bg-floreer-bg border-b border-floreer-border p-6 flex flex-col gap-4 md:hidden">
          <Link href="/cursos" className="text-sm text-floreer-muted" onClick={() => setOpen(false)}>Cursos</Link>
          <Link href="/sobre" className="text-sm text-floreer-muted" onClick={() => setOpen(false)}>Sobre</Link>
          <Link href="/blog" className="text-sm text-floreer-muted" onClick={() => setOpen(false)}>Blog</Link>
          <Link href="/aluno" className="btn-primary text-center mt-2" onClick={() => setOpen(false)}>Área do aluno</Link>
        </div>
      )}
    </nav>
  );
}
