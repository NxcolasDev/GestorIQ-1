# GestorIQ - Recovery do Projeto

## Observacao sobre os PDFs

Os arquivos `Banco de dados.pdf`, `Infraestrutura de Sistemas Web.pdf` e `Desenvolvimento Web.pdf` existem em `c:\Users\nicol\Downloads\prova 25`.

Neste ambiente, nao foi possivel extrair o texto integral dos PDFs: `pdftotext`, Python funcional e Node local nao estavam disponiveis, e as tentativas por PowerShell/streams compactados nao retornaram texto legivel. Por isso, a verificacao abaixo usa:

- os nomes dos PDFs;
- o pedido de recovery;
- o README;
- a documentacao interna existente;
- a implementacao real do projeto.

Para garantir 100% de aderencia literal aos PDFs, ainda e necessario abrir os PDFs manualmente e comparar item a item com esta matriz.

## Matriz de requisitos por disciplina

| Area | Requisito esperado | Status | Evidencia |
|---|---|---|---|
| Banco de dados | PostgreSQL configurado | Atendido | `docker-compose.yml` |
| Banco de dados | Persistencia de dados | Atendido | volume `postgres_data` |
| Banco de dados | Tabelas principais | Atendido | `usuarios`, `categorias`, `fornecedores`, `produtos`, `produto_fornecedor` |
| Banco de dados | Relacionamento N:N | Atendido | tabela `produto_fornecedor` |
| Banco de dados | Criacao de schema | Atendido | `backend/src/config/database.js` |
| Banco de dados | Senhas protegidas | Atendido | PBKDF2 em `backend/src/utils/password.js` |
| Infraestrutura | Dockerfile | Atendido | multi-stage build |
| Infraestrutura | Docker Compose | Atendido | `nginx`, `app`, `postgres` |
| Infraestrutura | Proxy reverso | Atendido | `nginx/nginx.conf` |
| Infraestrutura | Rede customizada | Atendido | `web-network`, `app-network` |
| Infraestrutura | Banco nao exposto | Atendido | sem `ports` no PostgreSQL |
| Infraestrutura | App nao exposto diretamente | Atendido | `expose: 3000` |
| Infraestrutura | Health checks | Atendido | nos tres servicos |
| Infraestrutura | Variaveis de ambiente | Atendido | `backend/.env.example` e `env_file` |
| Desenvolvimento Web | API REST | Atendido | Express em `backend/src/app.js` |
| Desenvolvimento Web | CRUD | Atendido | usuarios, categorias, fornecedores, produtos |
| Desenvolvimento Web | JWT | Atendido | `backend/src/middlewares/auth.js` |
| Desenvolvimento Web | Swagger | Atendido | `/api-docs` |
| Desenvolvimento Web | Tratamento de erro | Atendido | `backend/src/utils/http.js` |
| Desenvolvimento Web | Documentacao para equipe | Atendido | docs novos de instalacao, estudo, banca e roteiro |
| Validacao real | Build e subida Docker | Bloqueado no ambiente | Docker Desktop nao iniciou |

## Etapa 1 - Auditoria

### Banco de dados.pdf

O PDF foi recebido, mas o ambiente local nao possuia ferramenta de extracao textual de PDF (`pdftotext`, Python funcional, Node local ou similares). A auditoria foi feita comparando o titulo indicado, os documentos internos e o estado do codigo.

Achados:
- Pronto: PostgreSQL definido no `docker-compose.yml`.
- Incompleto: nao havia conexao real do backend com PostgreSQL.
- Incorreto: `database.md` citava entidades diferentes das descritas no README/Swagger.
- Faltando: models/tabelas para usuarios, categorias, fornecedores, produtos e tabela pivo.
- Corrigido: schema automatico em `backend/src/config/database.js`.

### Infraestrutura de Sistemas Web.pdf

Achados:
- Pronto: Dockerfile multi-stage, Docker Compose com `app`, `postgres` e `nginx`, Nginx como proxy reverso, health checks e redes customizadas.
- Incompleto: validacao real com Docker nao foi possivel porque o Docker Desktop nao iniciou neste ambiente.
- Incorreto: `app-network` estava documentada como interna, mas configurada como `internal: false`.
- Faltando: backend funcional para comprovar PostgreSQL e endpoints.
- Corrigido: `app-network` ajustada para `internal: true` e backend conectado ao banco.

### Desenvolvimento Web.pdf

Achados:
- Pronto: estrutura Express, Swagger e CRUD parcial de produtos.
- Incompleto: rotas de usuarios, categorias, fornecedores, login JWT e associacao produto-fornecedor.
- Incorreto: Swagger documentava recursos que nao existiam no app.
- Faltando: middleware JWT, servicos, controllers e persistencia.
- Corrigido: CRUDs completos e login JWT implementados.

## Etapa 2 - Implementacao

Arquivos alterados:

