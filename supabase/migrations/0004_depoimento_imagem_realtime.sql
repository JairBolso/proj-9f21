-- Imagem opcional no depoimento (logo, foto da pessoa ou banner do local)
alter table depoimentos add column imagem_url text;

-- Realtime: eventos de INSERT/UPDATE em cotacoes para o dashboard ao vivo
alter publication supabase_realtime add table cotacoes;
