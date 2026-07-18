-- R3 Fitness — schema inicial
-- Convenção: tabelas em snake_case, RLS habilitado em tudo.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Tipos
-- ---------------------------------------------------------------------

create type papel_enum as enum ('admin', 'vendedor', 'editor');

create type status_cotacao_enum as enum (
  'novo',
  'em_atendimento',
  'proposta',
  'fechado',
  'perdido'
);

-- ---------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------

create table usuarios (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null,
  email text not null unique,
  papel papel_enum not null default 'vendedor',
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create table linhas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text not null unique,
  descricao text,
  exibir_home boolean not null default true,
  ordem integer not null default 0,
  created_at timestamptz not null default now()
);

create table categorias (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text not null unique,
  exibir_home boolean not null default true,
  ordem integer not null default 0,
  created_at timestamptz not null default now()
);

create table grupos_musculares (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  created_at timestamptz not null default now()
);

create table produtos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text not null unique,
  descricao text,
  ficha_tecnica jsonb not null default '[]'::jsonb,
  linha_id uuid references linhas (id) on delete set null,
  categoria_id uuid references categorias (id) on delete set null,
  fotos text[] not null default '{}',
  destaque boolean not null default false,
  ativo boolean not null default true,
  garantia text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table produto_grupo (
  produto_id uuid not null references produtos (id) on delete cascade,
  grupo_id uuid not null references grupos_musculares (id) on delete cascade,
  primary key (produto_id, grupo_id)
);

-- nome/whatsapp ficam nulos quando a cotação nasce de um clique direto
-- em "Solicitar Orçamento" (sem formulário) — o lead se identifica depois,
-- na própria conversa de WhatsApp. O formulário de contato sempre envia
-- os dois preenchidos.
create table cotacoes (
  id uuid primary key default gen_random_uuid(),
  nome text,
  whatsapp text,
  email text,
  cidade text,
  tipo_espaco text,
  produtos jsonb not null default '[]'::jsonb,
  origem_utm jsonb,
  status status_cotacao_enum not null default 'novo',
  vendedor_id uuid references usuarios (id) on delete set null,
  valor_venda numeric(12, 2),
  anotacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table depoimentos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  academia text,
  cidade text,
  texto text not null,
  aprovado boolean not null default false,
  created_at timestamptz not null default now()
);

