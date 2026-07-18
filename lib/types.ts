import type { FichaTecnicaItem } from "@/lib/supabase/database.types";

export interface LinhaRef {
  id: string;
  nome: string;
  slug: string;
}

export interface CategoriaRef {
  id: string;
  nome: string;
  slug: string;
}

export interface ProdutoComRelacoes {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  ficha_tecnica: FichaTecnicaItem[];
  fotos: string[];
  destaque: boolean;
  ativo: boolean;
  garantia: string | null;
  linha: LinhaRef | null;
  categoria: CategoriaRef | null;
}

export interface ProdutoDetalhado extends ProdutoComRelacoes {
  grupos: { grupo: { id: string; nome: string } | null }[];
}

export interface CartItem {
  produto_id: string;
  nome: string;
  slug: string;
  linha?: string;
  foto?: string | null;
  qtd: number;
}
