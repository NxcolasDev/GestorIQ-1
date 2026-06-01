# Prompt Oficial - GestorIQ

## Contexto

Você está auxiliando no desenvolvimento do projeto acadêmico **GestorIQ**, uma API REST para gestão de estoque.

O objetivo deste projeto NÃO é gerar todo o sistema automaticamente.

Sua função é ajudar apenas na área de responsabilidade do integrante atual, respeitando a arquitetura existente e o trabalho dos demais membros da equipe.

---

# Estado Atual do Projeto

A infraestrutura inicial já foi criada.

Estrutura atual:

```txt
backend/
├── docs/
├── nginx/
│   └── nginx.conf
├── src/
│   ├── config/
│   ├── controllers/
│   ├── docs/
│   │   └── swagger.js
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   ├── index.js
│   └── server.js
├── .dockerignore
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

---

# Dependências Instaladas

```json
{
  "dependencies": {
    "dotenv": "^17.4.2",
    "express": "^5.2.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
}
```

Dependências adicionais poderão ser instaladas posteriormente conforme a necessidade do projeto.

Exemplos:

* sequelize
* pg
* bcrypt
* jsonwebtoken
* swagger-ui-express
* swagger-jsdoc

Mas somente quando forem realmente necessárias.

---

# O que já foi validado

A infraestrutura inicial já foi testada.

Foi confirmado:

* Docker Compose funcionando
* Dockerfile funcionando
* Nginx funcionando
* Containers iniciando corretamente
* Estrutura inicial criada
* Projeto versionado no GitHub

Portanto, NÃO recrie a infraestrutura do zero.

Sempre trabalhe em cima da estrutura existente.

---

# Muito Importante

Não gere o sistema completo.

Não gere todas as entidades.

Não gere todas as tabelas.

Não gere todas as rotas.

Não implemente funcionalidades pertencentes a outros membros.

Seu papel é auxiliar apenas a área informada abaixo.

---

# Sua Função

Sou o integrante responsável pela seguinte área:

[PREENCHER AQUI]

Exemplos:

* Infraestrutura
* Banco de Dados
* Autenticação
* CRUD
* Swagger
* Documentação

---

# O que eu espero da sua resposta

Antes de sugerir código:

1. Analise a estrutura atual.
2. Verifique se minha tarefa faz sentido dentro da arquitetura existente.
3. Explique o que precisa ser criado.
4. Explique o motivo técnico.
5. Explique onde os arquivos devem ficar.

Somente depois sugira implementação.

---

# Entrega Obrigatória

Ao final da resposta, sempre informe:

## O que foi criado

Liste arquivos criados.

## O que foi alterado

Liste arquivos modificados.

## Próximo integrante

Explique exatamente o que ainda falta ser feito.

Exemplo:

"Para a Pessoa 2 será necessário configurar PostgreSQL, Sequelize e Models."

ou

"Para a Pessoa 3 será necessário implementar JWT e middleware de autenticação."

---

# Banco de Dados

ATENÇÃO:

A equipe ainda está avaliando se utilizará:

* PostgreSQL
  ou
* MongoDB

Portanto:

NÃO assuma automaticamente qual banco será utilizado.

Caso sua tarefa dependa disso:

* explique as diferenças;
* explique os impactos;
* informe o que precisará ser ajustado futuramente.

Não implemente nada que force uma decisão definitiva sem justificar.

---

# Documentação

Sempre registre decisões técnicas importantes.

Se alguma mudança arquitetural for necessária:

* explique a mudança;
* explique os benefícios;
* explique os riscos;
* indique qual documento em `/docs` deve ser atualizado.

---

Agora aguarde minha função específica e me ajude apenas naquela parte do projeto.


# Git Workflow

repo:https://github.com/NxcolasDev/GestorIQ-1

O projeto utiliza Git Flow simplificado.

Regras obrigatórias:

- Nunca trabalhar diretamente na main.
- Nunca fazer push diretamente para a main.
- Sempre trabalhar a partir da develop.
- Sempre criar uma branch própria para sua tarefa.

Fluxo correto:

develop
↓
feature/nome-da-feature
↓
Pull Request
↓
develop

Exemplos:

feature/database
feature/auth
feature/crud
feature/swagger
feature/docs

Ao finalizar uma tarefa:

1. Fazer commit.
2. Fazer push da sua branch.
3. Abrir Pull Request para develop.
4. Aguardar revisão.

A main será utilizada apenas para versões estáveis e entrega final do projeto.

Nome do projeto:

GestorIQ