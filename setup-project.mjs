import inquirer from 'inquirer';
import execa from 'execa';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

// --- Configuração Centralizada ---
const UI_DEPENDENCIES = [
  'lucide-react', 'react-markdown', 'zustand', 'react-hook-form', 'clsx', 
  'tailwind-merge', 'class-variance-authority', 'tailwindcss-animate'
];
const IA_DEPENDENCIES = [
  'langchain', '@supabase/supabase-js', '@langchain/openai', 
  '@langchain/community', '@langchain/core', 'ai', '@ai-sdk/react', 
  '@ai-sdk/openai', 'zod'
];
const TEST_DEV_DEPENDENCIES = [
  'jest', '@testing-library/react', '@testing-library/jest-dom', 
  'jest-environment-jsdom', '@types/jest'
];
const SHADCN_COMPONENTS_TO_ADD = [
  'button', 'input', 'textarea', 'card', 'sonner', 'label', 'slider', 'switch'
];

// --- Funções Auxiliares ---

/** Executa um comando no shell e exibe sua saída. */
const runCommand = (command, args, options = {}) => {
  console.log(chalk.bold.cyan(`\n> ${command} ${args.join(' ')}`));
  return execa(command, args, { stdio: 'inherit', ...options });
};

/** Coleta as preferências do usuário. */
const promptUser = () => {
  console.log(chalk.bold.cyan('=== Setup Inicial de Projeto Next.js 14 ===\n'));
  return inquirer.prompt([
    { type: 'input', name: 'projectName', message: 'Qual o nome do projeto?', validate: (input) => input ? true : 'O nome do projeto não pode ser vazio.' },
    { type: 'confirm', name: 'installUI', message: 'Deseja instalar dependências de UI (lucide, zustand, etc)?', default: true },
    { type: 'confirm', name: 'installIA', message: 'Deseja instalar dependências de IA (LangChain, Supabase, etc)?', default: true },
    { type: 'confirm', name: 'setupShadcn', message: 'Deseja configurar e adicionar componentes ShadCN UI?', default: true },
    { type: 'confirm', name: 'installTests', message: 'Deseja instalar dependências de teste (Jest, Testing Library)?', default: true },
    { type: 'confirm', name: 'initGit', message: 'Deseja inicializar um repositório git?', default: true }
  ]);
};

/** Cria a estrutura base do projeto Next.js. */
const createNextApp = (projectName) => {
  console.log(chalk.bold.yellow('\n[1/5] Criando projeto Next.js 14...'));
  return runCommand('npx', [
    'create-next-app@14', projectName, '--typescript', '--app', '--tailwind', 
    '--eslint', '--src-dir', '--import-alias', '@/*', '--package-manager', 'pnpm'
  ]);
};

/** Instala as dependências selecionadas. */
const installDependencies = async (projectName, answers) => {
  const { installUI, installIA, installTests } = answers;
  const dependencies = [];
  const devDependencies = [];

  if (installUI) dependencies.push(...UI_DEPENDENCIES);
  if (installIA) dependencies.push(...IA_DEPENDENCIES);
  if (installTests) devDependencies.push(...TEST_DEV_DEPENDENCIES);

  if (dependencies.length > 0) {
    console.log(chalk.bold.yellow('\n[2/5] Instalando dependências...'));
    await runCommand('pnpm', ['add', ...dependencies], { cwd: projectName });
  }
  if (devDependencies.length > 0) {
    console.log(chalk.bold.yellow('\n[3/5] Instalando dependências de desenvolvimento...'));
    await runCommand('pnpm', ['add', '-D', ...devDependencies], { cwd: projectName });
  }
};

