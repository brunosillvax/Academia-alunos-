# 🏋️‍♂️ GymFlow - Sistema de Gestão para Academias

<p align="center">
  <img src="https://img.shields.io/badge/status-100%25%20Completo-brightgreen?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Backend-NestJS-blue?style=for-the-badge&logo=nestjs" alt="Backend">
  <img src="https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge&logo=next.js" alt="Frontend">
  <img src="https://img.shields.io/badge/Database-PostgreSQL-blue?style=for-the-badge&logo=postgresql" alt="Database">
</p>

## 🎯 Visão Geral

Bem-vindo ao **GymFlow** - uma solução completa de gestão para academias que combina tecnologia de ponta com uma experiência de usuário excepcional! 🚀

<div align="center">
  <img src="https://media.giphy.com/media/L1R1tvI9svkIWwpVYr/giphy.gif" width="300" alt="Gym Animation">
</div>

## 🌟 Funcionalidades Incríveis

### 👨‍💻 Para Alunos
- 📊 **Dashboard pessoal** com métricas em tempo real
- 📈 **Acompanhamento de evolução** com gráficos interativos
- 📸 **Registro de progresso** com fotos 3x (frente/lado/costas)
- 💳 **Histórico de pagamentos** com status das mensalidades
- 🗓️ **Agenda inteligente** para marcação de aulas
- 💪 **Treinos dinâmicos** com vídeos de execução
- 🎯 **Hábitos e check-ins diários** com gamificação
- 🔔 **Notificações web push** (treino do dia, lembretes)

### 👨‍💼 Para Administradores
- 📊 **Dashboard completo** com métricas avançadas:
  - 🔄 Funil de conversão (leads → avaliações → matrículas)
  - 💰 LTV (Lifetime Value), Churn Rate, MRR (Monthly Recurring Revenue)
  - 📈 Análise de desempenho e estatísticas em tempo real
- 👥 **Gestão de alunos** (CRUD completo)
- 📢 **Campanhas segmentadas** (WhatsApp/Email)
- 💵 **Sistema financeiro** com estrutura para boletos/cartão
- 📄 **Relatórios exportáveis** (CSV/PDF)
- 🔗 **Integrações** com Google Calendar, PagSeguro, MercadoPago, Asaas

## 🏗️ Arquitetura do Projeto

```
graph TD
    A[Frontend - Next.js] --> B[API REST - NestJS]
    B --> C[(PostgreSQL - Prisma ORM)]
    B --> D[Autenticação JWT]
    B --> E[Serviços Externos]
    
    subgraph "Frontend"
        A
    end
    
    subgraph "Backend"
        B
        D
    end
    
    subgraph "Persistência"
        C
    end
    
    subgraph "Integrações"
        E
    end
```

## 🚀 Tecnologias Utilizadas

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://cdn.worldvectorlogo.com/logos/nestjs.svg" width="60" alt="NestJS"><br>
        <b>NestJS</b>
      </td>
      <td align="center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg" width="60" alt="Next.js"><br>
        <b>Next.js</b>
      </td>
      <td align="center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg" width="60" alt="PostgreSQL"><br>
        <b>PostgreSQL</b>
      </td>
      <td align="center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" width="60" alt="TailwindCSS"><br>
        <b>TailwindCSS</b>
      </td>
    </tr>
  </table>
</div>

## 📁 Estrutura de Diretórios

```
📁 gymflow/
├── 📁 apps/
│   ├── 📁 backend/        → API NestJS
│   │   ├── 📁 src/modules/ → Módulos: admin, auth, student, etc.
│   │   └── 📁 prisma/      → Schema e seed Prisma
│   └── 📁 frontend/       → App Next.js
│       ├── 📁 src/app/    → Rotinas e páginas
│       └── 📁 lib/        → api.ts para chamadas ao backend
├── 🐳 docker-compose.yml
└── 📦 package.json (raiz, com workspaces)
```

## 🛠️ Instalação e Configuração

### 📋 Requisitos
- Node.js 18+
- PostgreSQL 14+
- Docker e Docker Compose (opcional)

### ⚙️ Passo a Passo

1. **Instale as dependências:**
```bash
# Na raiz do monorepo
npm install
```

2. **Configure o banco de dados:**
```bash
# Copie o arquivo de exemplo
cp apps/backend/.env.example apps/backend/.env

# Edite as variáveis de ambiente no arquivo .env
# DB_URL=postgresql://usuario:senha@localhost:5432/gymflow
```

