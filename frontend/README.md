<div align="center">

# JackTasks - Frontend

Uma aplicação web moderna e responsiva de gerenciamento de tarefas, desenvolvida com React e TypeScript.

## Tecnologias Utilizadas

| <img src="https://cdn.simpleicons.org/react/ffd700" width="48" height="48" alt="React"> | <img src="https://cdn.simpleicons.org/typescript/ffd700" width="48" height="48" alt="TypeScript"> | <img src="https://cdn.simpleicons.org/tailwindcss/ffd700" width="48" height="48" alt="Tailwind CSS"> | <img src="https://cdn.simpleicons.org/vite/ffd700" width="48" height="48" alt="Vite"> | <img src="https://cdn.simpleicons.org/framer/ffd700" width="48" height="48" alt="Framer Motion"> |
|:---:|:---:|:---:|:---:|:---:|
| React | TypeScript | Tailwind CSS | Vite | Framer Motion |

</div>

## Páginas Principais

- **Login e Registro (Login.tsx e Register.tsx)**:
  - *Cadastro de novos usuários* com validação de e-mail e senha
  - *Login e logout de usuários* utilizando JWT
  - **Proteção de rotas** para usuários autenticados

- **Gerenciamento de Tarefas (Tasks.tsx)**:
  - *Criação de tarefas* com título, descrição e data
  - *Listagem de todas as tarefas* do usuário autenticado
  - *Edição e exclusão de tarefas existentes*
  - *Marcação de tarefas como concluídas*
  - **Operações realizadas através de modais intuitivos**

- **Visualização em Calendário (Calendar.tsx)**:
  - *Exibição de tarefas em formato de calendário*
  - *Seleção de dias específicos* para ver tarefas associadas
  - *Possibilidade de concluir tarefas* diretamente no calendário

- **Análise de Métricas (Analytics.tsx)**:
  - *Visualização de métricas* com gráficos detalhados
  - *Informações sobre tarefas* criadas, concluídas e em andamento

## Design e Responsividade

- **Interface intuitiva e totalmente responsiva**, adaptando-se a diferentes tamanhos de tela e dispositivos
- *Suporte a tema claro e escuro*
- Utilização de componentes **shadcn/ui** para uma interface consistente e moderna

## Como Executar o Projeto

1. Clone o repositório: `git clone https://github.com/detalhe/jacktasks/frontend.git`
2. Instale as dependências: `npm install`
3. Execute o projeto: `npm run dev`
4. Acesse `http://localhost:5173` no seu navegador

## Tecnologias e Ferramentas

- **React**: Biblioteca JavaScript para construção da UI
- **TypeScript**: Superset tipado de JavaScript para maior segurança
- **Vite**: Build tool e dev server
- **Tailwind CSS**: Framework CSS
- **shadcn/ui**: Componentes de UI reutilizáveis e customizáveis
- **Framer Motion**: Biblioteca para animações
- **React Router**: Gerenciamento de rotas na aplicação
- **Context API**: Gerenciamento de estado global
- **Axios**: Cliente HTTP para requisições à API
- **JWT**: Autenticação baseada em tokens

## Requisitos Atendidos

- **Cadastro e autenticação** de usuários com JWT
- **CRUD completo** de tarefas para usuários autenticados
- Interface responsiva e intuitiva desenvolvida com **React**, **Tailwind CSS** e **shadcn/ui**
- Utilização de **hooks do React** para gerenciamento de estado e efeitos
- Implementação de **rotas protegidas** com React Router
- **Consumo eficiente** da API backend