/** Configura o ambiente para o ShadCN UI e adiciona componentes. */
const configureShadcn = async (projectName) => {
  console.log(chalk.bold.yellow('\n[4/5] Configurando ShadCN UI...'));
  const projectPath = path.resolve(projectName);

  // 1. Criar components.json
  const componentsJsonPath = path.join(projectPath, 'components.json');
  fs.writeFileSync(componentsJsonPath, JSON.stringify({
    "$schema": "https://ui.shadcn.com/schema.json", "style": "new-york", "rsc": true, "tsx": true,
    "tailwind": { "config": "tailwind.config.ts", "css": "src/app/globals.css", "baseColor": "neutral", "cssVariables": true },
    "aliases": { "components": "@/components", "utils": "@/lib/utils" }
  }, null, 2));
  console.log(chalk.gray('[info] Criado: components.json'));

  // 2. Criar lib/utils.ts
  const libDir = path.join(projectPath, 'src', 'lib');
  fs.mkdirSync(libDir, { recursive: true });
  fs.writeFileSync(path.join(libDir, 'utils.ts'), `import { type ClassValue, clsx } from "clsx"\nimport { twMerge } from "tailwind-merge"\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs))\n}\n`);
  console.log(chalk.gray('[info] Criado: src/lib/utils.ts'));

  // 3. Sobrescrever tailwind.config.ts
  const tailwindConfigPath = path.join(projectPath, 'tailwind.config.ts');
  fs.writeFileSync(tailwindConfigPath, `import type { Config } from "tailwindcss"\n\nconst config = {\n  darkMode: ["class"],\n  content: [\n    './pages/**/*.{ts,tsx}',\n    './components/**/*.{ts,tsx}',\n    './app/**/*.{ts,tsx}',\n    './src/**/*.{ts,tsx}',\n\t],\n  prefix: "",\n  theme: {\n    container: {\n      center: true,\n      padding: "2rem",\n      screens: { "2xl": "1400px" },\n    },\n    extend: {\n      colors: {\n        border: "hsl(var(--border))", input: "hsl(var(--input))", ring: "hsl(var(--ring))",\n        background: "hsl(var(--background))", foreground: "hsl(var(--foreground))",\n        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },\n        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },\n        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },\n        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },\n        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },\n        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },\n        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },\n      },\n      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },\n      keyframes: {\n        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },\n        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },\n      },\n      animation: { "accordion-down": "accordion-down 0.2s ease-out", "accordion-up": "accordion-up 0.2s ease-out" },\n    },\n  },\n  plugins: [require("tailwindcss-animate")],\n} satisfies Config\n\nexport default config`);
  console.log(chalk.gray('[info] Sobrescrito: tailwind.config.ts'));
  
  // 4. Garantir que globals.css existe com o conteúdo certo
  const globalsCssPath = path.join(projectPath, 'src', 'app', 'globals.css');
  fs.writeFileSync(globalsCssPath, `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n@layer base {\n  :root {\n    --background: 0 0% 100%;\n    --foreground: 222.2 84% 4.9%;\n    --card: 0 0% 100%;\n    --card-foreground: 222.2 84% 4.9%;\n    --popover: 0 0% 100%;\n    --popover-foreground: 222.2 84% 4.9%;\n    --primary: 222.2 47.4% 11.2%;\n    --primary-foreground: 210 40% 98%;\n    --secondary: 210 40% 96.1%;\n    --secondary-foreground: 222.2 47.4% 11.2%;\n    --muted: 210 40% 96.1%;\n    --muted-foreground: 215.4 16.3% 46.9%;\n    --accent: 210 40% 96.1%;\n    --accent-foreground: 222.2 47.4% 11.2%;\n    --destructive: 0 84.2% 60.2%;\n    --destructive-foreground: 210 40% 98%;\n    --border: 214.3 31.8% 91.4%;\n    --input: 214.3 31.8% 91.4%;\n    --ring: 222.2 84% 4.9%;\n    --radius: 0.5rem;\n  }\n\n  .dark {\n    --background: 222.2 84% 4.9%;\n    --foreground: 210 40% 98%;\n    --card: 222.2 84% 4.9%;\n    --card-foreground: 210 40% 98%;\n    --popover: 222.2 84% 4.9%;\n    --popover-foreground: 210 40% 98%;\n    --primary: 210 40% 98%;\n    --primary-foreground: 222.2 47.4% 11.2%;\n    --secondary: 217.2 32.6% 17.5%;\n    --secondary-foreground: 210 40% 98%;\n    --muted: 217.2 32.6% 17.5%;\n    --muted-foreground: 215 20.2% 65.1%;\n    --accent: 217.2 32.6% 17.5%;\n    --accent-foreground: 210 40% 98%;\n    --destructive: 0 62.8% 30.6%;\n    --destructive-foreground: 210 40% 98%;\n    --border: 217.2 32.6% 17.5%;\n    --input: 217.2 32.6% 17.5%;\n    --ring: 215 20.2% 65.1%;\n  }\n}\n\n@layer base {\n  * {\n    @apply border-border;\n  }\n  body {\n    @apply bg-background text-foreground;\n  }\n}`);
  console.log(chalk.gray('[info] Atualizado: src/app/globals.css'));
  
  // 5. Adicionar componentes
  await runCommand('npx', ['shadcn@latest', 'add', ...SHADCN_COMPONENTS_TO_ADD], { cwd: projectName });
};

