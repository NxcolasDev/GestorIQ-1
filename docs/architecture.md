# Arquitetura do GestorIQ

Este repositório mantém a camada de infraestrutura do projeto.

## Arquitetura recomendada
- `nginx` serve como proxy reverso.
- `app` é a API Node.js mínima exposta na porta 3000.
- `postgres` é o banco de dados relacional.

## Fluxo de requisições
1. O cliente acessa o Nginx em `localhost:80`.
2. Nginx encaminha para o serviço `app` em `http://app:3000`.
3. A API pode se comunicar com o PostgreSQL via `postgres:5432`.

## Comunicação entre containers
- Rede Docker `gestoriq-network` conecta `nginx`, `app` e `postgres`.
- `nginx` faz proxy HTTP para `app`.
- `app` se conecta ao PostgreSQL usando variáveis de ambiente.

## Justificativa da estrutura
- A estrutura minimalista deixa claro o papel da infraestrutura.
- O backend real pode ser desenvolvido pelos demais membros em outra branch ou código.
- O Docker Compose centraliza a orquestração para desenvolvimento local.
