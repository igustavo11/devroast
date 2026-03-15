# Spec: tRPC como camada de API

**Feature:** Substituir as API Routes manuais por tRPC com suporte a Server Components/SSR  
**Status:** Em especificação  
**Data:** 2026-03-15

---

## Sumário executivo

Migrar a camada de API do devroast (`/api/roast`, `/api/leaderboard`, `/api/submissions/[id]`) para tRPC v11, usando a integração oficial com Next.js App Router. O tRPC fornece type-safety end-to-end sem geração de código e permite chamar procedures diretamente em Server Components via caller server-side, eliminando fetch HTTP desnecessário no servidor.

---

## Decisão arquitetural

| Camada | Solução | Justificativa |
|---|---|---|
| Framework de API | **tRPC v11** | Type-safety E2E, sem codegen, integração nativa com Next.js App Router |
| Client-side data fetching | **@tanstack/react-query** (via `@trpc/react-query`) | Já é o padrão do ecossistema tRPC; cache, loading states e refetch automático |
| SSR / Server Components | **createHydrationHelpers** (`@trpc/react-query/rsc`) | Permite prefetch no servidor + hydration no cliente sem duplicar requests |
| Transformação de dados | **superjson** | Serializa `Date`, `BigInt`, `undefined` corretamente entre servidor e cliente |
| Adapter HTTP | **fetchRequestHandler** | Compatível com Edge Runtime e Next.js App Router |

**Por que não manter as API Routes manuais?** Sem tRPC, cada novo endpoint exige tipagem manual de request/response, validação repetida com Zod e `fetch` no cliente sem type inference. tRPC elimina esse boilerplate inteiramente.

---

## Estrutura de arquivos

```
src/
  trpc/
    init.ts              # initTRPC + createTRPCContext + baseProcedure
    query-client.ts      # makeQueryClient (compartilhado server/client)
    server.ts            # caller server-side + createHydrationHelpers (server-only)
    client.tsx           # createTRPCReact + TRPCProvider ('use client')
    routers/
      _app.ts            # appRouter (root — merge de todos os sub-routers)
      roast.ts           # procedures: roast.submit, roast.getById
      leaderboard.ts     # procedures: leaderboard.list
  app/
    api/
      trpc/
        [trpc]/
          route.ts       # fetchRequestHandler (substitui as 3 routes manuais)
    layout.tsx           # TRPCProvider injetado aqui (wraps toda a app)
```

As routes manuais existentes (`/api/roast`, `/api/leaderboard`, `/api/submissions/[id]`) serão **removidas** após migração.

---

## Especificação de implementação

### `src/trpc/init.ts`

Inicialização central. Exporta os helpers usados em todos os routers.

```typescript
import { initTRPC } from '@trpc/server'
import { cache } from 'react'
import superjson from 'superjson'
import { z } from 'zod'

export const createTRPCContext = cache(async () => {
  // Espaço para injetar auth, db, etc futuramente
  return {}
})

const t = initTRPC.create({
  transformer: superjson,
})

export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure
```

### `src/trpc/query-client.ts`

Instância compartilhada do QueryClient com config padrão.

```typescript
import { QueryClient } from '@tanstack/react-query'
import superjson from 'superjson'

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30 * 1000 },
      dehydrate: { serializeData: superjson.serialize },
      hydrate: { deserializeData: superjson.deserialize },
    },
  })
}
```

### `src/trpc/server.ts` — server-only

Caller para uso direto em Server Components. Nunca importar no cliente.

```typescript
import 'server-only'
import { createHydrationHelpers } from '@trpc/react-query/rsc'
import { cache } from 'react'
import { createCallerFactory, createTRPCContext } from './init'
import { makeQueryClient } from './query-client'
import { appRouter } from './routers/_app'

export const getQueryClient = cache(makeQueryClient)
const caller = createCallerFactory(appRouter)(createTRPCContext)
export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient,
)
```

### `src/trpc/client.tsx` — client-only

Provider React para Client Components. Importado no `layout.tsx`.

```tsx
'use client'
import type { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import superjson from 'superjson'
import { useState } from 'react'
import { makeQueryClient } from './query-client'
import type { AppRouter } from './routers/_app'

export const trpc = createTRPCReact<AppRouter>()

let clientQueryClientSingleton: QueryClient

function getQueryClient() {
  if (typeof window === 'undefined') return makeQueryClient()
  return (clientQueryClientSingleton ??= makeQueryClient())
}

function getUrl() {
  const base = typeof window !== 'undefined'
    ? ''
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
  return `${base}/api/trpc`
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [httpBatchLink({ url: getUrl(), transformer: superjson })],
    }),
  )
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
```

### `src/app/api/trpc/[trpc]/route.ts`

Único handler HTTP para todas as procedures.

```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { createTRPCContext } from '~/trpc/init'
import { appRouter } from '~/trpc/routers/_app'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  })

export { handler as GET, handler as POST }
```

### Routers

#### `src/trpc/routers/roast.ts`

```typescript
// Procedures:
// roast.submit   — mutation: recebe code + language + roastMode, salva e retorna resultado
// roast.getById  — query:    recebe id, retorna submission + roast completo
```

