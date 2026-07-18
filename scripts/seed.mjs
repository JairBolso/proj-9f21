// Popula o banco com dados de exemplo. Rodar DEPOIS de aplicar
// supabase/migrations/0001_init.sql no projeto Supabase.
//
//   node --env-file=.env.local scripts/seed.mjs
//
// Usa a service role key (bypassa RLS) — nunca rodar isso apontando para
// produção com dados reais sem revisar antes.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Faltam NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY no ambiente.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function upsertLinhas() {
  const linhas = [
    {
      nome: "Excellence",
      slug: "excellence",
      descricao:
        "Linha premium para academias de alto padrão, com acabamento superior e tecnologia biomecânica avançada.",
      exibir_home: true,
      ordem: 1,
    },
    {
      nome: "Overall",
      slug: "overall",
      descricao:
        "A linha mais vendida da R3 — equilíbrio entre robustez, custo e desempenho para academias de todos os portes.",
      exibir_home: true,
      ordem: 2,
    },
    {
      nome: "Body Line",
      slug: "body-line",
      descricao:
        "Equipamentos versáteis para studios e espaços compactos, sem abrir mão da resistência profissional.",
      exibir_home: true,
      ordem: 3,
    },
    {
      nome: "New Shape",
      slug: "new-shape",
      descricao:
        "Linha de entrada com o mesmo padrão de fabricação R3, ideal para academias em expansão.",
      exibir_home: true,
      ordem: 4,
    },
  ];

  const { data, error } = await supabase
    .from("linhas")
    .upsert(linhas, { onConflict: "slug" })
    .select("id, slug");
  if (error) throw error;
  return Object.fromEntries(data.map((l) => [l.slug, l.id]));
}

async function upsertCategorias() {
  const categorias = [
    { nome: "Cardio", slug: "cardio", exibir_home: true, ordem: 1 },
    { nome: "Articulados", slug: "articulados", exibir_home: true, ordem: 2 },
    { nome: "Pesos Livres", slug: "pesos-livres", exibir_home: true, ordem: 3 },
    { nome: "Acessórios", slug: "acessorios", exibir_home: true, ordem: 4 },
  ];

  const { data, error } = await supabase
    .from("categorias")
    .upsert(categorias, { onConflict: "slug" })
    .select("id, slug");
  if (error) throw error;
  return Object.fromEntries(data.map((c) => [c.slug, c.id]));
}

async function upsertGrupos() {
  const nomes = [
    "Peitoral",
    "Costas",
    "Pernas",
    "Ombros",
    "Bíceps",
    "Tríceps",
    "Abdômen",
  ];

  const { data: existentes, error: erroSelect } = await supabase
    .from("grupos_musculares")
    .select("id, nome");
  if (erroSelect) throw erroSelect;

  const faltando = nomes.filter(
    (n) => !existentes.some((g) => g.nome === n),
  );
  if (faltando.length > 0) {
    const { error } = await supabase
      .from("grupos_musculares")
      .insert(faltando.map((nome) => ({ nome })));
    if (error) throw error;
  }

  const { data: todos, error } = await supabase
    .from("grupos_musculares")
    .select("id, nome");
  if (error) throw error;
  return Object.fromEntries(todos.map((g) => [g.nome, g.id]));
}