create table integracoes (
  id uuid primary key default gen_random_uuid(),
  meta_pixel_id text,
  gtm_id text,
  scripts_custom text,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Índices
-- ---------------------------------------------------------------------

create index produtos_linha_id_idx on produtos (linha_id);
create index produtos_categoria_id_idx on produtos (categoria_id);
create index produtos_ativo_idx on produtos (ativo);
create index cotacoes_status_idx on cotacoes (status);
create index cotacoes_vendedor_id_idx on cotacoes (vendedor_id);
create index cotacoes_created_at_idx on cotacoes (created_at);
create index depoimentos_aprovado_idx on depoimentos (aprovado);

-- ---------------------------------------------------------------------
-- updated_at automático
-- ---------------------------------------------------------------------

create function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger produtos_set_updated_at before update on produtos
  for each row execute function set_updated_at();

create trigger cotacoes_set_updated_at before update on cotacoes
  for each row execute function set_updated_at();

create trigger integracoes_set_updated_at before update on integracoes
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- Helper: papel do usuário autenticado, sem recursão de RLS
-- (SECURITY DEFINER roda com o dono da função, que não é afetado
-- pelas policies da própria tabela usuarios)
-- ---------------------------------------------------------------------

create function get_user_papel(user_id uuid) returns papel_enum
language sql security definer set search_path = public stable as $$
  select papel from usuarios where id = user_id;
$$;

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------

alter table usuarios enable row level security;
alter table linhas enable row level security;
alter table categorias enable row level security;
alter table grupos_musculares enable row level security;
alter table produtos enable row level security;
alter table produto_grupo enable row level security;
alter table cotacoes enable row level security;
alter table depoimentos enable row level security;
alter table integracoes enable row level security;

-- usuarios: cada um vê a si mesmo; admin vê todos; só admin escreve
-- (exceto o próprio usuário pode atualizar seus próprios dados)
create policy usuarios_select on usuarios for select
  using (id = auth.uid() or get_user_papel(auth.uid()) = 'admin');

create policy usuarios_insert_admin on usuarios for insert
  with check (get_user_papel(auth.uid()) = 'admin');

create policy usuarios_update on usuarios for update
  using (id = auth.uid() or get_user_papel(auth.uid()) = 'admin')
  with check (id = auth.uid() or get_user_papel(auth.uid()) = 'admin');

create policy usuarios_delete_admin on usuarios for delete
  using (get_user_papel(auth.uid()) = 'admin');

-- linhas: leitura pública total; escrita admin/editor
create policy linhas_select_public on linhas for select using (true);

create policy linhas_write_staff on linhas for insert
  with check (get_user_papel(auth.uid()) in ('admin', 'editor'));

create policy linhas_update_staff on linhas for update
  using (get_user_papel(auth.uid()) in ('admin', 'editor'))
  with check (get_user_papel(auth.uid()) in ('admin', 'editor'));

create policy linhas_delete_staff on linhas for delete
  using (get_user_papel(auth.uid()) in ('admin', 'editor'));

-- categorias: mesma regra de linhas
create policy categorias_select_public on categorias for select using (true);

create policy categorias_write_staff on categorias for insert
  with check (get_user_papel(auth.uid()) in ('admin', 'editor'));

create policy categorias_update_staff on categorias for update
  using (get_user_papel(auth.uid()) in ('admin', 'editor'))
  with check (get_user_papel(auth.uid()) in ('admin', 'editor'));

create policy categorias_delete_staff on categorias for delete
  using (get_user_papel(auth.uid()) in ('admin', 'editor'));

-- grupos_musculares: leitura pública (usado em filtros), escrita admin/editor
create policy grupos_select_public on grupos_musculares for select using (true);

create policy grupos_write_staff on grupos_musculares for insert
  with check (get_user_papel(auth.uid()) in ('admin', 'editor'));

create policy grupos_update_staff on grupos_musculares for update
  using (get_user_papel(auth.uid()) in ('admin', 'editor'))
  with check (get_user_papel(auth.uid()) in ('admin', 'editor'));

create policy grupos_delete_staff on grupos_musculares for delete
  using (get_user_papel(auth.uid()) in ('admin', 'editor'));

-- produtos: público só vê ativos; qualquer usuário logado (staff) vê tudo
create policy produtos_select_public on produtos for select
  using (ativo = true);

create policy produtos_select_staff on produtos for select
  using (get_user_papel(auth.uid()) is not null);

create policy produtos_write_staff on produtos for insert
  with check (get_user_papel(auth.uid()) in ('admin', 'editor'));

create policy produtos_update_staff on produtos for update
  using (get_user_papel(auth.uid()) in ('admin', 'editor'))
  with check (get_user_papel(auth.uid()) in ('admin', 'editor'));

create policy produtos_delete_staff on produtos for delete
  using (get_user_papel(auth.uid()) in ('admin', 'editor'));

-- produto_grupo: leitura pública (segue produtos), escrita admin/editor
create policy produto_grupo_select_public on produto_grupo for select using (true);

create policy produto_grupo_write_staff on produto_grupo for insert
  with check (get_user_papel(auth.uid()) in ('admin', 'editor'));

create policy produto_grupo_delete_staff on produto_grupo for delete
  using (get_user_papel(auth.uid()) in ('admin', 'editor'));

-- cotacoes: qualquer visitante pode criar um lead (sem poder já
-- ditar status/vendedor/valor); só admin e vendedor enxergam e tratam
create policy cotacoes_insert_public on cotacoes for insert
  with check (
    status = 'novo' and vendedor_id is null and valor_venda is null
    and anotacoes is null
  );

create policy cotacoes_select_staff on cotacoes for select
  using (get_user_papel(auth.uid()) in ('admin', 'vendedor'));

create policy cotacoes_update_staff on cotacoes for update
  using (get_user_papel(auth.uid()) in ('admin', 'vendedor'))
  with check (get_user_papel(auth.uid()) in ('admin', 'vendedor'));

create policy cotacoes_delete_admin on cotacoes for delete
  using (get_user_papel(auth.uid()) = 'admin');

-- depoimentos: público só vê aprovados; staff (admin/editor) vê e edita tudo
create policy depoimentos_select_public on depoimentos for select
  using (aprovado = true);

create policy depoimentos_select_staff on depoimentos for select
  using (get_user_papel(auth.uid()) in ('admin', 'editor'));

create policy depoimentos_write_staff on depoimentos for insert
  with check (get_user_papel(auth.uid()) in ('admin', 'editor'));

create policy depoimentos_update_staff on depoimentos for update
  using (get_user_papel(auth.uid()) in ('admin', 'editor'))
  with check (get_user_papel(auth.uid()) in ('admin', 'editor'));

create policy depoimentos_delete_staff on depoimentos for delete
  using (get_user_papel(auth.uid()) in ('admin', 'editor'));

-- integracoes: leitura pública (precisa ser lida para injetar
-- pixel/GTM no site), escrita só admin
create policy integracoes_select_public on integracoes for select using (true);

create policy integracoes_write_admin on integracoes for insert
  with check (get_user_papel(auth.uid()) = 'admin');

create policy integracoes_update_admin on integracoes for update
  using (get_user_papel(auth.uid()) = 'admin')
  with check (get_user_papel(auth.uid()) = 'admin');

-- ---------------------------------------------------------------------
-- Storage: bucket de fotos de produtos
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('produtos', 'produtos', true)
on conflict (id) do nothing;

create policy produtos_bucket_select_public on storage.objects for select
  using (bucket_id = 'produtos');

create policy produtos_bucket_insert_staff on storage.objects for insert
  with check (
    bucket_id = 'produtos' and get_user_papel(auth.uid()) in ('admin', 'editor')
  );

create policy produtos_bucket_update_staff on storage.objects for update
  using (
    bucket_id = 'produtos' and get_user_papel(auth.uid()) in ('admin', 'editor')
  );

create policy produtos_bucket_delete_staff on storage.objects for delete
  using (
    bucket_id = 'produtos' and get_user_papel(auth.uid()) in ('admin', 'editor')
  );
