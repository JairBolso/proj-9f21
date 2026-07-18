// Minimal hand-written types for the R3 Fitness schema.
// Regenerate with `supabase gen types typescript` once the CLI is linked
// to the project, if a fully generated version is preferred.
//
// Queries that embed related tables (produtos -> linhas/categorias) don't
// rely on the `Relationships` metadata below for type inference — they use
// `.returns<T>()` at the call site instead, since hand-writing accurate
// foreign-key metadata for the query builder's dot-notation embedding is
// unnecessary here.

export type Papel = "admin" | "vendedor" | "editor";

export type StatusCotacao =
  | "novo"
  | "em_atendimento"
  | "proposta"
  | "fechado"
  | "perdido";

export interface FichaTecnicaItem {
  campo: string;
  valor: string;
}

export interface ProdutoCotado {
  produto_id: string;
  nome: string;
  slug: string;
  linha?: string;
  qtd: number;
}

export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string;
          nome: string;
          email: string;
          papel: Papel;
          ativo: boolean;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          nome: string;
          email: string;
          papel?: Papel;
          ativo?: boolean;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["usuarios"]["Insert"]>;
        Relationships: [];
      };
      linhas: {
        Row: {
          id: string;
          nome: string;
          slug: string;
          descricao: string | null;
          imagem_url: string | null;
          exibir_home: boolean;
          ordem: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          slug: string;
          descricao?: string | null;
          imagem_url?: string | null;
          exibir_home?: boolean;
          ordem?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["linhas"]["Insert"]>;
        Relationships: [];
      };
      categorias: {
        Row: {
          id: string;
          nome: string;
          slug: string;
          imagem_url: string | null;
          exibir_home: boolean;
          ordem: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          slug: string;
          imagem_url?: string | null;
          exibir_home?: boolean;
          ordem?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categorias"]["Insert"]>;
        Relationships: [];
      };
      grupos_musculares: {
        Row: {
          id: string;
          nome: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["grupos_musculares"]["Insert"]
        >;
        Relationships: [];
      };
      produtos: {
        Row: {
          id: string;
          nome: string;
          slug: string;
          descricao: string | null;
          ficha_tecnica: FichaTecnicaItem[];
          linha_id: string | null;
          categoria_id: string | null;
          fotos: string[];
          destaque: boolean;
          ativo: boolean;
          garantia: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          slug: string;
          descricao?: string | null;
          ficha_tecnica?: FichaTecnicaItem[];
          linha_id?: string | null;
          categoria_id?: string | null;
          fotos?: string[];
          destaque?: boolean;
          ativo?: boolean;
          garantia?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["produtos"]["Insert"]>;
        Relationships: [];
      };
      produto_grupo: {
        Row: {
          produto_id: string;
          grupo_id: string;
        };
        Insert: {
          produto_id: string;
          grupo_id: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["produto_grupo"]["Insert"]
        >;
        Relationships: [];
      };
      cotacoes: {
        Row: {
          id: string;
          nome: string | null;
          whatsapp: string | null;
          email: string | null;
          cidade: string | null;
          tipo_espaco: string | null;
          produtos: ProdutoCotado[];
          origem_utm: Record<string, string> | null;
          status: StatusCotacao;
          vendedor_id: string | null;
          valor_venda: number | null;
          valor_estimado: number | null;
          produtos_vendidos: ProdutoCotado[] | null;
          anotacoes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome?: string | null;
          whatsapp?: string | null;
          email?: string | null;
          cidade?: string | null;
          tipo_espaco?: string | null;
          produtos?: ProdutoCotado[];
          origem_utm?: Record<string, string> | null;
          status?: StatusCotacao;
          vendedor_id?: string | null;
          valor_venda?: number | null;
          valor_estimado?: number | null;
          produtos_vendidos?: ProdutoCotado[] | null;
          anotacoes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["cotacoes"]["Insert"]>;
        Relationships: [];
      };
      depoimentos: {
        Row: {
          id: string;
          nome: string;
          academia: string | null;
          cidade: string | null;
          texto: string;
          imagem_url: string | null;
          aprovado: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          academia?: string | null;
          cidade?: string | null;
          texto: string;
          imagem_url?: string | null;
          aprovado?: boolean;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["depoimentos"]["Insert"]
        >;
        Relationships: [];
      };
      integracoes: {
        Row: {
          id: string;
          meta_pixel_id: string | null;
          gtm_id: string | null;
          scripts_custom: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          meta_pixel_id?: string | null;
          gtm_id?: string | null;
          scripts_custom?: string | null;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["integracoes"]["Insert"]
        >;
        Relationships: [];
      };
      conteudo_site: {
        Row: {
          id: string;
          chave: string;
          tipo: "imagem" | "texto";
          valor: string | null;
          descricao: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          chave: string;
          tipo: "imagem" | "texto";
          valor?: string | null;
          descricao?: string | null;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["conteudo_site"]["Insert"]
        >;
        Relationships: [];
      };
      permissoes: {
        Row: {
          papel: Papel;
          item_id: string;
          permitido: boolean;
          updated_at: string;
        };
        Insert: {
          papel: Papel;
          item_id: string;
          permitido: boolean;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["permissoes"]["Insert"]>;
        Relationships: [];
      };
      atividades: {
        Row: {
          id: string;
          usuario_id: string | null;
          usuario_nome: string;
          acao: string;
          entidade: string | null;
          entidade_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          usuario_id?: string | null;
          usuario_nome: string;
          acao: string;
          entidade?: string | null;
          entidade_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["atividades"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      papel_enum: Papel;
      status_cotacao_enum: StatusCotacao;
    };
    CompositeTypes: Record<string, never>;
  };
}
