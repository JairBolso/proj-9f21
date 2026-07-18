import type { Papel } from "@/lib/supabase/database.types";

export interface AdminNavItem {
  id: string;
  label: string;
  href: string;
  section: "Geral" | "Catálogo" | "Conteúdo" | "Sistema";
  roles: Papel[];
  exact?: boolean;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    id: "quick-start",
    label: "Quick Start",
    href: "/admin/quick-start",
    section: "Geral",
    roles: ["admin", "vendedor", "editor"],
  },
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/admin",
    section: "Geral",
    roles: ["admin", "vendedor"],
    exact: true,
  },
  {
    id: "cotacoes",
    label: "Cotações",
    href: "/admin/cotacoes",
    section: "Geral",
    roles: ["admin", "vendedor"],
  },
  {
    id: "produtos",
    label: "Produtos",
    href: "/admin/produtos",
    section: "Catálogo",
    roles: ["admin", "editor"],
  },
  {
    id: "linhas",
    label: "Linhas",
    href: "/admin/linhas",
    section: "Catálogo",
    roles: ["admin", "editor"],
  },
  {
    id: "categorias",
    label: "Categorias",
    href: "/admin/categorias",
    section: "Catálogo",
    roles: ["admin", "editor"],
  },
  {
    id: "grupos-musculares",
    label: "Grupos Musculares",
    href: "/admin/grupos-musculares",
    section: "Catálogo",
    roles: ["admin", "editor"],
  },
  {
    id: "depoimentos",
    label: "Depoimentos",
    href: "/admin/depoimentos",
    section: "Conteúdo",
    roles: ["admin", "editor"],
  },
  {
    id: "conteudo",
    label: "Conteúdo do Site",
    href: "/admin/conteudo",
    section: "Conteúdo",
    roles: ["admin", "editor"],
  },
  {
    id: "politicas",
    label: "Páginas de Política",
    href: "/admin/politicas",
    section: "Conteúdo",
    roles: ["admin", "editor"],
  },
  {
    id: "integracoes",
    label: "Integrações",
    href: "/admin/integracoes",
    section: "Sistema",
    roles: ["admin"],
  },
  {
    id: "usuarios",
    label: "Usuários",
    href: "/admin/usuarios",
    section: "Sistema",
    roles: ["admin"],
  },
];

export interface AdminActionItem {
  id: string;
  label: string;
  descricao: string;
  roles: Papel[];
  // Quando true, admin sempre pode e a célula dele fica travada no modal.
  // Quando false, o próprio admin pode ter a ação bloqueada (ex: exclusão).
  adminForcado: boolean;
}

interface AdminActionDefault {
  id: string;
  label: string;
  descricao: string;
  rolesPadrao: Papel[];
  adminForcado: boolean;
}

// Ações dentro de telas (não páginas inteiras) que também podem ser
// restritas por papel, controladas na tabela `permissoes`.
const ADMIN_ACTION_DEFAULTS: AdminActionDefault[] = [
  {
    id: "cotacoes.atribuir_vendedor",
    label: "Reatribuir vendedor responsável",
    descricao: "Trocar quem é o vendedor responsável por uma cotação",
    rolesPadrao: ["admin"],
    adminForcado: true,
  },
  {
    id: "cotacoes.excluir_lead",
    label: "Excluir lead / cotação",
    descricao: "Selecionar e apagar cotações na listagem (irreversível)",
    rolesPadrao: ["admin"],
    adminForcado: false,
  },
];

export const ADMIN_ACTION_ITEMS: AdminActionItem[] = ADMIN_ACTION_DEFAULTS.map(
  ({ rolesPadrao, ...rest }) => ({ ...rest, roles: rolesPadrao }),
);

export function resolverAcoes(overrides: PermissaoOverride[]): AdminActionItem[] {
  return ADMIN_ACTION_DEFAULTS.map((item) => {
    const roles = new Set<Papel>(item.rolesPadrao);
    for (const o of overrides) {
      if (o.item_id !== item.id) continue;
      if (o.permitido) roles.add(o.papel);
      else roles.delete(o.papel);
    }
    if (item.adminForcado) roles.add("admin");
    return {
      id: item.id,
      label: item.label,
      descricao: item.descricao,
      adminForcado: item.adminForcado,
      roles: Array.from(roles),
    };
  });
}

export function papelPodeExecutarAcao(
  papel: Papel,
  actionId: string,
  acoes: AdminActionItem[],
): boolean {
  const acao = acoes.find((a) => a.id === actionId);
  if (!acao) return false;
  if (papel === "admin" && acao.adminForcado) return true;
  return acao.roles.includes(papel);
}

export function papelPodeAcessar(
  papel: Papel,
  pathname: string,
  navItems: AdminNavItem[] = ADMIN_NAV_ITEMS,
): boolean {
  if (
    pathname === "/admin/login" ||
    pathname === "/admin/403" ||
    pathname === "/admin/perfil"
  )
    return true;

  return navItems.some((item) => {
    if (!item.roles.includes(papel)) return false;
    return item.exact
      ? pathname === item.href
      : pathname.startsWith(item.href);
  });
}

export interface PermissaoOverride {
  papel: Papel;
  item_id: string;
  permitido: boolean;
}

// "usuarios" precisa continuar acessível para admin sempre: é a única tela
// que permite editar permissões, então revogar esse acesso travaria o
// próprio admin para fora da tela que desfaz o erro.
const ITEM_TRAVADO_ADMIN = "usuarios";

// Aplica os overrides salvos no banco sobre os papéis padrão definidos em
// ADMIN_NAV_ITEMS. Sem override para um (papel, item) = vale o padrão.
export function resolverNavItems(
  overrides: PermissaoOverride[],
): AdminNavItem[] {
  return ADMIN_NAV_ITEMS.map((item) => {
    const roles = new Set<Papel>(item.roles);
    for (const o of overrides) {
      if (o.item_id !== item.id) continue;
      if (o.permitido) roles.add(o.papel);
      else roles.delete(o.papel);
    }
    if (item.id === ITEM_TRAVADO_ADMIN) roles.add("admin");
    return { ...item, roles: Array.from(roles) };
  });
}
