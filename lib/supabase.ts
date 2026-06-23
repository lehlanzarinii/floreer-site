import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos do banco de dados
export type Usuario = {
  id: string;
  email: string;
  nome: string;
  criado_em: string;
};

export type Compra = {
  id: string;
  usuario_id: string;
  curso_slug: string;
  status: "pendente" | "aprovado" | "cancelado";
  criado_em: string;
};

export type Progresso = {
  id: string;
  usuario_id: string;
  curso_slug: string;
  modulo_num: string;
  aula_num: number;
  concluida: boolean;
  atualizado_em: string;
};