3. **Prepare o banco de dados e Prisma:**
```bash
# Aplique o schema ao banco de dados
npm run prisma:push -w @gymflow/backend

# (Opcional) Execute o seed para dados iniciais
npm run prisma:seed -w @gymflow/backend
```

## ▶️ Execução

### 🚀 Modo Desenvolvimento
```bash
# Iniciar backend e frontend em paralelo
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000

### 🐳 Docker (Recomendado para produção)
```bash
# Iniciar todos os serviços
docker-compose up -d
```

## 🔐 Credenciais de Demonstração

### 👤 Administrador
- Email: `admin@gymflow.local`
- Senha: `admin123`

### 🏃 Aluno
- Email: `aluno@gymflow.local`
- Senha: `aluno123`

## 📊 Modelo de Dados

<div align="center">
  <img src="https://media.giphy.com/media/3o7TKsQ8UQ4l4LhGz6/giphy.gif" width="200" alt="Database Animation">
</div>

O sistema utiliza Prisma como ORM com as seguintes entidades principais:
- 👤 **User**: Usuários (administradores e alunos)
- 📋 **UserProfile**: Perfis com dados físicos
- 📅 **Plan**: Planos de assinatura
- 💵 **Payment**: Pagamentos e histórico financeiro
- 🏋️ **Modality**: Modalidades de aulas (musculação, crossfit, etc.)
- 🕒 **Schedule**: Horários das aulas
- 📝 **WorkoutSheet**: Fichas de treino personalizadas
- 📈 **ProgressEntry**: Registros de evolução física
- 🎯 **Habit**: Hábitos e check-ins diários

## 🔌 Integrações Externas

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/59/Google_Cloud_Logo.svg" width="50" alt="Google Cloud"><br>
        <b>Google Cloud</b>
      </td>
      <td align="center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/59/Google_Cloud_Logo.svg" width="50" alt="Google Agenda"><br>
        <b>Google Agenda</b>
      </td>
      <td align="center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Pagseguro.svg" width="50" alt="PagSeguro"><br>
        <b>PagSeguro</b>
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/Mercadopago.svg" width="50" alt="MercadoPago"><br>
        <b>MercadoPago</b>
      </td>
      <td align="center">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2cMvuaYsonUWKhGXfJkLPu4dNzCHL5785Jw&s" width="50" alt="Asaas"><br>
        <b>Asaas</b>
      </td>
      <td align="center">
        <!-- Integração futura -->
      </td>
    </tr>
  </table>
</div>

## 🎨 Design System

<div align="center">
  <img src="https://media.giphy.com/media/l0HlG8vJXW0X5v3aM/giphy.gif" width="250" alt="Design Animation">
</div>

O frontend utiliza um design system próprio com:
- 🎨 **Tokens de design**: Cores, espaçamentos, tipografia
- 🌗 **Tema automático**: Dark/light mode com base no sistema
- 🧩 **Componentes reutilizáveis**: Cards, botões, inputs, etc.
- ✨ **Microanimações**: Transições suaves e feedback visual

## 📈 Analytics

O sistema inclui tracking completo de eventos:
- 🖱️ Cliques em CTAs
- 🚪 Abandono de formulários
- 👁️ Page views
- 🔄 Conversões

## 🧪 Testes

O projeto está configurado para testes unitários e de integração:
- 🧪 Jest para testes no backend
- 🧪 React Testing Library para testes no frontend

## 📤 Deploy

### 🐳 Docker
O projeto inclui Dockerfiles para ambos os serviços:
- `apps/backend/Dockerfile`
- `apps/frontend/Dockerfile`

### 🔐 Variáveis de Ambiente para Produção
- `NODE_ENV=production`
- `JWT_SECRET` (segredo seguro para JWT)
- `DB_URL` (URL de conexão com PostgreSQL)
- `CORS_ORIGIN` (domínio do frontend)

## 📝 Melhorias Futuras

1. 📝 Sistema de blog com CMS (Strapi/CMS próprio)
2. 🔐 OAuth2 completo para Google Calendar
3. 📊 Dashboard de analytics visual com gráficos avançados
4. ⏰ Sistema de régua de cobrança com jobs/cron automáticos
5. 🖼️ Upload real de imagens para resultados e fotos de evolução

## 📄 Licença

MIT

---

<div align="center">
  <img src="https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif" width="150" alt="Thank You">
  <h3>Desenvolvido com ❤️ para transformar a gestão de academias!</h3>
</div>