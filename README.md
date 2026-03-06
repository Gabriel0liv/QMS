# Sistema de Controlo de Qualidade e Registo NC

Plataforma Full-Stack para gestão de qualidade fabril, focada no registo de receções de material e acompanhamento de Não Conformidades (NC).

---

## Tecnologias

- **Frontend**: React 18 (Vite) + Tailwind CSS v4.
- **Backend**: .NET 8 Web API.
- **Base de Dados**: PostgreSQL 15.
- **Containers**: Docker & Docker Compose.

---

## Como Executar

Existem duas formas de executar o projeto, dependendo da necessidade de desenvolvimento.

### Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execução.
- (Opcional) [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) para desenvolvimento backend.
- (Opcional) [Node.js](https://nodejs.org/) para desenvolvimento frontend.

### Opção A: Execução Completa em Docker (Recomendado para produção/testes)

Este comando sobe a Base de Dados, o Backend e o Frontend automaticamente.
Na raiz do projeto, corra:

```bash
docker compose up -d --build
```

- **Interface**: [http://localhost:5173](http://localhost:5173)
- **Swagger**: [http://localhost:5001/swagger](http://localhost:5001/swagger)

### Opção B: Modo de Desenvolvimento (Hot Reload)

Ideal para fazer alterações no código e ver o resultado instantaneamente.

1. **Iniciar apenas a Base de Dados**:
   ```bash
   docker compose up -d db
   ```
2. **Iniciar o Backend**:
   ```bash
   cd backend
   dotnet run
   ```
3. **Iniciar o Frontend**:
   ```bash
   cd frontend
   npm install   # apenas na primeira vez
   npm run dev
   ```

---

## Credenciais de Acesso

O sistema utiliza RBAC (Controlo de Acesso Baseado em Cargos). Use estas contas para testar:

| Cargo             | Utilizador      | Password       | Acesso                                        |
| ----------------- | --------------- | -------------- | --------------------------------------------- |
| **Administrador** | `administrador` | `admin123`     | Gestão de Utilizadores, Estado Sistema        |
| **Qualidade**     | `qualidade`     | `qualidade123` | Receções, Retrabalho, Catálogos, Validação NC |
| **Operador**      | `operador`      | `operador123`  | Registo de Não Conformidades (NC)             |

---

## Estrutura do Projeto

- `/backend`: API e lógica de dados (C#).
- `/frontend`: Interface de utilizador (React).
- `/data`: Contém `docker-compose.yml` e volumes.
- `/backend/dados`: Pasta local de CSVs para importação automática (SAGE).

---

## Notas de Organização

- **Seeder**: No primeiro arranque, o sistema cria automaticamente os utilizadores e importa artigos/fornecedores a partir dos ficheiros CSV na pasta `backend/dados`.
- **Cálculo de Amostragem**: Implementado na página de Receções seguindo a norma $2 \times \sqrt{n} + 1$.
