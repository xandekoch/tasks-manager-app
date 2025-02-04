# Task Manager App - Monorepo

Este é um projeto de **Task Manager** com uma estrutura monorepo que contém um **frontend**, um **backend**, e um proxy **caddy**.

## Tecnologias Utilizadas

- **Frontend:** Next.js, Typescript, Zustand, Shadcn, Zod, Tailwind, Axios
- **Backend:** Node.js, Express.js, Mongoose, Helmet, Morgan
- **Banco de Dados:** MongoDB
- **Docker:** Contêineres para o ambiente de desenvolvimento
- **Docker Compose:** Orquestração de múltiplos containers
- **Reverse Proxy:** Caddy

---

## Requisitos

Antes de rodar o projeto, é necessário ter o **Docker** e o **Docker Compose** instalados em sua máquina.

### Instalar Docker

- Siga as instruções para instalação do Docker [aqui](https://docs.docker.com/get-docker/).

### Instalar Docker Compose

- Siga as instruções para instalação do Docker Compose [aqui](https://docs.docker.com/compose/install/).

---

## Rodando o Projeto

### Passo 1: Clonar o Repositório

Se você ainda não clonou o repositório, use o comando abaixo:

```bash
git clone https://github.com/xandekoch/tasks-manager-app.git
cd tasks-manager-app
```

### Passo 2: Configurar as Variáveis de Ambiente:

Dentro de frontend e backend, crie um arquivo .env com base nos .env.example disponíveis.
Certifique-se de apontar corretamente as urls (frontend = 3000, backend = 3001).

### Passo 3: Configurar as Variáveis de Ambiente:

Na raiz do projeto, rode o seguinte comando:

```bash
docker-compose up --build -d
```

### Passo 4: Usando o app:

Agora abre o localhost:3000 no seu Browser e faça login com as seguintes credenciais:

```bash
email: admin@admin.com
password: admin123
```

Você pode conferir os projects, tasks e users criados automaticamente pelo script initializeDb.js do backend. Lembre-se de comentar a linha dele no index.js após o primeiro uso:

```bash
Run once to clean and seed the Db
initializeDb().then(() => {
    console.log("Database seeded successfully!");
}).catch((err) => {
    console.error("Error seeding database:", err);
});
```

Escolha um manager ou um user e explore o app na visão deles, para conferir os nívei de permissão. 
Todas as senhas são **admin123**.
