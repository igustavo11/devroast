# Spec: Drizzle ORM + PostgreSQL

**Feature:** Setup completo do Drizzle ORM com PostgreSQL via Docker Compose  
**Status:** Em especificação  
**Data:** 2026-03-15

---

## Sumário executivo

Implementar persistência de dados para o devroast usando Drizzle ORM com PostgreSQL. O sistema permitirá submeter código para "roast", salvar os resultados e exibir um leaderboard persistente.

---

## Decisão arquitetural

| Camada | Solução | Justificativa |
|---|---|---|
| ORM | **Drizzle ORM** | Leve, type-safe, zero runtime overhead, similar ao projeto |
| Banco | **PostgreSQL** | Robustez, JSON support, хорошо работает с Drizzle |
| Container | **Docker Compose** | Ambiente reprodutível localmente |
| API | **Next.js App Router** | Mesmo stack do projeto |

---

## Schema do banco

### Enums

```typescript
// src/db/enums.ts
export const roastModeEnum = pgEnum('roast_mode', ['brutal', 'roast']);

export const languageEnum = pgEnum('language', [
  'javascript',
  'typescript',
  'tsx',
  'jsx',
  'python',
  'rust',
  'go',
  'java',
  'kotlin',
  'swift',
  'c',
  'cpp',
  'csharp',
  'php',
  'ruby',
  'bash',
  'shell',
  'sql',
  'html',
  'css',
  'json',
  'yaml',
  'markdown',
  'plaintext',
]);
```

### Tabelas

#### `submissions`

Armazena cada código submetido para roast.

```typescript
// src/db/schema/submissions.ts
export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull(),
  language: languageEnum('language').notNull(),
  roastMode: roastModeEnum('roast_mode').notNull().default('roast'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
```

#### `roasts`

Armazena o resultado do roast (score + feedback).

```typescript
// src/db/schema/roasts.ts
export const roasts = pgTable('roasts', {
  id: uuid('id').primaryKey().defaultRandom(),
  submissionId: uuid('submission_id')
    .notNull()
    .references(() => submissions.id, { onDelete: 'cascade' }),
  score: real('score').notNull(), // 0-10
  feedback: jsonb('feedback').notNull(), // Array de issues/encontradas
  summary: text('summary').notNull(), // Resumo geral do roast
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
```

**Estrutura do `feedback` (JSONB):**

```typescript
type RoastFeedback = {
  line: number;
  column?: number;
  severity: 'error' | 'warning' | 'info' | 'suggestion';
  message: string;
  category?: string;
}[];
```

#### `leaderboard`

View materializada ou query agregada para ranking.

```typescript
// Leaderboard é uma view, não tabela
//SELECT 
//  s.id,
//  s.code_preview, -- primeiros 50 chars
//  s.language,
//  r.score,
//  s.created_at
//FROM submissions s
//JOIN roasts r ON r.submission_id = s.id
//ORDER BY r.score ASC -- piores primeiro
//LIMIT 100;
```

---

## Estrutura de arquivos

```
src/
  db/
    index.ts          # Conexão + drizzle config
    schema/
      index.ts        # Export de todas as tabelas
      submissions.ts  # Tabela submissions
      roasts.ts       # Tabela roasts
    enums.ts          # Enums do banco
    migrations/       # Drizzle Kit migrations
```

---

## Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: devroast-db
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast
      POSTGRES_DB: devroast
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U devroast"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

**Conexão (`.env.local`):**

```
DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast
```

---

## API Routes

### `POST /api/roast`

Submete código para roast.

**Request:**

```typescript
type RoastRequest = {
  code: string;
  language: string;
  roastMode: 'brutal' | 'roast';
};
```

**Response:**

```typescript
type RoastResponse = {
  id: string;
  score: number;
  feedback: RoastFeedback;
  summary: string;
};
```

**Fluxo:**
1. Recebe código + linguagem + modo
2. Salva em `submissions`
3. Chama AI para roast (mock ou integração futura)
4. Salva resultado em `roasts`
5. Retorna resultado

---

### `GET /api/leaderboard`

Retorna ranking dos piores códigos.

**Query params:**
- `limit` (default: 20, max: 100)
- `offset` (default: 0)

**Response:**

```typescript
type LeaderboardEntry = {
  rank: number;
  submissionId: string;
  codePreview: string; // Primeiros 80 chars
  language: string;
  score: number;
  createdAt: string;
};

type LeaderboardResponse = {
  entries: LeaderboardEntry[];
  total: number;
};
```

---

### `GET /api/submissions/[id]`

Recupera um roast específico pelo ID.

**Response:**

