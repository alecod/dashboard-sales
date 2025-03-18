

## Visão Geral

Este projeto é uma aplicação web construída com **Next.js** e está na versão `0.2.31`. Ele utiliza várias bibliotecas modernas, como **React**, **TailwindCSS**, **Zustand** e **Tanstack Query**, além de integrações com **Stripe** e outros provedores.

## Estrutura do Projeto

- **Next.js** para SSR e SSG.
- **TailwindCSS** para estilização.
- **React** como biblioteca principal de UI.
- **Zustand** para gerenciamento de estado global.
- **Stripe** para integrações de pagamento.
- **React Hook Form** para gerenciamento de formulários.
- **Recharts** para gráficos interativos.
- **Radix UI** para componentes acessíveis e prontos para produção.
- **Tanstack React Query** para gerenciamento de estados assíncronos.

## Scripts Disponíveis

Os principais scripts configurados no projeto são:

- `dev`: Inicia o servidor de desenvolvimento.
  
  ```bash
  npm run dev
  ```

- `build`: Faz o build da aplicação para produção.
  
  ```bash
  npm run build
  ```

- `start`: Inicia a aplicação em ambiente de produção.
  
  ```bash
  npm run start
  ```

- `lint`: Verifica o código para problemas de lint.
  
  ```bash
  npm run lint
  ```

- `version`: Gera uma nova versão utilizando **changesets** e faz push do código.

  ```bash
  npm run version
  ```

- `tag`: Adiciona um tag ao repositório e faz o push com as tags.

  ```bash
  npm run tag
  ```

## Principais Dependências

- **@changesets/cli**: Gerenciamento de versionamento e changelogs.
- **@stripe/react-stripe-js**: Integração de pagamentos com Stripe.
- **@tanstack/react-query**: Gerenciamento de dados assíncronos.
- **@radix-ui/react**: Componentes de UI acessíveis e reutilizáveis.
- **TailwindCSS**: Estilização utilitária para uma rápida construção de layouts.
- **React Hook Form**: Solução para gerenciamento de formulários com validação.
- **Zustand**: Biblioteca leve para gerenciamento de estado global.
- **Framer Motion**: Animações fluídas e performáticas.
- **Recharts**: Gráficos baseados em React para exibição de dados.

## Como Executar o Projeto

### Pré-requisitos

- **Node.js** versão `>=14`.
- **npm** ou **yarn** como gerenciador de pacotes.

### Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   ```

2. Instale as dependências:

   ```bash
   npm install
   # ou
   yarn install
   ```

### Ambiente de Desenvolvimento

Para iniciar o ambiente de desenvolvimento, rode:

```bash
npm run dev
# ou
yarn dev
```

O projeto será executado em `http://localhost:3000`.

### Build para Produção

Para criar o build otimizado para produção:

```bash
npm run build
# ou
yarn build
```

Depois, inicie o servidor de produção:

```bash
npm start
# ou
yarn start
```

## Contribuição

1. Faça o fork do repositório.
2. Crie uma branch para sua feature ou correção de bug (`git checkout -b feature/nova-feature`).
3. Faça o commit de suas alterações (`git commit -m 'Adiciona nova feature'`).
4. Faça o push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.


