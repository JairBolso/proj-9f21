-- BUG CRÍTICO: o Supabase Realtime (postgres_changes) avalia a policy de
-- SELECT para decidir quem recebe cada evento, e essa avaliação NÃO
-- funciona de forma confiável com policies que chamam uma função
-- SECURITY DEFINER (get_user_papel) — a função retorna nulo nesse
-- contexto e a policy nunca libera a linha, então nenhum evento chega ao
-- navegador do admin/vendedor (dashboard e notificações "ao vivo" ficavam
-- mudos). Confirmado empiricamente: trocar a policy por uma subquery
-- EXISTS direta (sem a função) resolve — o Realtime avalia isso sem
-- problema. REST/PostgREST não é afetado (por isso o resto do painel
-- sempre funcionou normalmente).
--
-- Reescrevemos só a policy de SELECT de cotacoes, que é a única
-- relevante para autorização do Realtime nesta tabela.

drop policy if exists cotacoes_select_staff on cotacoes;

create policy cotacoes_select_staff on cotacoes for select
  using (
    exists (
      select 1 from usuarios u
      where u.id = auth.uid() and u.papel in ('admin', 'vendedor')
    )
  );

-- Necessário para o Realtime avaliar corretamente eventos de UPDATE
-- (inclui a linha completa antes da alteração, não só a PK).
alter table cotacoes replica identity full;