```typescript
type SubmissionDetail = {
  id: string;
  code: string;
  language: string;
  roastMode: string;
  roast: {
    score: number;
    feedback: RoastFeedback;
    summary: string;
  };
  createdAt: string;
};
```

---

## Drizzle Kit Setup

**Instalação:**

```bash
npm install drizzle-orm postgres dotenv
npm install -D drizzle-kit
```

**Configuração (`drizzle.config.ts`):**

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

**Scripts (`package.json`):**

```json
{
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:push": "drizzle-kit push",
  "db:studio": "drizzle-kit studio"
}
```

---

## To-dos de implementação

### Infraestrutura

- [ ] **DB-1** — Criar `docker-compose.yml` com PostgreSQL
- [ ] **DB-2** — Criar arquivo `.env.local` com `DATABASE_URL`
- [ ] **DB-3** — Instalar dependências: `drizzle-orm`, `postgres`, `dotenv`, `drizzle-kit`
- [ ] **DB-4** — Criar `src/db/enums.ts` com `roastModeEnum` e `languageEnum`
- [ ] **DB-5** — Criar `src/db/schema/submissions.ts`
- [ ] **DB-6** — Criar `src/db/schema/roasts.ts`
- [ ] **DB-7** — Criar `src/db/schema/index.ts` exportando tudo
- [ ] **DB-8** — Criar `src/db/index.ts` com conexão e helper queries
- [ ] **DB-9** — Configurar `drizzle.config.ts`
- [ ] **DB-10** — Adicionar scripts `db:generate`, `db:migrate`, `db:push`, `db:studio` no package.json

### API Routes

- [ ] **API-1** — Criar `POST /api/roast` endpoint
- [ ] **API-2** — Criar `GET /api/leaderboard` endpoint
- [ ] **API-3** — Criar `GET /api/submissions/[id]` endpoint
- [ ] **API-4** — Adicionar validação de input (zod)
- [ ] **API-5** — Implementar mock de AI roast (para teste inicial)

### Integração Frontend

- [ ] **FE-1** — Conectar botão "roast_my_code" ao endpoint POST /api/roast
- [ ] **FE-2** — Exibir resultado do roast (score + feedback)
- [ ] **FE-3** — Conectar leaderboard ao endpoint GET /api/leaderboard
- [ ] **FE-4** — Atualizar homepage para usar dados reais do banco

### Utilitários

- [ ] **UTIL-1** — Criar lib de queries helpers em `src/db/queries/`
- [ ] **UTIL-2** — Criar tipos compartilhados `src/types/roast.ts`
- [ ] **UTIL-3** — Adicionar seed script com dados de exemplo

---

## Dados de exemplo (seed)

```typescript
// src/db/seed.ts
const seed = async () => {
  // 3 submissions de exemplo
  await db.insert(submissions).values([
    {
      code: 'eval(prompt("enter code"))',
      language: 'javascript',
      roastMode: 'brutal',
    },
    {
      code: 'if (x == true) { return true; }',
      language: 'typescript',
      roastMode: 'roast',
    },
    {
      code: 'SELECT * FROM users WHERE 1=1',
      language: 'sql',
      roastMode: 'roast',
    },
  ]);

  // Roasts correspondentes (scores baixos = piores)
  await db.insert(roasts).values([
    { submissionId: '...', score: 1.2, feedback: [...], summary: '...' },
    { submissionId: '...', score: 1.8, feedback: [...], summary: '...' },
    { submissionId: '...', score: 2.1, feedback: [...], summary: '...' },
  ]);
};
```

---

## Perguntas em aberto

> Estas perguntas precisam de resposta antes da implementação.

1. **Mock vs AI real:** O roast inicial deve usar um mock (retornar score/feedback aleatório) ou já integrar com uma AI? Se AI, qual provedor (OpenAI, Anthropic, local)?

2. **Feedback detalhado:** A estrutura do `feedback` JSONB está adequada? Precisa adicionar mais campos (ex: código corrigido sugerido)?

3. **Limite de código:** Há limite máximo de caracteres por submissão? O banco suporta textos longos (Text no PostgreSQL é ilimitado, masconvém validar).

4. **Rate limiting:** Precisamos de rate limiting para evitar spam de submissions? Mesmo sem auth, podemos limitar por IP.

---

## Referências

- [Drizzle ORM — Getting Started](https://orm.drizzle.team/)
- [Drizzle Kit — CLI](https://orm.drizzle.team/kit-docs/overview)
- [Drizzle + PostgreSQL](https://orm.drizzle.team/docs/postgresql)
- [Next.js App Router — API Routes](https://nextjs.org/docs/app/building-your-application/routing)
