# specs/ — AGENTS.md

Specs são documentos de decisão escritos **antes** de implementar uma feature. Servem como contrato entre quem especifica e quem implementa.

---

## Quando criar uma spec

Sempre que a feature envolver:
- Nova dependência externa
- Decisão arquitetural com alternativas
- Múltiplos componentes/arquivos novos
- Integração com serviço externo

---

## Formato

```
specs/<kebab-case-da-feature>.md
```

### Estrutura obrigatória

```markdown
# Spec: <Nome da feature>

**Feature:** <Uma linha descrevendo o que será construído>
**Status:** Em especificação | Aprovada | Implementada
**Data:** YYYY-MM-DD

---

## Sumário executivo

O que será construído e por quê. 2–4 linhas.

---

## Decisão arquitetural

Tabela com as camadas da solução e justificativa de cada escolha.

---

## Especificação de implementação

Arquivos a criar, componentes, tipos, APIs — detalhado o suficiente para implementar sem perguntas.

---

## To-dos de implementação

Checklist prefixado com IDs rastreáveis (ex: `SETUP-1`, `API-2`).

---

## Perguntas em aberto

Dúvidas que precisam de resposta antes de implementar.

---

## Referências

Links relevantes (docs, repos analisados, etc).
```

### Seções opcionais (incluir quando relevante)

- **Pesquisa de alternativas** — quando houver libs/abordagens concorrentes avaliadas
- **Schema do banco** — quando envolver persistência
- **Dados de exemplo / seed** — quando necessário para testes

---

## Regras

- Spec é escrita **antes** do código, não depois
- Seção "Perguntas em aberto" deve ser respondida antes de implementar
- Status muda para `Implementada` quando todos os to-dos estiverem concluídos
- Manter em português (pt-BR), igual ao restante do projeto