/** Inicializa um repositório git e faz o primeiro commit. */
const initializeGitRepository = async (projectName) => {
  console.log(chalk.bold.yellow('\n[5/5] Inicializando repositório git...'));
  await runCommand('git', ['init'], { cwd: projectName });
  await runCommand('git', ['add', '.'], { cwd: projectName });
  await runCommand('git', ['commit', '-m', 'Initial project setup via script'], { cwd: projectName });
};

/** Exibe a mensagem final de sucesso. */
const printSuccessMessage = (projectName) => {
  console.log(chalk.bold.green('\n✅ Projeto criado com sucesso!'));
  console.log(chalk.cyan('\nPara começar:'));
  console.log(chalk.cyan(`  cd ${projectName}`));
  console.log(chalk.cyan('  pnpm dev\n'));
  console.log(chalk.gray('Lembre-se de configurar suas variáveis de ambiente em um arquivo .env'));
};

/** Cria o arquivo .env.example com as variáveis de ambiente necessárias. */
const createEnvExampleFile = (projectName) => {
  console.log(chalk.bold.yellow('\n[2/7] Criando arquivos de configuração e documentação...'));
  const projectPath = path.resolve(projectName);
  const content = `# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
`;
  fs.writeFileSync(path.join(projectPath, '.env.example'), content);
  console.log(chalk.gray('[info] Criado: .env.example'));
};

