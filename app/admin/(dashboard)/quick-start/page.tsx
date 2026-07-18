import type { Metadata } from "next";
import Link from "next/link";
import {
  LayoutDashboard,
  MessageCircle,
  Package,
  Layers,
  Grid3x3,
  Dumbbell,
  Star,
  Settings,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";

export const metadata: Metadata = { title: "Quick Start" };

const CARDS = [
  {
    icon: LayoutDashboard,
    titulo: "Dashboard",
    href: "/admin",
    descricao:
      "Acompanhe leads, atendimentos, vendas fechadas e receita nas janelas de hoje, 7 e 30 dias.",
  },
  {
    icon: MessageCircle,
    titulo: "Cotações",
    href: "/admin/cotacoes",
    descricao:
      "Gerencie os leads recebidos pelo site: mude o status, atribua um vendedor e registre o valor da venda.",
  },
  {
    icon: Package,
    titulo: "Produtos",
    href: "/admin/produtos",
    descricao:
      "Cadastre e edite os produtos exibidos no catálogo público, com fotos, ficha técnica e destaque na home.",
  },
  {
    icon: Layers,
    titulo: "Linhas",
    href: "/admin/linhas",
    descricao: "Gerencie as linhas de produtos (Excellence, Overall, etc).",
  },
  {
    icon: Grid3x3,
    titulo: "Categorias",
    href: "/admin/categorias",
    descricao: "Organize os produtos por categoria (Cardio, Pesos Livres...).",
  },
  {
    icon: Dumbbell,
    titulo: "Grupos Musculares",
    href: "/admin/grupos-musculares",
    descricao: "Cadastre os grupos musculares usados na ficha dos produtos.",
  },
  {
    icon: Star,
    titulo: "Depoimentos",
    href: "/admin/depoimentos",
    descricao: "Aprove os depoimentos que aparecem na home do site.",
  },
  {
    icon: Settings,
    titulo: "Integrações",
    href: "/admin/integracoes",
    descricao: "Configure o Meta Pixel, o GTM e scripts customizados do site.",
  },
  {
    icon: Users,
    titulo: "Usuários",
    href: "/admin/usuarios",
    descricao: "Gerencie quem tem acesso ao painel e qual o papel de cada um.",
  },
];

export default function QuickStartPage() {
  return (
    <div>
      <PageHeader
        title="Quick Start"
        subtitle="Um resumo rápido de cada área do painel"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CARDS.map((card) => (
          <Link
            key={card.titulo}
            href={card.href}
            className="bg-admin-card border border-admin-border p-6 hover:border-admin-accent transition-colors"
          >
            <card.icon size={22} strokeWidth={1.8} className="text-admin-accent" />
            <h2 className="mt-4 font-mono font-bold text-[14px] uppercase text-admin-text">
              {card.titulo}
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-admin-textMuted">
              {card.descricao}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
