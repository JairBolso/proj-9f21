-- R3 Fitness — imagens de linha/categoria, conteúdo editável do site,
-- avatar de usuário.

alter table categorias add column imagem_url text;
alter table linhas add column imagem_url text;
alter table usuarios add column avatar_url text;

-- ---------------------------------------------------------------------
-- conteudo_site: pares chave/valor para banners e textos editáveis do
-- site público (hero de cada página, fotos da página Sobre, texto do
-- botão do topo, número de WhatsApp usado nos CTAs).
-- ---------------------------------------------------------------------

create table conteudo_site (
  id uuid primary key default gen_random_uuid(),
  chave text not null unique,
  tipo text not null check (tipo in ('imagem', 'texto')),
  valor text,
  descricao text,
  updated_at timestamptz not null default now()
);

create trigger conteudo_site_set_updated_at before update on conteudo_site
  for each row execute function set_updated_at();

alter table conteudo_site enable row level security;

create policy conteudo_site_select_public on conteudo_site for select using (true);

create policy conteudo_site_write_staff on conteudo_site for insert
  with check (get_user_papel(auth.uid()) in ('admin', 'editor'));

create policy conteudo_site_update_staff on conteudo_site for update
  using (get_user_papel(auth.uid()) in ('admin', 'editor'))
  with check (get_user_papel(auth.uid()) in ('admin', 'editor'));

insert into conteudo_site (chave, tipo, valor, descricao) values
  ('cta_topo_texto', 'texto', 'Solicitar Orçamento', 'Texto do botão amarelo no topo do site'),
  ('whatsapp_numero', 'texto', '5517997168842', 'Número usado em todos os botões de WhatsApp do site (DDI+DDD+número, só dígitos)'),
  ('hero_home_imagem', 'imagem', null, 'Banner da home'),
  ('hero_produtos_imagem', 'imagem', null, 'Banner da página de produtos'),
  ('hero_linhas_imagem', 'imagem', null, 'Banner da página de linhas'),
  ('hero_sobre_imagem', 'imagem', null, 'Banner da página sobre'),
  ('monte_academia_imagem', 'imagem', null, 'Foto da seção "Monte sua academia completa" na home'),
  ('sobre_historia_imagem', 'imagem', null, 'Foto da seção história, na página sobre'),
  ('sobre_processo_1_imagem', 'imagem', null, 'Foto etapa 1 do processo de fabricação (corte e usinagem)'),
  ('sobre_processo_2_imagem', 'imagem', null, 'Foto etapa 2 do processo de fabricação (solda estrutural)'),
  ('sobre_processo_3_imagem', 'imagem', null, 'Foto etapa 3 do processo de fabricação (pintura eletrostática)'),
  ('sobre_processo_4_imagem', 'imagem', null, 'Foto etapa 4 do processo de fabricação (montagem e teste)'),
  ('sobre_equipe_1_imagem', 'imagem', null, 'Foto de Ricardo Alves (Diretor de Fábrica)'),
  ('sobre_equipe_2_imagem', 'imagem', null, 'Foto de Renata Souza (Engenharia de Produto)'),
  ('sobre_equipe_3_imagem', 'imagem', null, 'Foto de Rafael Torres (Coordenação Comercial)'),
  ('sobre_equipe_4_imagem', 'imagem', null, 'Foto de Camila Duarte (Suporte Técnico)')
on conflict (chave) do nothing;

-- ---------------------------------------------------------------------
-- Storage: banners/conteúdo do site + avatares de usuário
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('site', 'site', true), ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy site_bucket_select_public on storage.objects for select
  using (bucket_id = 'site');

create policy site_bucket_insert_staff on storage.objects for insert
  with check (bucket_id = 'site' and get_user_papel(auth.uid()) in ('admin', 'editor'));

create policy site_bucket_update_staff on storage.objects for update
  using (bucket_id = 'site' and get_user_papel(auth.uid()) in ('admin', 'editor'));

create policy site_bucket_delete_staff on storage.objects for delete
  using (bucket_id = 'site' and get_user_papel(auth.uid()) in ('admin', 'editor'));

create policy avatars_bucket_select_public on storage.objects for select
  using (bucket_id = 'avatars');

create policy avatars_bucket_insert_staff on storage.objects for insert
  with check (bucket_id = 'avatars' and get_user_papel(auth.uid()) is not null);

create policy avatars_bucket_update_staff on storage.objects for update
  using (bucket_id = 'avatars' and get_user_papel(auth.uid()) is not null);