async function upsertProdutos(linhaIds, categoriaIds) {
  const produtos = [
    {
      nome: "Agachamento Smith",
      slug: "agachamento-smith",
      linha: "overall",
      categoria: "articulados",
      destaque: true,
      grupos: ["Pernas"],
      ficha: [
        { campo: "Dimensões (C x L x A)", valor: "1,60 x 1,40 x 2,20 m" },
        { campo: "Peso do equipamento", valor: "180 kg" },
        { campo: "Carga máxima suportada", valor: "300 kg" },
        { campo: "Garantia", valor: "2 anos" },
      ],
    },
    {
      nome: "Leg Press 45°",
      slug: "leg-press-45",
      linha: "excellence",
      categoria: "articulados",
      destaque: true,
      grupos: ["Pernas"],
      ficha: [
        { campo: "Dimensões (C x L x A)", valor: "2,10 x 1,20 x 1,50 m" },
        { campo: "Peso do equipamento", valor: "260 kg" },
        { campo: "Carga máxima suportada", valor: "500 kg" },
      ],
    },
    {
      nome: "Cadeira Extensora",
      slug: "cadeira-extensora",
      linha: "overall",
      categoria: "articulados",
      destaque: false,
      grupos: ["Pernas"],
      ficha: [{ campo: "Peso do equipamento", valor: "95 kg" }],
    },
    {
      nome: "Pulley Costas",
      slug: "pulley-costas",
      linha: "excellence",
      categoria: "articulados",
      destaque: true,
      grupos: ["Costas", "Bíceps"],
      ficha: [{ campo: "Peso do equipamento", valor: "140 kg" }],
    },
    {
      nome: "Supino Reto",
      slug: "supino-reto",
      linha: "body-line",
      categoria: "pesos-livres",
      destaque: false,
      grupos: ["Peitoral", "Tríceps"],
      ficha: [{ campo: "Peso do equipamento", valor: "85 kg" }],
    },
    {
      nome: "Esteira Profissional R3",
      slug: "esteira-profissional-r3",
      linha: "excellence",
      categoria: "cardio",
      destaque: true,
      grupos: ["Pernas"],
      ficha: [
        { campo: "Potência do motor", valor: "5 HP contínuo" },
        { campo: "Velocidade máxima", valor: "22 km/h" },
      ],
    },
    {
      nome: "Bicicleta Ergométrica Horizontal",
      slug: "bicicleta-ergometrica-horizontal",
      linha: "overall",
      categoria: "cardio",
      destaque: false,
      grupos: ["Pernas"],
      ficha: [{ campo: "Peso do equipamento", valor: "60 kg" }],
    },
    {
      nome: "Elíptico Profissional",
      slug: "eliptico-profissional",
      linha: "new-shape",
      categoria: "cardio",
      destaque: false,
      grupos: ["Pernas"],
      ficha: [{ campo: "Peso do equipamento", valor: "110 kg" }],
    },
    {
      nome: "Kit Halteres Emborrachados",
      slug: "kit-halteres-emborrachados",
      linha: "new-shape",
      categoria: "acessorios",
      destaque: false,
      grupos: ["Peitoral", "Costas", "Ombros", "Bíceps", "Tríceps"],
      ficha: [{ campo: "Faixa de peso", valor: "1 a 25 kg" }],
    },
    {
      nome: "Banco Livre Multiajuste",
      slug: "banco-livre-multiajuste",
      linha: "body-line",
      categoria: "pesos-livres",
      destaque: false,
      grupos: ["Peitoral", "Ombros"],
      ficha: [{ campo: "Peso do equipamento", valor: "35 kg" }],
    },
  ];

  const rows = produtos.map((p) => ({
    nome: p.nome,
    slug: p.slug,
    descricao: `${p.nome} — equipamento profissional de fabricação R3 Fitness, linha ${p.linha}.`,
    linha_id: linhaIds[p.linha] ?? null,
    categoria_id: categoriaIds[p.categoria] ?? null,
    fotos: [],
    ficha_tecnica: p.ficha,
    destaque: p.destaque,
    ativo: true,
    garantia: "2 anos",
  }));

  const { data, error } = await supabase
    .from("produtos")
    .upsert(rows, { onConflict: "slug" })
    .select("id, slug");
  if (error) throw error;

  const produtoIdBySlug = Object.fromEntries(data.map((r) => [r.slug, r.id]));

  return { produtos, produtoIdBySlug };
}

async function upsertProdutoGrupo(produtos, produtoIdBySlug, grupoIds) {
  await supabase
    .from("produto_grupo")
    .delete()
    .in("produto_id", Object.values(produtoIdBySlug));

  const rows = produtos.flatMap((p) =>
    p.grupos
      .map((nomeGrupo) => grupoIds[nomeGrupo])
      .filter(Boolean)
      .map((grupo_id) => ({
        produto_id: produtoIdBySlug[p.slug],
        grupo_id,
      })),
  );

  if (rows.length > 0) {
    const { error } = await supabase.from("produto_grupo").insert(rows);
    if (error) throw error;
  }
}

async function upsertDepoimentos() {
  const depoimentos = [
    {
      nome: "Marcelo Andrade",
      academia: "PowerFit Academia",
      cidade: "Ribeirão Preto/SP",
      texto:
        "Equipamos a academia inteira com a linha Overall. Robustez muito acima do que já tínhamos visto nesse preço.",
      aprovado: true,
    },
    {
      nome: "Juliana Prado",
      academia: "Studio Vita",
      cidade: "Campinas/SP",
      texto:
        "A R3 entendeu o espaço reduzido do nosso studio e sugeriu a Body Line. Ficou perfeito.",
      aprovado: true,
    },
    {
      nome: "Eduardo Lima",
      academia: "Bio Ritmo Norte",
      cidade: "São José do Rio Preto/SP",
      texto:
        "Montagem rápida, equipe atenciosa e suporte pós-venda que realmente responde. Recomendo.",
      aprovado: true,
    },
  ];

  const { error } = await supabase.from("depoimentos").upsert(depoimentos);
  if (error) throw error;
}

async function criarUsuarioSeTeste(email, nome, papel, senha) {
  const { data: existentes } = await supabase.auth.admin.listUsers();
  const jaExiste = existentes?.users?.find((u) => u.email === email);

  let userId = jaExiste?.id;
  if (!userId) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
    });
    if (error) throw error;
    userId = data.user.id;
  }

  const { error: dbError } = await supabase
    .from("usuarios")
    .upsert({ id: userId, nome, email, papel, ativo: true });
  if (dbError) throw dbError;

  return userId;
}

