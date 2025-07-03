# Script de Setup Inicial para Projetos Next.js 14

Este script automatiza a criação e configuração inicial de projetos Next.js 14 com as melhores práticas de UI, IA, Supabase, testes e git, de forma interativa e personalizada, utilizando **pnpm** como gerenciador de pacotes.

## Por que usar pnpm?

- **Performance superior:** Instala dependências muito mais rápido que npm/yarn.
- **Eficiência de espaço:** Usa links simbólicos, economizando espaço em disco.
- **Ideal para projetos modernos:** Perfeito para stacks com Next.js, IA, Supabase, monorepos e times que buscam produtividade.
- **Recomendado por grandes projetos:** Ferramentas como Vercel, TurboRepo, Astro e outras já recomendam pnpm.

## O que este projeto faz

- **Cria um projeto Next.js 14** com a estrutura `src/`, TypeScript e TailwindCSS.
- **Instala dependências de forma modular** para UI, IA (incluindo LangChain e Vercel AI SDK) e Testes (Jest).
- **Configura o ShadCN UI de forma robusta e automatizada**, preparando todo o ambiente (`components.json`, `utils.ts`, `tailwind.config.ts`) antes de adicionar os componentes.
- **Inicializa um repositório Git** com um primeiro commit.
- **Oferece um fluxo de execução com tratamento de erros**, guiando o usuário em caso de falhas.

## Por que incluir o AI SDK da Vercel?

- O [AI SDK da Vercel](https://sdk.vercel.ai/) facilita a integração de IA generativa (OpenAI, modelos customizados, etc) em apps Next.js/React.
- Permite usar hooks e utilitários prontos para chat, streaming, geração de texto e muito mais.
- Já inclui integração com validação de dados via zod.
- Deixa seu projeto pronto para experimentar e escalar soluções de IA modernas.

## Quando usar este script

- Sempre que você ou seu time quiserem iniciar rapidamente um novo projeto Next.js 14 com uma stack moderna e padronizada.
- Para garantir que todos os projetos criados sigam as melhores práticas desde o início, evitando erros manuais e setups inconsistentes.
- Para acelerar o onboarding de novos desenvolvedores, já entregando um ambiente pronto para codar.
- Ideal para times que usam Next.js, Supabase, LangChain, OpenAI, ShadCN UI e prezam por testes automatizados.

## Benefícios

- **Padronização:** Todos os projetos começam com a mesma base, facilitando manutenção e colaboração.
- **Produtividade:** Economiza tempo, evitando comandos repetitivos e setups manuais.
- **Flexibilidade:** Permite escolher, via perguntas interativas, quais partes do stack instalar.
- **Robustez:** O script é modularizado e possui tratamento de erros, garantindo uma execução mais segura.
- **Evolução fácil:** Basta atualizar o script para refletir novas melhores práticas ou dependências.

## Pré-requisitos

- Node.js 18+
- **pnpm** instalado globalmente ([veja como instalar](https://pnpm.io/installation))
- Acesso ao terminal (Windows, Mac ou Linux)

## Instalação das dependências do script

Antes de rodar o script pela primeira vez, instale suas dependências globais:

```
pnpm add -g inquirer execa chalk
```

## Como usar

1. **Coloque o arquivo `setup-project.mjs` em uma pasta de sua preferência.**
2. **No terminal, navegue até essa pasta.**
3. **Execute o script:**

```
node setup-project.mjs
```

4. **Responda às perguntas do assistente interativo.**

## O que o script faz

- **Criação do Projeto**: Inicia um projeto Next.js 14 com a estrutura recomendada (`src/`), TypeScript, TailwindCSS e ESLint.
- **Instalação de Dependências**: Instala de forma seletiva e interativa as dependências para:
  - **UI**: `lucide-react`, `zustand`, `react-hook-form`, `tailwindcss-animate` e utilitários.
  - **IA**: `LangChain`, `Supabase`, e o **AI SDK da Vercel** (`ai`, `@ai-sdk/react`, `@ai-sdk/openai`, `zod`).
  - **Testes**: `Jest` e `React Testing Library`.
- **Configuração Automatizada do ShadCN UI**: Se selecionado, o script:
  - Configura programaticamente o `components.json` para a estrutura `src/`.
  - Cria o arquivo `src/lib/utils.ts` com a função `cn` necessária.
  - Sobrescreve `tailwind.config.ts` e `src/app/globals.css` com as configurações e variáveis de tema do ShadCN.
  - Adiciona automaticamente uma lista pré-definida dos componentes mais comuns (`button`, `card`, `input`, etc.).
- **Controle de Versão**: Se selecionado, inicializa um repositório Git e cria um commit inicial.
- **Feedback e Robustez**: Possui tratamento de erros que informa o usuário em caso de falha e guia sobre como proceder, evitando projetos em estado inconsistente.

## Observações

- Para usar Supabase, lembre-se de rodar os comandos apropriados e configurar suas variáveis de ambiente em um arquivo `.env`.
  ```
  npx supabase init
  supabase gen types typescript --local > types/supabase-generated.ts
  ```
- O script não sobrescreve projetos existentes com o mesmo nome.
- Para customizar os pacotes ou componentes instalados, edite as constantes no topo do arquivo `setup-project.mjs`.

---

Qualquer dúvida ou sugestão, fique à vontade para abrir um issue ou contribuir! 
