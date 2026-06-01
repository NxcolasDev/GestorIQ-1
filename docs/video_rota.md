# Roteiro de Vídeo Detalhado - GestorIQ

Duração sugerida: 4-5 minutos.
Cada membro apresenta sua parte com fala clara e ações no PC.

---

## 1. Nicolas - Introdução e visão geral

### Fala
"Olá, meu nome é Nicolas. Este é o GestorIQ, um sistema de gestão de estoque construído como uma API REST containerizada. Nesta entrega, nós focamos na infraestrutura: Docker, Docker Compose, Nginx, Node.js e PostgreSQL."

"A ideia é mostrar que a aplicação está pronta para rodar em containers, com proxy reverso e banco persistente, mesmo que o backend ainda esteja em versão inicial."

### Ações no PC
1. Abrir o repositório no VS Code.
2. Navegar rapidamente até `Dockerfile`, `docker-compose.yml` e `nginx/nginx.conf`.
3. Mostrar o arquivo `backend/.env.example` para explicar onde ficam as variáveis de ambiente.

### Objetivo
- Contextualizar o projeto
- Apresentar o escopo da entrega
- Enfatizar que a infraestrutura está configurada

---

## 2. João - Dockerfile e build do backend

### Fala
"Eu sou João e vou explicar o Dockerfile do backend. Usamos `node:24-alpine` para manter a imagem leve e segura."

"O Dockerfile é multi-stage: o primeiro estágio instala dependências e compila o app, e o segundo cria a imagem final com apenas o que é necessário para rodar."

"Também usamos `USER appuser` para executar o container sem privilégios de root, e um `HEALTHCHECK` para garantir que o serviço está respondendo corretamente."

### Ações no PC
1. Abrir `Dockerfile` no VS Code.
2. Mostrar trecho de `FROM node:24-alpine AS builder` e `RUN npm ci --only=production`.
3. Mostrar trecho de `USER appuser` e `HEALTHCHECK`.
4. Citar o motivo de cada bloco:
   - cache de dependências
   - imagem menor
   - segurança

### Objetivo
- Demonstrar entendimento do build Docker
- Mostrar boas práticas de imágens de produção

---

## 3. Maciel - Nginx e proxy reverso

### Fala
"Eu sou Maciel e vou falar sobre a camada Nginx. O Nginx é o único serviço exposto ao host em `http://localhost/`. Ele encaminha as requisições para o app Node.js que roda internamente em `app:3000`."

"No arquivo `nginx/nginx.conf`, temos também proteção extra: headers de segurança, bloqueio de arquivos sensíveis e limitação de requisições."

### Ações no PC
1. Abrir `nginx/nginx.conf` no VS Code.
2. Mostrar o bloco `upstream backend { server app:3000; }`.
3. Mostrar o bloco `location /` com `proxy_pass` e `proxy_set_header`.
4. Apontar as linhas de `add_header` e `limit_req_zone`.

### Objetivo
- Explicar o papel do proxy reverso
- Mostrar como o tráfego é roteado internamente
- Mostrar segurança básica no Nginx

---

## 4. Renan - Docker Compose e redes

### Fala
"Meu nome é Renan. Vou explicar o `docker-compose.yml` e a arquitetura de redes."

"Temos três serviços: `nginx`, `app` e `postgres`. O `nginx` está na rede externa `web-network`, e o `app` e `postgres` estão na rede interna `app-network`."

"Isso garante que o PostgreSQL não fique exposto externamente. Só o Nginx acessa o app, e só o app acessa o banco."

### Ações no PC
1. Abrir `docker-compose.yml` no VS Code.
2. Mostrar os serviços `nginx`, `app` e `postgres`.
3. Mostrar o trecho de `networks:` com `web-network` e `app-network`.
4. Mostrar `depends_on`, `healthcheck`, `restart` e `volumes` do Postgres.

### Objetivo
- Mostrar a topologia de serviços
- Explicar isolamento de rede
- Mostrar persistência do banco

---

## 5. Yuri - Execução, testes e conclusão

### Fala
"Eu sou o Yuri. Vou apresentar como rodar e testar o sistema."

"Para iniciar, copie o template de ambiente e execute `docker compose build --no-cache` e `docker compose up -d`. Depois, verifique se os serviços estão saudáveis com `docker compose ps`."

"O endpoint `http://localhost/` é a entrada pelo Nginx. O health check também está disponível em `http://localhost/health`."

"Esta infraestrutura já está pronta para receber o desenvolvimento do backend, e o próximo passo do time é implementar as rotas, modelos e a lógica de negócio."

### Ações no PC
1. Mostrar o terminal com o comando `docker compose ps`.
2. Mostrar o terminal com `docker compose logs -f app` ou `docker compose logs nginx` rapidamente.
3. Abrir o navegador e acessar `http://localhost/` e `http://localhost/health`.
4. Mostrar o arquivo `backend/.env.example` e lembrar que `backend/.env` não deve ser commitado.

### Objetivo
- Demonstrar que o ambiente entra em funcionamento
- Confirmar endpoints e saúde
- Finalizar com conclusão clara

---

## Dicas de sincronização entre os membros

1. Comece a gravação com Nicolas apresentando o contexto.
2. Cada membro faz sua parte de forma sequencial, sem sobrepor falas.
3. No computador:
   - abra o VS Code no início
   - mantenha janelas claras dos arquivos mencionados
   - use o terminal apenas no final para mostrar commands e status
4. Não precisa mostrar todos os arquivos, apenas os trechos relevantes.
5. Termine com uma frase combinada, por exemplo:
   "GestorIQ está pronto para rodar em Docker, com infraestrutura configurada e backend pronto para ser desenvolvido."