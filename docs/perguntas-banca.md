# Perguntas e Respostas para a Banca

## Docker

**O que e Docker?**
Docker e uma tecnologia que empacota aplicacao e dependencias em containers, deixando o ambiente mais previsivel.

**Por que usar container neste projeto?**
Para o professor conseguir rodar a API, o banco e o Nginx sem instalar cada componente manualmente.

**Qual imagem base foi usada no backend?**
`node:24-alpine`, por ser uma imagem leve baseada em Alpine Linux.

## Dockerfile

**Para que serve o Dockerfile?**
Ele descreve como construir a imagem do backend.

**O que e multi-stage build?**
E uma tecnica que separa etapas de construcao e execucao, reduzindo o tamanho da imagem final.

**Por que o container roda com usuario nao-root?**
Para seguir o principio do menor privilegio e reduzir impacto caso a aplicacao seja comprometida.

## Docker Compose

**Para que serve o Docker Compose?**
Para subir e configurar varios containers ao mesmo tempo.

**Quais servicos existem no Compose?**
`nginx`, `app` e `postgres`.

**Por que o app usa `expose` e nao `ports`?**
Porque o app nao deve ser acessado diretamente pelo host; o acesso passa pelo Nginx.

## PostgreSQL

**Por que usar PostgreSQL?**
Porque e um banco relacional robusto, adequado para dados estruturados como usuarios, produtos e fornecedores.

**Como os dados persistem?**
Pelo volume Docker `postgres_data`.

**O banco esta exposto ao host?**
Nao. Ele fica apenas na rede interna do Docker.

## API REST

**O que e uma API REST?**
E uma API que organiza recursos por URLs e usa metodos HTTP para operar esses recursos.

**Quais CRUDs existem?**
Usuarios, categorias, fornecedores e produtos.

**O que significa CRUD?**
Create, Read, Update e Delete: criar, consultar, atualizar e remover.

## Swagger

**Para que serve o Swagger?**
Para documentar e testar os endpoints da API pelo navegador.

**Onde ele esta disponivel?**
Em `http://localhost/api-docs`.

## JWT

**O que e JWT?**
E um token assinado usado para autenticar requisicoes.

**Como o token e enviado?**
No header `Authorization: Bearer <token>`.

**Quais rotas nao exigem token?**
`POST /api/login`, `POST /api/auth/login` e `POST /api/auth/register`.

## Git

**Por que Git e importante em trabalho em grupo?**
Porque controla historico, permite trabalho paralelo por branches e facilita revisao por pull request.

**O que e uma branch?**
E uma linha de desenvolvimento separada para implementar uma funcionalidade ou correcao.

**O que e pull request?**
E uma solicitacao para revisar e integrar alteracoes em outra branch.

## Infraestrutura

**Qual e a arquitetura do projeto?**
Arquitetura em camadas: Nginx, API Node.js e PostgreSQL.

**Qual e o ponto unico de entrada?**
O Nginx na porta 80.

**Por que usar health check?**
Para o Docker saber se o servico esta respondendo corretamente.

## Redes

**Por que existem redes Docker customizadas?**
Para controlar comunicacao entre containers e isolar o banco.

**O que e DNS interno do Docker?**
E o mecanismo que permite a um container acessar outro pelo nome do servico, como `postgres`.

**Por que nao usar IP fixo?**
Porque containers podem mudar de IP; nomes de servico sao mais estaveis.

## Seguranca

**Como o projeto evita expor o banco?**
O PostgreSQL nao publica porta no host e fica acessivel apenas pela rede interna.

**Como senhas sao armazenadas?**
Com hash PBKDF2, nao em texto puro.

**O que sao security headers no Nginx?**
Headers que ajudam a reduzir riscos comuns no navegador, como MIME sniffing e clickjacking.

**Qual cuidado falta para producao real?**
Trocar secrets padrao, usar HTTPS, backups automaticos e uma politica mais forte de logs e monitoramento.
