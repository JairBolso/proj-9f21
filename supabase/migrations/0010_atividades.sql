-- Log global de atividades do painel (auditoria). Complementa as notas
-- por-cotação (campo anotacoes): aqui fica o feed único, filtrável por
-- usuário, que só o admin enxerga.

create table atividades (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references usuarios (id) on delete set null,
  usuario_nome text not null,
  acao text not null,
  entidade text,
  entidade_id uuid,
  created_at timestamptz not null default now()
);

create index atividades_created_at_idx on atividades (created_at desc);
create index atividades_usuario_id_idx on atividades (usuario_id);

alter table atividades enable row level security;

-- Leitura só admin; qualquer staff autenticado pode registrar sua própria
-- atividade (as inserções vêm das Server Actions, com a sessão do usuário).
create policy atividades_select_admin on atividades for select
  using (get_user_papel(auth.uid()) = 'admin');

create policy atividades_insert_staff on atividades for insert
  with check (get_user_papel(auth.uid()) is not null);
