# 💰 Finance App

Aplicação Full Stack para gerenciamento de finanças pessoais, desenvolvida com **React, Node.js, Express e MySQL**.

O Finance App permite que usuários controlem receitas e despesas, acompanhem o saldo financeiro, criem metas, gerenciem o perfil e recuperem o acesso à conta por meio de código enviado por e-mail.

> **Organize hoje. Conquiste amanhã.**

---

## 🚀 Funcionalidades

### 🔐 Autenticação

- Cadastro de usuários
- Login com e-mail e senha
- Login com Google
- Autenticação utilizando JWT
- Senhas criptografadas com bcrypt
- Rotas protegidas
- Logout

### 🔑 Recuperação de senha

- Recuperação de senha por e-mail
- Envio de código de 6 dígitos
- Código com tempo de expiração
- Validação do código
- Criação de nova senha
- Nova senha criptografada com bcrypt
- Código invalidado após a redefinição

### 📊 Dashboard

- Visualização geral das finanças
- Total de receitas
- Total de despesas
- Saldo atual
- Gráficos financeiros
- Filtro por período
- Informações do usuário logado

### 💳 Transações

CRUD completo de transações:

- Criar transação
- Listar transações
- Editar transação
- Excluir transação
- Separação entre receitas e despesas
- Transações vinculadas individualmente a cada usuário

### 💰 Receitas

- Listagem das receitas
- Histórico de receitas
- Cálculo do total recebido

### 💸 Despesas

- Listagem das despesas
- Histórico de despesas
- Cálculo do total gasto

### 🎯 Metas financeiras

- Criar metas
- Editar metas
- Excluir metas
- Definir valor da meta
- Informar valor atual
- Acompanhar progresso

### 👤 Perfil

- Visualização dos dados do usuário
- Nome
- E-mail
- Foto do Google, quando disponível
- Alteração de senha
- Personalização de tema

---

# 🛠️ Tecnologias utilizadas

## Frontend

- React
- Vite
- JavaScript
- CSS
- React Router DOM
- React Icons
- Chart.js
- React Chart.js 2
- Google OAuth

## Backend

- Node.js
- Express
- JWT
- bcrypt
- Nodemailer
- Google Auth Library
- CORS
- dotenv

## Banco de dados

- MySQL

---

# 🏗️ Arquitetura

```text
Finance App
│
├── Frontend
│   └── React + Vite
│
├── Backend
│   └── Node.js + Express
│
└── Banco de Dados
    └── MySQL
```

O frontend se comunica com uma API REST desenvolvida em Node.js e Express.

A API é responsável pela autenticação, gerenciamento dos usuários, transações, metas e recuperação de senha.

---

# 📂 Estrutura do projeto

```text
finance-app/
│
├── backend/
│   ├── src/
│   │   ├── database.js
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env
│
├── src/
│   ├── assets/
│   │
│   ├── pages/
│   │   ├── Cadastro/
│   │   ├── Dashboard/
│   │   ├── Despesas/
│   │   ├── Login/
│   │   ├── Metas/
│   │   ├── Perfil/
│   │   ├── Receitas/
│   │   ├── Recuperacao/
│   │   └── Transacoes/
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── README.md
```

---

# 🔒 Segurança

O projeto utiliza:

- JWT para autenticação
- bcrypt para hash das senhas
- Middleware de autenticação
- Rotas protegidas
- Validação de usuário nas operações
- Variáveis de ambiente para informações sensíveis
- Código temporário para recuperação de senha

As credenciais e chaves privadas não são armazenadas no repositório.

---

# 🔑 Variáveis de ambiente

Crie um arquivo:

```text
backend/.env
```

Exemplo:

```env
JWT_SECRET=sua_chave_jwt

GOOGLE_CLIENT_ID=seu_google_client_id

EMAIL_USER=seu_email

EMAIL_PASS=sua_senha_de_aplicativo
```

> ⚠️ Nunca envie o arquivo `.env` para o GitHub.

---

# ⚙️ Como executar o projeto

## 1. Clone o repositório

```bash
git clone SEU_LINK_DO_REPOSITORIO
```

Entre na pasta:

```bash
cd finance-app
```

---

## 2. Instale as dependências do frontend

```bash
npm install
```

Execute:

```bash
npm run dev
```

O frontend normalmente ficará disponível em:

```text
http://localhost:5173
```

---

## 3. Configure o backend

Abra outro terminal:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Execute:

```bash
node src/server.js
```

API:

```text
http://localhost:3000
```

---

# 🗄️ Banco de dados

O projeto utiliza MySQL.

As principais entidades utilizadas são:

```text
usuarios
transacoes
metas
```

Cada transação e meta é associada ao usuário responsável, evitando que usuários tenham acesso aos dados financeiros de outras contas.

---

# 🔄 Fluxo de autenticação

```text
Usuário
   ↓
Login
   ↓
API
   ↓
Validação da senha
   ↓
JWT
   ↓
Frontend
   ↓
Rotas protegidas
```

---

# 🔐 Fluxo de recuperação de senha

```text
Esqueceu sua senha?
        ↓
Digita o e-mail
        ↓
Código enviado por e-mail
        ↓
Validação do código
        ↓
Nova senha
        ↓
bcrypt
        ↓
Senha atualizada no MySQL
        ↓
Login
```

---

# 📡 Principais endpoints da API

### Autenticação

```text
POST /cadastro
POST /login
POST /login/google
```

### Recuperação de senha

```text
POST /esqueci-senha/enviar-codigo
POST /esqueci-senha/verificar-codigo
POST /esqueci-senha/redefinir
```

### Perfil

```text
GET /perfil
PUT /perfil/senha
```

### Transações

```text
POST   /transacoes
GET    /transacoes
PUT    /transacoes/:id
DELETE /transacoes/:id
```

### Metas

```text
POST   /metas
GET    /metas
PUT    /metas/:id
DELETE /metas/:id
```

---

# 📱 Responsividade

A interface foi desenvolvida pensando em diferentes tamanhos de tela, mantendo a identidade visual do Finance App.

---

# 🎨 Interface

O Finance App utiliza uma interface moderna em tons escuros com detalhes em roxo.

Também possui personalização de tema através da página de perfil.

---

# 📈 Próximas evoluções

A versão web principal está concluída.

Possíveis evoluções:

- Deploy do frontend
- Deploy da API
- Banco de dados em produção
- Melhorias adicionais de segurança
- Testes automatizados
- Versão mobile

---

# 📱 Finance App Mobile

Uma versão mobile poderá utilizar a mesma API REST criada para a aplicação web.

```text
Finance App Web
       │
       │
       ▼
     API REST
       ▲
       │
       │
Finance App Mobile
```

---

# 👨‍💻 Autor

**Caio Luan**

Desenvolvedor Full Stack com foco em desenvolvimento Web e Mobile.

---

## ⭐ Sobre o projeto

O Finance App foi desenvolvido com o objetivo de aplicar na prática conceitos de desenvolvimento Full Stack, incluindo:

- Desenvolvimento de interfaces com React
- Construção de API REST
- Integração frontend e backend
- Banco de dados relacional
- Autenticação
- Segurança de senhas
- OAuth com Google
- Envio de e-mails
- CRUD
- Gerenciamento de estado
- Visualização de dados

Este projeto faz parte do meu portfólio de desenvolvimento.

---

**Finance App — Organize hoje. Conquiste amanhã.**