# Decisões de Infraestrutura

- Manteve-se Docker Compose para orquestrar `app`, `postgres` e `nginx`.
- Nginx foi escolhido como proxy reverso para atender à arquitetura solicitada.
- PostgreSQL foi mantido como banco de dados relacional.
- O backend foi reduzido ao mínimo funcional para que a infraestrutura seja validada e entregue ao time.
