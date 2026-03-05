# Sistema de Controlo de Qualidade e Registo NC

Este projeto é uma aplicação web focada na gestão e controlo de qualidade fabril, permitindo o registo de receções de material e o acompanhamento de produtos não conformes (NC) de forma eficiente e intuitiva.

A interface está otimizada para ser utilizada por operadores tanto em desktop como em dispositivos móveis.

---

## Tecnologias Utilizadas

O projeto foi construído com as seguintes tecnologias de ponta para garantir uma performance rápida e uma experiência de utilizador rica:

- **Frontend Core**: [React 18](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/) (Rápido e otimizado)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Componentes base do [DaisyUI](https://daisyui.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Tipagem**: TypeScript

---

## Pré-requisitos

Para executar este projeto localmente, precisará de ter instalado na sua máquina:

- **Node.js** (versão 18.x ou superior recomendada. O **npm** já vem incluído com o Node.js)

> **Como instalar o Node.js?**
>
> 1. Vá a [nodejs.org](https://nodejs.org/).
> 2. Descarregue o instalador da versão **LTS** (Recomendada).
> 3. Execute o instalador e siga os passos padrão ("Next").
> 4. Após a instalação, abra um novo terminal e escreva `node -v` e `npm -v` para confirmar que está instalado.

---

## Como Executar o Projeto Localmente

Siga os passos abaixo para iniciar a aplicação no seu ambiente de desenvolvimento:

### 1. Clonar o Repositório ou Aceder à Pasta

Navegue até à pasta `frontend` do projeto no seu terminal:

```bash
cd caminho/para/o/Projeto/frontend
```

### 2. Instalar as Dependências

Instale todos os pacotes necessários definidos no `package.json`.

```bash
npm install
# ou use pnpm install / yarn install
```

### 3. Iniciar o Servidor de Desenvolvimento

Após a instalação, inicie o servidor local gerido pelo Vite:

```bash
npm run dev
# ou use pnpm dev / yarn dev
```

Este comando iniciará um servidor local. O terminal irá mostrar um link (normalmente `http://localhost:5173/`). Pode abrir esse link no seu navegador para ver e testar a aplicação.

---

## Como Executar com Docker (Recomendado)

Agora que o projeto inclui um backend em **.NET 8** e uma base de dados **PostgreSQL**, a forma mais simples de rodar tudo em sincronia é utilizando o Docker Compose.

### 1. Pré-requisitos

- Ter o [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e a correr.

### 2. Iniciar o Ambiente

Na raiz do projeto (onde está o ficheiro `docker-compose.yml`), execute:

```bash
docker compose up --build
```

### 3. Aceder aos Serviços

- **Frontend (React)**: [http://localhost:5173](http://localhost:5173)
- **Backend (API Swagger)**: [http://localhost:5000/swagger](http://localhost:5000/swagger)
- **Base de Dados**: `localhost:5432` (User/Pass: `postgres/postgres`)

---

---

## Comandos Disponíveis (Scripts)

Dentro da pasta `frontend`, tem acesso aos seguintes comandos principais:

- `npm run dev` - Inicia a aplicação em modo de desenvolvimento com _Hot-Module Replacement_ (HMR).
- `npm run build` - Compila a aplicação para a pasta de produção (`dist`), otimizando o código e preparando-o para _deployment_.
- `npm run preview` - Inicia um servidor local assente nos ficheiros construídos em modo de produção (para testar o `build` localmente antes de o publicar).

---

## Principais Funcionalidades

- **Gestão de Utilizadores baseada em Perfis**: Redirecionamento automático mediante a função do utilizador (Operador, Qualidade, Produção, etc.).
- **Tabela de Receções**: Tratamento pormenorizado artigo a artigo com verificações rigorosas e um design otimizado para não requerer scroll horizontal em _mobile_.
- **Registo de Produto Não Conforme (NC)**:
  - Interface baseada em separadores verticais.
  - Modo _Iframe/Split-Screen_ para integração com o "Chão de Fábrica" e "Mobilidade" sem perder o contexto da Não-Conformidade.
  - Filtros avançados integrados (com suporte para operadores matemáticos `<, >, =`).

---

## Configurar os Links do Chão de Fábrica e Mobilidade

Na página de **Registo NC**, os links para "Mobilidade" e "Chão de Fábrica" carregam páginas externas dentro da aplicação através de _Iframes_. Estes atalhos estão disponíveis no **menu lateral principal (Sidebar)** para utilizadores com o perfil de Operador. Atualmente as hiperligações de demonstração estão a apontar para a Wikipédia e GitHub.

Para alterar os URLs de destino:

1. O local onde as páginas são **carregadas** (**a tag `<iframe>`**) continua no ficheiro `frontend/src/app/pages/RegistoNC.tsx` (aproximadamente na linha 511). É **aí que altera** o `src` com os links da aplicação: `src={view === "IFRAME_MOBILIDADE" ? "http://192..." : "http://200..."}`.
2. Nota de navegação: Os items no menu lateral que disparam estas janelas estão definidos no `frontend/src/app/components/MainLayout.tsx` (na constante `NAV_ITEMS`), enviando as _flags_ `?view=mobilidade` pelo URL.
3. Certifique-se que coloca o protocolo correto (ex: `http://` ou `https://`) antes do IP no passo 1.

### Funcionamento em Redes Locais (Intranet)

**Sim, os Iframes funcionam perfeitamente com redes locais** (usando IPs locais como `http://192.168.1.100:8080/app` ou _hostnames_ da rede interna), com as seguintes condicões normais dos navegadores modernos:

- O dispositivo (tablet/computador do operador) que acede ao Registo NC tem de estar na mesma rede ou ter rotas ativas (ex: VPN) para aceder a esse IP local.
- Se a aplicação principal do Registo NC estiver a correr em **HTTPS**, o Iframe também tem obrigatoriamente de ter um link **HTTPS** em servidores locais (regra de _Mixed Content_). Se correr o Registo NC localmente em **HTTP** (sem SSL), os iframes locais por HTTP funcionam sem problema.
- A aplicação local de destino não pode bloquear _iframes_ a nível de servidor (não pode estar a enviar o cabeçalho `X-Frame-Options: DENY`).

---

## Estrutura de Pastas (Frontend)

Breve resumo da arquitetura da aplicação:

- `/src/app/pages`: Contém os ecrãs principais da aplicação (`RegistoNC.tsx`, `Recepcoes.tsx`, `Login.tsx`, etc.).
- `/src/app/components`: Componentes reutilizáveis por toda a interface (`AuthLayout.tsx`, etc.).
- `/src/app/context`: Gestos de estado global (como autenticação - `AuthContext.tsx`).
- `/src/app/routes.tsx`: Definição das _routes_ de navegação da aplicação.
