-- Produtos efetivamente vendidos, confirmados ao fechar a cotação — pode
-- divergir do que foi originalmente cotado em `produtos` (quantidade
-- alterada, item removido etc).
alter table cotacoes add column produtos_vendidos jsonb;
