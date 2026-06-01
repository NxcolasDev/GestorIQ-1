# GestorIQ

Sistema de gestão de estoque desenvolvido para a disciplina de Desenvolvimento Web, seguindo o padrão REST e utilizando infraestrutura baseada em containers Docker.

## Objetivo

O GestorIQ tem como objetivo fornecer uma API REST para gerenciamento de estoque, permitindo o controle de usuários, produtos, categorias e movimentações de estoque através de endpoints seguros e documentados.

O projeto foi desenvolvido com foco em:

* Arquitetura em camadas
* Boas práticas REST
* Containerização com Docker
* Persistência de dados em PostgreSQL
* Autenticação via JWT
* Documentação com Swagger

---

## Tecnologias Utilizadas

### Backend

* Node.js
* Express
* Sequelize ORM
* PostgreSQL
* JWT
* Bcrypt

### Infraestrutura

* Docker
* Docker Compose
* Nginx
* Named Volumes
* Custom Bridge Network

### Documentação

* Swagger
* README
* Postman

---

## Arquitetura

A aplicação segue a seguinte arquitetura:

```text
Host
  │
  ▼
Nginx
  │
  ▼
Node.js API
  │
  ▼
PostgreSQL
```

O Nginx atua como proxy reverso, sendo o único serviço exposto ao host.

---

## Estrutura do Projeto

```text
src/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
├── utils/
├── app.js
└── server.js

docs/
nginx/
Dockerfile
docker-compose.yml
README.md
```

---

## Como Executar

### 1. Clonar o projeto

```bash
git clone <repositorio>
cd GestorIQ
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

### 3. Subir os containers

```bash
docker compose up --build
```

---

## Containers

O ambiente é composto por:

| Serviço  | Descrição                 |
| -------- | ------------------------- |
| nginx    | Proxy reverso             |
| app      | API Node.js               |
| postgres | Banco de dados PostgreSQL |
| redis*   | Cache (caso utilizado)    |

---

## Documentação da API

A documentação Swagger estará disponível em:

```text
/api-docs
```

---

## Autenticação

O sistema utiliza JWT.

Fluxo:

1. Login do usuário
2. Geração do token
3. Envio do token no header Authorization

Exemplo:

```text
Authorization: Bearer TOKEN
```

---

## Equipe

Projeto acadêmico desenvolvido para a disciplina de Desenvolvimento Web.

---

## Licença

Projeto desenvolvido exclusivamente para fins educacionais.
