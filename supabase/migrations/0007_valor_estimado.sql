-- Valor estimado, preenchido ao marcar a cotação como "Proposta enviada"
-- (distinto de valor_venda, que só é preenchido ao "Fechar").
alter table cotacoes add column valor_estimado numeric(12, 2);
