-- Permissões de acesso ao painel, editáveis por admin. Sem linha para um
-- (papel, item_id) => vale o padrão definido em código (ADMIN_NAV_ITEMS).
-- "Redefinir padrão" é simplesmente apagar as linhas de override.

create table permissoes (
  papel papel_enum not null,
  item_id text not null,
  permitido boolean not null,
  updated_at timestamptz not null default now(),
  primary key (papel, item_id)
);

create trigger permissoes_set_updated_at before update on permissoes
  for each row execute function set_updated_at();

alter table permissoes enable row level security;

create policy permissoes_select_staff on permissoes for select
  using (get_user_papel(auth.uid()) is not null);

create policy permissoes_write_admin on permissoes for insert
  with check (get_user_papel(auth.uid()) = 'admin');

create policy permissoes_update_admin on permissoes for update
  using (get_user_papel(auth.uid()) = 'admin')
  with check (get_user_papel(auth.uid()) = 'admin');

create policy permissoes_delete_admin on permissoes for delete
  using (get_user_papel(auth.uid()) = 'admin');

-- Realtime: status/valor/vendedor mudando em outra sessão deve refletir
-- ao vivo (o listener do painel já escuta INSERT; falta o UPDATE).
-- A tabela cotacoes já está na publication desde a migration 0004.
