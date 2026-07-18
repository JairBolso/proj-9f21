# R3 Fitness

Site institucional + painel administrativo da R3 Fitness, em Next.js 15 (App Router), Tailwind CSS e Supabase.

## Stack

- **Next.js 15** (App Router, Server Components, Server Actions)
- **Tailwind CSS 3**
- **Supabase** (Postgres + Auth + Storage), via `@supabase/ssr`
- **TypeScript**

## Estrutura

```
app/
  (site)/            → site público (home, produtos, linhas, sobre, contato)
  admin/
    login/            → login (fora do shell do painel)
    403/               → página de acesso negado
    (dashboard)/       → shell do painel (sidebar + topbar) + todas as telas autenticadas
components/
  site/                → header, footer, cards, botão de WhatsApp
  admin/               → sidebar, DataTable, badges, switches, formulários
lib/
  supabase/            → clients (browser, server, middleware, admin/service-role)
  data/                → leituras (Server Components)
  actions/             → escritas (Server Actions)
supabase/
  migrations/0001_init.sql → schema completo + RLS + bucket de storage
scripts/seed.mjs        → dados de exemplo
```

## Configurar o projeto

1. **Instalar dependências**

   ```
   npm install
   ```

2. **Variáveis de ambiente** — copie `.env.example` para `.env.local` e preencha com as chaves do seu projeto Supabase (Project Settings → API):

   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   NEXT_PUBLIC_WHATSAPP_NUMBER=
   ```

   `SUPABASE_SERVICE_ROLE_KEY` é sensível — nunca é exposta ao navegador (só é usada em Server Actions/scripts) e não deve ser commitada.

3. **Rodar as migrations** — abra o SQL Editor do seu projeto Supabase e execute o conteúdo de `supabase/migrations/0001_init.sql`. Isso cria todas as tabelas, os enums, as policies de RLS e o bucket de storage `produtos`.

4. **(Opcional) Popular com dados de exemplo**

   ```
   npm run seed
   ```

   Cria linhas, categorias, grupos musculares, produtos, depoimentos, cotações de exemplo e três usuários de teste (um de cada papel — veja o e-mail/senha impressos no final do script). Troque as senhas depois do primeiro login.

5. **Rodar em desenvolvimento**

   ```
   npm run dev
   ```

   Site público em `/`, painel admin em `/admin`.

## Banco de dados

Tabelas: `usuarios`, `linhas`, `categorias`, `grupos_musculares`, `produtos`, `produto_grupo`, `cotacoes`, `depoimentos`, `integracoes`.

RLS habilitado em tudo:
- Leitura pública: `produtos`/`depoimentos` só os `ativo`/`aprovado`; `linhas`/`categorias`/`grupos_musculares`/`integracoes` sempre.
- Escrita: restrita por papel do usuário autenticado (`admin`, `vendedor`, `editor`) — ver comentários em `0001_init.sql`.
- `cotacoes`: qualquer visitante pode inserir (sem poder definir status/vendedor/valor); leitura e edição só para `admin`/`vendedor`.

## Papéis e acesso ao painel

| Papel | Acesso |
|---|---|
| `admin` | Tudo |
| `vendedor` | Dashboard + Cotações |
| `editor` | Catálogo (Produtos, Linhas, Categorias, Grupos Musculares) + Conteúdo (Depoimentos) |

Middleware (`middleware.ts`) bloqueia `/admin/*` sem sessão e redireciona para `/admin/403` quando o papel não tem acesso à rota.

## Deploy

Qualquer host com suporte a Next.js (Vercel é o caminho mais direto). Configure as mesmas variáveis de ambiente do `.env.local` no provedor de deploy.
