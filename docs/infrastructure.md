# Infraestrutura do GestorIQ

## Serviços Docker
- `app`: API Node.js.
- `postgres`: PostgreSQL para persistência.
- `nginx`: proxy reverso.

## Docker Compose
- Usa rede customizada `gestoriq-network`.
- Persistência de dados do PostgreSQL em volume `postgres_data`.
- `env_file` configura variáveis de ambiente para o app.

## Nginx
- O arquivo `nginx/nginx.conf` redireciona todo tráfego para `http://app:3000`.
- O container Nginx expõe a porta 80.
