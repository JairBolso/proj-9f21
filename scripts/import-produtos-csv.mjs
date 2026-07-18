// Importa o catálogo real da R3 a partir do export do WooCommerce.
//
//   node --env-file=.env.local scripts/import-produtos-csv.mjs
//
// Baixa as fotos para produtos/imagens/, sobe pro Storage (bucket "produtos")
// e grava produtos/linhas/categorias no banco.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { parse } from "csv-parse/sync";
import { createClient } from "@supabase/supabase-js";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSV_PATH = path.join(__dirname, "..", "produtos", "produtos_da_R3.csv");
const IMG_DIR = path.join(__dirname, "..", "produtos", "imagens");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Nomes de "Linha X" no CSV normalizados para o nome de exibição que usamos.
const LINHA_DISPLAY = {
  "body line": "Body Line",
  "new shape": "New Shape",
  excellence: "Excellence",
  "peso livre": "Peso Livre",
  articulados: "Articulados",
  cardio: "Cardio",
  "articulado overall": "Overall",
  acessorios: "Acessórios",
  acessórios: "Acessórios",
};

// Linhas que já existiam no mockup aprovado — continuam em destaque na home.
const LINHAS_HOME = new Set(["Excellence", "Overall", "Body Line", "New Shape"]);

const CATEGORIA_IGNORAR = new Set(["equipamentos", "lançamento", "lancamento"]);

function parseCategorias(campo) {
  if (!campo) return { linha: null, categoria: null, destaque: false };
  const tags = campo
    .split(",")
    .map((t) => t.trim().replace(/\s+/g, " "))
    .filter(Boolean);

  let linha = null;
  let categoria = null;
  let destaque = false;

  for (const tag of tags) {
    const lower = tag.toLowerCase();
    if (lower === "lançamento" || lower === "lancamento") {
      destaque = true;
      continue;
    }
    if (lower.startsWith("linha ")) {
      const nome = lower.replace(/^linha\s+/, "");
      linha = LINHA_DISPLAY[nome] ?? tag.replace(/^linha\s+/i, "");
      continue;
    }
    if (!CATEGORIA_IGNORAR.has(lower)) {
      categoria = tag;
    }
  }

  return { linha, categoria, destaque };
}

async function baixarImagem(url) {
  const nomeArquivo = decodeURIComponent(url.split("/").pop());
  const destino = path.join(IMG_DIR, nomeArquivo);

  if (!existsSync(destino)) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} ao baixar ${url}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    writeFileSync(destino, buffer);
  }

  return destino;
}

async function subirParaStorage(caminhoLocal, nomeArquivo) {
  const buffer = readFileSync(caminhoLocal);
  const ext = path.extname(nomeArquivo).slice(1) || "jpg";
  const chave = `catalogo/${slugify(path.basename(nomeArquivo, path.extname(nomeArquivo)))}-${Date.now().toString(36)}.${ext}`;

  const contentTypeMap = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };

  const { error } = await supabase.storage
    .from("produtos")
    .upload(chave, buffer, {
      contentType: contentTypeMap[ext.toLowerCase()] ?? "image/jpeg",
      cacheControl: "31536000",
      upsert: false,
    });
  if (error) throw error;

  const { data } = supabase.storage.from("produtos").getPublicUrl(chave);
  return data.publicUrl;
}

async function upsertLinha(nome, exibirHome) {
  const slug = slugify(nome);
  const { data: existente } = await supabase
    .from("linhas")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (existente) return existente.id;

  const { data, error } = await supabase
    .from("linhas")
    .insert({ nome, slug, exibir_home: exibirHome })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

async function upsertCategoria(nome) {
  const slug = slugify(nome);
  const { data: existente } = await supabase
    .from("categorias")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (existente) return existente.id;

  const { data, error } = await supabase
    .from("categorias")
    .insert({ nome, slug, exibir_home: true })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

async function main() {
  if (!existsSync(IMG_DIR)) mkdirSync(IMG_DIR, { recursive: true });

  const csv = readFileSync(CSV_PATH, "utf8");
  const linhas = parse(csv, { columns: true, relax_column_count: true });

  const publicados = linhas.filter((row) => row["Publicado"] === "1");
  console.log(`${publicados.length} produtos publicados no CSV.`);

  // Remove o catálogo fictício do seed anterior para dar lugar ao real.
  console.log("Limpando catálogo de exemplo anterior...");
  await supabase.from("produto_grupo").delete().not("produto_id", "is", null);
  await supabase.from("produtos").delete().not("id", "is", null);
  for (const slug of ["cardio", "articulados", "pesos-livres", "acessorios"]) {
    await supabase.from("categorias").delete().eq("slug", slug);
  }
  // Limpa resíduo de uma execução anterior que não tratou o NBSP em "Linha Acessorios".
  await supabase.from("categorias").delete().like("slug", "linha-%");

  const linhaCache = new Map();
  const categoriaCache = new Map();
  const imagemCache = new Map(); // url original -> public URL no storage
  const slugsUsados = new Set();

  let importados = 0;
  let comFalha = 0;

  for (const row of publicados) {
    const nome = row["Nome"]?.trim();
    if (!nome) continue;

    const { linha, categoria, destaque } = parseCategorias(row["Categorias"]);

    let linhaId = null;
    if (linha) {
      if (!linhaCache.has(linha)) {
        linhaCache.set(linha, await upsertLinha(linha, LINHAS_HOME.has(linha)));
      }
      linhaId = linhaCache.get(linha);
    }

    let categoriaId = null;
    if (categoria) {
      if (!categoriaCache.has(categoria)) {
        categoriaCache.set(categoria, await upsertCategoria(categoria));
      }
      categoriaId = categoriaCache.get(categoria);
    }

    const imagensCsv = (row["Imagens"] ?? "")
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean);

    const fotos = [];
    for (const url of imagensCsv.slice(0, 4)) {
      try {
        if (!imagemCache.has(url)) {
          const local = await baixarImagem(url);
          const publicUrl = await subirParaStorage(local, path.basename(local));
          imagemCache.set(url, publicUrl);
        }
        fotos.push(imagemCache.get(url));
      } catch (err) {
        console.warn(`  ! Falha na imagem de "${nome}": ${err.message}`);
      }
    }

    let slugBase = slugify(linha ? `${nome}-${linha}` : nome);
    let slug = slugBase;
    let i = 2;
    while (slugsUsados.has(slug)) {
      slug = `${slugBase}-${i}`;
      i += 1;
    }
    slugsUsados.add(slug);

    const { error } = await supabase.from("produtos").insert({
      nome,
      slug,
      descricao: null,
      linha_id: linhaId,
      categoria_id: categoriaId,
      fotos,
      ficha_tecnica: [],
      destaque,
      ativo: true,
      garantia: "2 anos",
    });

    if (error) {
      console.warn(`  ! Falha ao gravar "${nome}": ${error.message}`);
      comFalha += 1;
    } else {
      importados += 1;
    }
  }

  console.log(`\nImportação concluída: ${importados} produtos, ${comFalha} falhas.`);
  console.log(`Linhas: ${Array.from(linhaCache.keys()).join(", ")}`);
  console.log(`Categorias: ${Array.from(categoriaCache.keys()).join(", ")}`);
}

main().catch((err) => {
  console.error("Erro na importação:", err);
  process.exit(1);
});