Migração direta da lógica de `POST /api/roast` e `GET /api/submissions/[id]`.

#### `src/trpc/routers/leaderboard.ts`

```typescript
// Procedures:
// leaderboard.list — query: recebe { limit, offset }, retorna entries + total
```

Migração direta da lógica de `GET /api/leaderboard`.

#### `src/trpc/routers/_app.ts`

```typescript
import { createTRPCRouter } from '../init'
import { roastRouter } from './roast'
import { leaderboardRouter } from './leaderboard'

export const appRouter = createTRPCRouter({
  roast: roastRouter,
  leaderboard: leaderboardRouter,
})

export type AppRouter = typeof appRouter
```

### Integração com Server Components (SSR)

Prefetch no servidor — dados chegam hidratados no cliente sem waterfall:

```tsx
// src/app/leaderboard/page.tsx
import { trpc, HydrateClient } from '~/trpc/server'

export default async function LeaderboardPage() {
  void trpc.leaderboard.list.prefetch({ limit: 20, offset: 0 })
  return (
    <HydrateClient>
      <LeaderboardClient />
    </HydrateClient>
  )
}
```

### Uso em Client Components

```tsx
'use client'
import { trpc } from '~/trpc/client'

export function LeaderboardClient() {
  const [data] = trpc.leaderboard.list.useSuspenseQuery({ limit: 20, offset: 0 })
  // ...
}
```

---

## Dependências a instalar

| Pacote | Motivo |
|---|---|
| `@trpc/server` | Core do tRPC — routers, procedures, context |
| `@trpc/client` | Client HTTP (`httpBatchLink`) |
| `@trpc/react-query` | Integração com TanStack React Query + RSC helpers |
| `@tanstack/react-query` | QueryClient, hooks, hydration |
| `superjson` | Serialização de tipos ricos (Date, etc.) |

```bash
npm install @trpc/server @trpc/client @trpc/react-query @tanstack/react-query superjson
```

---

## To-dos de implementação

### Setup base

- [ ] **TRPC-1** — Instalar dependências
- [ ] **TRPC-2** — Criar `src/trpc/init.ts` com `createTRPCContext`, `createTRPCRouter`, `createCallerFactory`, `baseProcedure`
- [ ] **TRPC-3** — Criar `src/trpc/query-client.ts` com `makeQueryClient` + superjson config
- [ ] **TRPC-4** — Criar `src/trpc/server.ts` (server-only) com `getQueryClient`, `trpc`, `HydrateClient`
- [ ] **TRPC-5** — Criar `src/trpc/client.tsx` com `TRPCProvider` e `trpc` (createTRPCReact)
- [ ] **TRPC-6** — Criar `src/app/api/trpc/[trpc]/route.ts` com `fetchRequestHandler`
- [ ] **TRPC-7** — Injetar `TRPCProvider` no `src/app/layout.tsx`

### Routers

- [ ] **ROUTER-1** — Criar `src/trpc/routers/roast.ts` com `roast.submit` e `roast.getById`
- [ ] **ROUTER-2** — Criar `src/trpc/routers/leaderboard.ts` com `leaderboard.list`
- [ ] **ROUTER-3** — Criar `src/trpc/routers/_app.ts` com `appRouter` e `AppRouter` type

### Migração

- [ ] **MIG-1** — Migrar lógica de `POST /api/roast` → `roast.submit` mutation
- [ ] **MIG-2** — Migrar lógica de `GET /api/submissions/[id]` → `roast.getById` query
- [ ] **MIG-3** — Migrar lógica de `GET /api/leaderboard` → `leaderboard.list` query
- [ ] **MIG-4** — Atualizar homepage: substituir `fetch('/api/roast')` por `trpc.roast.submit.useMutation()`
- [ ] **MIG-5** — Atualizar leaderboard page: prefetch no Server Component + `useSuspenseQuery` no Client Component
- [ ] **MIG-6** — Atualizar roast result page (`/roast/[id]`): prefetch server-side com `trpc.roast.getById.prefetch()`
- [ ] **MIG-7** — Remover as 3 API Routes manuais após validação

### Validação

- [ ] **VAL-1** — Testar que prefetch no servidor funciona (sem waterfall no Network tab)
- [ ] **VAL-2** — Testar mutation de roast end-to-end com type inference no cliente
- [ ] **VAL-3** — Verificar que erros do Zod chegam tipados no cliente via `TRPCClientError`

---

## Perguntas em aberto

1. **Auth context:** O `createTRPCContext` deve já injetar sessão de usuário (futuro) ou manter vazio por ora?

2. **Migração gradual vs big-bang:** Migrar as 3 routes de uma vez ou manter as routes manuais em paralelo durante a transição?

3. **`protectedProcedure`:** Vale já criar um middleware de procedure protegida (que verifica auth) mesmo sem auth implementado, para deixar a estrutura pronta?

---

## Referências

- [tRPC — Server Components setup](https://trpc.io/docs/client/tanstack-react-query/server-components)
- [tRPC — TanStack React Query setup](https://trpc.io/docs/client/tanstack-react-query/setup)
- [tRPC — fetchRequestHandler (Next.js App Router)](https://trpc.io/docs/client/react/server-components)
- [TanStack React Query — Hydration / SSR](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)