/** Cria os templates de documentação e as regras para a IA. */
const createDocumentationTemplates = (projectName) => {
  const projectPath = path.resolve(projectName);
  const docsDir = path.join(projectPath, 'docs');
  fs.mkdirSync(docsDir, { recursive: true });

  // .cursorrules
  const cursorRulesContent = `# Regras do Projeto

## Stack Principal
- Next.js 14 (App Router)
- TypeScript
- ShadCN UI
- TailwindCSS
- Supabase (PostgreSQL + pgvector)
- LangChain.js
- OpenAI
- Zustand (gerenciamento de estado)
- React Hook Form

## Estrutura do Projeto
/app                 # App Router do Next.js
  /api              # API Routes
/components
  /ui               # Componentes ShadCN
/lib
  /utils.ts         # Funções utilitárias
/docs                # Documentação do projeto

## Diretrizes de Código
- **Sempre use TypeScript com tipagem estrita.**
- Evite \`any\` a todo custo.
- Mantenha componentes React pequenos e focados (máximo 200 linhas).
- Valide todas as entradas de API com Zod.
- Implemente streaming de respostas para o chat sempre que possível para melhor UX.

## Comandos Úteis
- \`pnpm dev\`: Inicia o servidor de desenvolvimento.
- \`pnpm test\`: Roda os testes com Jest.
- \`npx supabase gen types typescript --local > types/supabase-generated.ts\`: Gera os tipos do banco de dados.
`;
  fs.writeFileSync(path.join(projectPath, '.cursorrules'), cursorRulesContent);
  console.log(chalk.gray('[info] Criado: .cursorrules'));

  // docs/project-overview.md
  const overviewContent = `# Visão Geral do Projeto

## Objetivo Principal
[Descreva aqui o objetivo de negócio do projeto. O que ele resolve? Qual o principal valor que ele entrega?]

## Público-Alvo
[Quem são os usuários deste projeto? Descreva os perfis de usuário.]

## Funcionalidades Chave
- [Funcionalidade 1]: [Breve descrição]
- [Funcionalidade 2]: [Breve descrição]
- [Funcionalidade 3]: [Breve descrição]
`;
  fs.writeFileSync(path.join(docsDir, 'project-overview.md'), overviewContent);
  console.log(chalk.gray('[info] Criado: docs/project-overview.md'));

  // docs/code-snippets.md
  const snippetsContent = `# Livro de Receitas (Cookbook) - Padrões e Snippets

## Criando um Novo Componente de UI
[Cole aqui um exemplo de um componente simples, seguindo os padrões do ShadCN e a estrutura de pastas.]

## Fazendo uma Query no Supabase
[Mostre um exemplo de uma função que busca dados no Supabase, incluindo o uso dos tipos gerados.]

## Criando um Endpoint de API com Validação
[Mostre um exemplo de uma API route do Next.js que usa Zod para validar o corpo da requisição e segue o padrão de tratamento de erros.]
`;
  fs.writeFileSync(path.join(docsDir, 'code-snippets.md'), snippetsContent);
  console.log(chalk.gray('[info] Criado: docs/code-snippets.md'));

  // docs/architecture-decisions.md
  const adrContent = `# Registro de Decisões de Arquitetura (ADRs)

## ADR-001: Escolha da Stack Principal

- **Contexto**: Precisávamos de uma stack moderna, produtiva e escalável para um POC com foco em IA.
- **Decisão**: Escolhemos Next.js 14, Supabase, LangChain e ShadCN UI.
- **Consequências**: Ganhamos agilidade no desenvolvimento de UI e na integração com IA, mantendo a infraestrutura de backend e banco de dados unificada no Supabase, o que é ideal para um POC.
`;
  fs.writeFileSync(path.join(docsDir, 'architecture-decisions.md'), adrContent);
  console.log(chalk.gray('[info] Criado: docs/architecture-decisions.md'));
};


// --- Execução Principal ---

const main = async () => {
  let projectName = '';
  try {
    const answers = await promptUser();
    projectName = answers.projectName;

    await createNextApp(projectName);
    createEnvExampleFile(projectName);
    createDocumentationTemplates(projectName);
    
    await installDependencies(projectName, answers);
    
    if (answers.setupShadcn) {
      await configureShadcn(projectName);
    }
    if (answers.initGit) {
      await initializeGitRepository(projectName);
    }

    printSuccessMessage(projectName);

  } catch (error) {
    console.error(chalk.bold.red('\n❌ Ocorreu um erro durante a execução do script.'));
    
    if (error.exitCode) {
      console.error(chalk.red(`O comando "${error.command}" falhou com o código de saída ${error.exitCode}.`));
    } else {
      console.error(chalk.red(error.message));
    }

    if (projectName && fs.existsSync(projectName)) {
      console.log(chalk.yellow(`\nA pasta do projeto "${projectName}" foi criada, mas pode estar em um estado inconsistente.`));
      console.log(chalk.yellow(`É recomendado removê-la ('rm -rf ${projectName}' ou manualmente) e tentar novamente.`));
    }
    
    process.exit(1);
  }
};

main(); 