- `backend/package.json`: adicionadas dependencias `pg` e `jsonwebtoken`.
- `Dockerfile`: troca de `npm ci` para `npm install --omit=dev`, porque o recovery adicionou dependencias novas e o lockfile antigo poderia quebrar o build.
- `docker-compose.yml`: PostgreSQL passou a usar variaveis com fallback e `app-network` virou rede interna.
- `docker-compose.yml`: Nginx passou a montar `nginx/nginx.conf` em `/etc/nginx/nginx.conf`, pois o arquivo e uma configuracao completa.
- `docker-compose.yml`: removido `POSTGRES_INITDB_ARGS` inadequado para evitar falha no primeiro boot do PostgreSQL.
- `docker-compose.yml`: removida a chave obsoleta `version` para evitar warning no Docker Compose moderno.
- `backend/.env.example`: senha padrao local e variaveis do usuario administrador.
- `backend/.dockerignore`: removida exclusao de `src/docs`, que impedia Swagger dentro da imagem.
- `backend/src/server.js`: inicializacao do banco antes do listen.
- `backend/src/app.js`: montagem das rotas reais e middleware JWT.
- `backend/src/config/database.js`: pool PostgreSQL, criacao de tabelas e seed do admin.
- `backend/src/middlewares/auth.js`: validacao de token JWT.
- `backend/src/utils/password.js`: hash e verificacao de senha com PBKDF2.
- `backend/src/utils/http.js`: tratamento comum de erro e parse de IDs.
- `backend/src/services/*`: regras de CRUD, auth e associacao N:N.
- `backend/src/controllers/*`: controllers HTTP.
- `backend/src/routes/*`: rotas da API.
- `data/postgres/.gitkeep`: garante que o caminho usado pelo volume do PostgreSQL exista.
- `docs/api.md` e `docs/database.md`: documentacao alinhada com o codigo atual.

## Etapa 3 - Validacao

Realizado:

- `docker compose config`: passou e gerou configuracao final corretamente.
- Verificacao estatica de imports e rotas com `rg`.
- Verificacao de Dockerfile, Compose, env, Swagger e estrutura de pastas.

Bloqueado:

- `docker compose build app`: falhou porque o Docker Desktop nao iniciou na maquina.
- Testes reais de endpoint e PostgreSQL: dependem do Docker Desktop ativo.
- `docker info` retornou: `Error response from daemon: Docker Desktop is unable to start`.

Comandos para validar quando Docker estiver ativo:

```bash
docker compose build app
docker compose up -d
docker compose ps
curl http://localhost/health
curl http://localhost/api-docs
curl -X POST http://localhost/api/login -H "Content-Type: application/json" -d "{\"email\":\"admin@gestoriq.com\",\"senha\":\"senha123\"}"
```

## Etapa 4 - Material de estudo

O projeto e uma API REST de gestao de estoque. O Nginx recebe as requisicoes na porta 80 e encaminha para o app Node.js na rede interna. O app usa PostgreSQL para persistir usuarios, categorias, produtos, fornecedores e a relacao N:N entre produtos e fornecedores.

Foi feito para demonstrar containerizacao, redes Docker, persistencia, proxy reverso, variaveis de ambiente, API REST, Swagger e seguranca basica com JWT.

Na apresentacao, mostre primeiro a arquitetura, depois o Compose, o Dockerfile, o Nginx, o login no Swagger e um CRUD simples.

## Etapa 5 - Perguntas de apresentacao

1. Por que usar Docker?
   Para empacotar a aplicacao com ambiente previsivel e facilitar execucao em qualquer maquina.

2. Qual a funcao do Dockerfile?
   Definir como a imagem do backend Node.js e construida.

3. Qual a funcao do Docker Compose?
   Orquestrar os containers `nginx`, `app` e `postgres` juntos.

4. Por que o PostgreSQL nao expoe porta no host?
   Porque apenas a API deve acessar o banco pela rede interna.

5. O que o Nginx faz?
   Atua como proxy reverso, ponto unico de entrada e camada de headers/rate limit.

6. Como a API protege rotas?
   Com JWT no header `Authorization: Bearer <token>`.

7. Para que serve o Swagger?
   Documentar e testar os endpoints pelo navegador.

8. O que e uma tabela pivo?
   Uma tabela que representa uma relacao muitos-para-muitos, como produto e fornecedor.

9. Como os dados persistem?
   Pelo volume Docker `postgres_data`.

10. Qual risco ainda existe?
    O projeto precisa ser testado em Docker Desktop ativo antes da apresentacao.

11. Por que usar Git em grupo?
    Para controlar historico, dividir tarefas por branch e revisar mudancas antes de integrar no projeto principal.

12. O que e um pull request?
    E uma proposta de mudanca que permite revisao do codigo antes do merge.

13. Qual a diferenca entre `expose` e `ports` no Compose?
    `expose` deixa a porta disponivel apenas entre containers; `ports` publica a porta no host.

14. Por que existem duas redes Docker?
    Para separar a entrada publica (`web-network`) da comunicacao interna da aplicacao (`app-network`).

15. O que e DNS interno do Docker?
    E a resolucao automatica de nomes de servico, por exemplo `app` e `postgres`, sem usar IP fixo.

16. Por que nao salvar senha em texto puro?
    Porque um vazamento do banco revelaria credenciais reais. O projeto usa hash PBKDF2.

17. O que e principio do menor privilegio?
    Cada servico deve ter apenas as permissoes necessarias. No Dockerfile, o app roda com usuario nao-root.

18. Como o Swagger ajuda na avaliacao?
    Ele permite mostrar as rotas, exemplos de payload e testes sem precisar decorar todos os endpoints.

19. O que acontece se o container do app cair?
    O Compose usa `restart: unless-stopped`, entao o Docker tenta reiniciar o servico.

20. Por que usar variaveis de ambiente?
    Para separar configuracao e segredos do codigo-fonte.

## Etapa 6 - Checklist final

Pronto:
- Dockerfile.
- Docker Compose.
- Nginx.
- PostgreSQL no Compose.
- API REST com CRUDs.
- JWT.
- Swagger.
- Documentacao principal.
- `docs/instalacao.md`.
- `docs/estudo-prova.md`.
- `docs/perguntas-banca.md`.
- `docs/roteiro-apresentacao.md`.

Falta validar:
- Build real da imagem.
- Subida dos tres containers.
- Teste real dos endpoints via curl/Swagger.

Pode causar problema na apresentacao:
- Docker Desktop nao iniciar.
- Porta 80 ocupada.
- Dependencias novas exigirem internet no primeiro build.
- `version: '3.9'` gerar aviso no Compose moderno.
