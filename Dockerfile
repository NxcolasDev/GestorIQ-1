# ============================================================================
# STAGE 1: BUILDER
# Propósito: Compilar dependências em ambiente controlado
# Otimização: Camadas não-mutáveis instaladas ANTES do código-fonte
# ============================================================================
FROM node:24-alpine AS builder

WORKDIR /app

# Copiar apenas package files - camada menos mutável (cache)
COPY package*.json ./

# Instalar dependências com verificação de integridade
RUN npm install --omit=dev

# Copiar código-fonte - camada mais mutável
COPY src ./src
COPY command.js ./command.js

# Remover dependências de desenvolvimento
RUN npm prune --omit=dev

# ============================================================================
# STAGE 2: RUNTIME (Produção)
# Propósito: Imagem leve contendo apenas o necessário para execução
# Tamanho: ~150MB vs ~500MB sem multi-stage
# Segurança: Sem ferramentas de build ou node_modules original
# ============================================================================
FROM node:24-alpine

# Metadados de produção
LABEL maintainer="GestorIQ Team"
LABEL version="1.0.0"
LABEL description="GestorIQ - API REST para Gestão de Estoque"

WORKDIR /app

# Copiar apenas artefatos necessários da stage builder
COPY --from=builder /app .

# Criar grupo e usuário não-root para segurança
# Principle of Least Privilege: Executar com permissões mínimas
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Mudar proprietário de arquivos
RUN chown -R appuser:appgroup /app

# Trocar para usuário não-root
USER appuser

# Expor porta da aplicação
EXPOSE 3000

# Configurar variáveis de ambiente
ENV NODE_ENV=production
ENV NODE_PATH=/app

# Health Check: Verifica se aplicação está respondendo
# Permite Docker orquestrador recuperar contêineres problemáticos
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Comando de inicialização com exec form
# Usar exec form permite receber sinais de encerramento (SIGTERM)
CMD ["node", "src/server.js"]
