<div align="center">

# JackTasks - Backend

Uma API robusta e segura para gerenciamento de tarefas, construída com Express, TypeScript e MySQL.

## Tecnologias Utilizadas

| <img src="https://cdn.simpleicons.org/nodedotjs/ffd700" width="48" height="48" alt="Node.js"> | <img src="https://cdn.simpleicons.org/express/ffd700" width="48" height="48" alt="Express"> | <img src="https://cdn.simpleicons.org/typescript/ffd700" width="48" height="48" alt="TypeScript"> | <img src="https://cdn.simpleicons.org/mysql/ffd700" width="48" height="48" alt="MySQL"> | <img src="https://cdn.simpleicons.org/jsonwebtokens/ffd700" width="48" height="48" alt="JWT"> |
|:---:|:---:|:---:|:---:|:---:|
| Node.js | Express | TypeScript | MySQL | JWT |

</div>

## Funcionalidades Principais

- **Autenticação de Usuários** (_authController.ts_):
  - Registro de usuários com hash de senha
  - Login de usuários com geração de token JWT
  - Armazenamento seguro de senhas usando bcrypt

- **Gerenciamento de Tarefas** (_taskController.ts_):
  - Criação de novas tarefas com título, descrição e data
  - Recuperação de todas as tarefas do usuário autenticado
  - Atualização de tarefas existentes
  - Exclusão de tarefas
  - Marcação de tarefas como concluídas

- **Middleware** (_authMiddleware.ts_):
  - Verificação de token JWT para rotas protegidas
  - Identificação de usuário para operações de tarefas

- **Integração com Banco de Dados** (_database.ts_):
  - Pool de conexões MySQL para operações eficientes
  - Configuração de variáveis de ambiente para credenciais do banco de dados

## Estrutura do Projeto

```
src/
├── config/
│   └── database.ts
├── controllers/
│   ├── authController.ts
│   └── taskController.ts
├── middleware/
│   └── authMiddleware.ts
├── models/
│   ├── Task.ts
│   └── User.ts
├── routes/
│   ├── authRoutes.ts
│   └── taskRoutes.ts
├── services/
│   └── jwtService.ts
├── __tests__/
│   └── api.test.ts
├── app.ts
└── testDbConnection.ts
```

## Como Executar o Projeto

1. Clone o repositório: `git clone https://github.com/detalhe/jacktasks/backend.git`
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente no arquivo `.env` (use `.env.example` como exemplo)
4. Execute o projeto: `npm start`
5. Para desenvolvimento com auto-reload: `npm run dev`

## Endpoints da API

### Autenticação
- `POST /api/auth/register`: Registra um novo usuário
- `POST /api/auth/login`: Realiza login e recebe token JWT

### Tarefas
- `POST /api/tasks`: Cria uma nova tarefa
- `GET /api/tasks`: Obtém todas as tarefas do usuário autenticado
- `PUT /api/tasks/:id`: Atualiza uma tarefa específica
- `DELETE /api/tasks/:id`: Exclui uma tarefa específica

## Testes

A suíte de testes está implementada usando **Jest** e **Supertest**. Para executar os testes:

```bash
npm test
```

Os testes cobrem:

- **Rotas de Autenticação**:
  - Registro de usuário
  - Login de usuário
  - Tratamento de erros de autenticação

- **Rotas de Tarefas**:
  - Criação de tarefas
  - Obtenção de tarefas
  - Atualização de tarefas
  - Exclusão de tarefas
  - Tratamento de erros e autenticação

## Requisitos Atendidos

- ✅ Sistema completo de autenticação de usuários com JWT
- ✅ Operações CRUD completas para tarefas, vinculadas a usuários autenticados
- ✅ Hash seguro de senhas com bcrypt
- ✅ Operações eficientes de banco de dados com pool de conexões
- ✅ Configuração baseada em ambiente para fácil implantação
- ✅ Middleware para proteção de rotas e identificação de usuários
- ✅ Clara separação de responsabilidades com controllers, models e routes
- ✅ Testes automatizados para garantir a qualidade e confiabilidade da API