async function seedUsuarios() {
  const senha = "R3fitness#2026";
  const admin = await criarUsuarioSeTeste(
    "admin@r3fitness.com.br",
    "Marina Rocha",
    "admin",
    senha,
  );
  const vendedor = await criarUsuarioSeTeste(
    "rafael@r3fitness.com.br",
    "Rafael Souza",
    "vendedor",
    senha,
  );
  await criarUsuarioSeTeste(
    "camila@r3fitness.com.br",
    "Camila Duarte",
    "editor",
    senha,
  );

  console.log("\nUsuários de teste (senha para todos: " + senha + "):");
  console.log("  admin@r3fitness.com.br    (admin)");
  console.log("  rafael@r3fitness.com.br   (vendedor)");
  console.log("  camila@r3fitness.com.br   (editor)");
  console.log("Troque essas senhas depois do primeiro login.\n");

  return { adminId: admin, vendedorId: vendedor };
}

async function seedCotacoes(produtoIdBySlug, vendedorId) {
  const agora = Date.now();
  const diasAtras = (n) => new Date(agora - n * 86400000).toISOString();

  const cotacoes = [
    {
      nome: "Academia Corpo & Cia",
      whatsapp: "5517999990001",
      cidade: "São José do Rio Preto/SP",
      tipo_espaco: "Academia",
      produtos: [
        { produto_id: produtoIdBySlug["agachamento-smith"], nome: "Agachamento Smith", slug: "agachamento-smith", linha: "Overall", qtd: 1 },
      ],
      status: "novo",
      created_at: diasAtras(0),
    },
    {
      nome: "Studio Equilíbrio",
      whatsapp: "5517999990002",
      cidade: "Catanduva/SP",
      tipo_espaco: "Studio",
      produtos: [
        { produto_id: produtoIdBySlug["banco-livre-multiajuste"], nome: "Banco Livre Multiajuste", slug: "banco-livre-multiajuste", linha: "Body Line", qtd: 2 },
      ],
      status: "em_atendimento",
      vendedor_id: vendedorId,
      created_at: diasAtras(1),
    },
    {
      nome: "Condomínio Alto da Serra",
      whatsapp: "5517999990003",
      cidade: "Mirassol/SP",
      tipo_espaco: "Condomínio",
      produtos: [
        { produto_id: produtoIdBySlug["esteira-profissional-r3"], nome: "Esteira Profissional R3", slug: "esteira-profissional-r3", linha: "Excellence", qtd: 2 },
      ],
      status: "proposta",
      vendedor_id: vendedorId,
      created_at: diasAtras(4),
    },
    {
      nome: "PowerFit Academia",
      whatsapp: "5517999990004",
      cidade: "Ribeirão Preto/SP",
      tipo_espaco: "Academia",
      produtos: [
        { produto_id: produtoIdBySlug["leg-press-45"], nome: "Leg Press 45°", slug: "leg-press-45", linha: "Excellence", qtd: 1 },
        { produto_id: produtoIdBySlug["pulley-costas"], nome: "Pulley Costas", slug: "pulley-costas", linha: "Excellence", qtd: 1 },
      ],
      status: "fechado",
      vendedor_id: vendedorId,
      valor_venda: 24500,
      created_at: diasAtras(10),
      updated_at: diasAtras(6),
    },
    {
      nome: "Hotel Vista Verde",
      whatsapp: "5517999990005",
      cidade: "São Carlos/SP",
      tipo_espaco: "Hotel",
      produtos: [
        { produto_id: produtoIdBySlug["bicicleta-ergometrica-horizontal"], nome: "Bicicleta Ergométrica Horizontal", slug: "bicicleta-ergometrica-horizontal", linha: "Overall", qtd: 1 },
      ],
      status: "perdido",
      vendedor_id: vendedorId,
      created_at: diasAtras(15),
      updated_at: diasAtras(12),
    },
  ];

  // Insert em lote no PostgREST usa a união de colunas de todas as linhas;
  // campos ausentes viram NULL explícito em vez de cair no DEFAULT do banco.
  const cotacoesCompletas = cotacoes.map((c) => ({
    ...c,
    vendedor_id: c.vendedor_id ?? null,
    valor_venda: c.valor_venda ?? null,
    updated_at: c.updated_at ?? c.created_at,
  }));

  const { error } = await supabase.from("cotacoes").insert(cotacoesCompletas);
  if (error) throw error;
}

async function main() {
  console.log("Semeando linhas, categorias e grupos musculares...");
  const linhaIds = await upsertLinhas();
  const categoriaIds = await upsertCategorias();
  const grupoIds = await upsertGrupos();

  console.log("Semeando produtos...");
  const { produtos, produtoIdBySlug } = await upsertProdutos(
    linhaIds,
    categoriaIds,
  );
  await upsertProdutoGrupo(produtos, produtoIdBySlug, grupoIds);

  console.log("Semeando depoimentos...");
  await upsertDepoimentos();

  console.log("Criando usuários de teste...");
  const { vendedorId } = await seedUsuarios();

  console.log("Semeando cotações de exemplo...");
  await seedCotacoes(produtoIdBySlug, vendedorId);

  console.log("Seed concluído.");
}

main().catch((err) => {
  console.error("Erro ao rodar o seed:", err);
  process.exit(1);
});
