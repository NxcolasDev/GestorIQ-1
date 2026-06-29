#!/usr/bin/env bash

set -e

echo "Subindo infraestrutura GestorIQ..."

docker compose up --build -d

echo "Status dos containers:"
docker compose ps

echo "Executando migrations..."
docker compose exec app node command.js migrate

echo "Executando seed..."
docker compose exec app node command.js seed

echo "Criando usuário administrador..."
docker compose exec app node command.js seed-admin

echo "Verificando conexão com banco..."
docker compose exec app node command.js health

echo "Ambiente pronto."
echo "Health: http://localhost/health"
echo "Swagger: http://localhost/api-docs"