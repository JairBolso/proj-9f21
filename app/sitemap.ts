import type { MetadataRoute } from "next";
import { getProdutosAtivos } from "@/lib/data/produtos";

const BASE_URL = "https://r3fitness.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const produtos = await getProdutosAtivos();

  const paginasEstaticas: MetadataRoute.Sitemap = [
    "",
    "/produtos",
    "/linhas",
    "/sobre",
    "/contato",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const paginasProdutos: MetadataRoute.Sitemap = produtos.map((produto) => ({
    url: `${BASE_URL}/produtos/${produto.slug}`,
    lastModified: new Date(),
  }));

  return [...paginasEstaticas, ...paginasProdutos];
}
