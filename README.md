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

## 🔗 Configurar os Links do Chão de Fábrica e Mobilidade

Na página de **Registo NC**, os botões "Abrir Mobilidade" e "Abrir Chão de Fábrica" carregam páginas externas dentro da aplicação através de _Iframes_. Atualmente as hiperligações de demonstração estão a apontar para a Wikipédia.

Para configurar as suas próprias hiperligações:

1. Abra o ficheiro `frontend/src/app/pages/RegistoNC.tsx` no seu editor.
2. Procure pela tag `<iframe>` (aproximadamente na linha 469, ou pesquise por _"IFRAME_MOBILIDADE"_).
3. Modifique os URLs na propriedade `src` para os endereços das suas aplicações internas.

### 🌐 Funcionamento em Redes Locais (Intranet)

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
