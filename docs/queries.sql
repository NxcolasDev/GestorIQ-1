-- ============================================================================
-- GestorIQ - Consultas Críticas da Aplicação
-- ============================================================================
-- 
-- Conforme requisitos do PDF: apresentar 5+ consultas relevantes
-- com explicação de importância e evidências de otimização
--
-- Cada consulta demonstra um padrão importante:
-- 1. Relatório de Estoque (Agregação)
-- 2. Produtos por Fornecedor (JOIN complexo com N:N)
-- 3. Análise de Categorias (GROUP BY com agregação)
-- 4. Filtro por Período (WHERE com ordenação)
-- 5. Relatório de Fornecedores (DISTINCT com contagem)
-- 6. Busca avançada com múltiplos critérios (Complex JOINs)
--
-- ============================================================================

-- ============================================================================
-- CONSULTA 1: Relatório de Estoque Crítico
-- ============================================================================
-- Importância: Identificar produtos com pouco estoque para reposição
-- Tipo: Agregação simples, filtragem por critério
-- Otimização: Índice em quantidade_estoque melhora performance
--
-- Cenário: O gerente precisa saber quais produtos têm menos de 50 unidades
-- Esperado: ~15 produtos com estoque crítico

SELECT 
  p.id,
  p.nome,
  p.preco,
  p.quantidade_estoque,
  c.nome as categoria,
  CASE 
    WHEN p.quantidade_estoque < 10 THEN 'Crítico'
    WHEN p.quantidade_estoque < 25 THEN 'Baixo'
    ELSE 'Normal'
  END as status_estoque
FROM produtos p
INNER JOIN categorias c ON p.categoria_id = c.id
WHERE p.quantidade_estoque < 50
ORDER BY p.quantidade_estoque ASC;

-- ============================================================================
-- CONSULTA 2: Produtos com Fornecedores (Relação N:N)
-- ============================================================================
-- Importância: Principal query de negócio - relacionar produtos a fornecedores
-- Tipo: JOIN complexo com tabela pivô (N:N)
-- Otimização: Índices em foreign keys (produto_id, fornecedor_id)
-- 
-- Cenário: Listar todos os produtos com seus fornecedores
-- Esperado: ~150 relacionamentos (alguns produtos têm múltiplos fornecedores)

SELECT 
  p.id as produto_id,
  p.nome as produto_nome,
  p.preco,
  p.quantidade_estoque,
  f.id as fornecedor_id,
  f.nome as fornecedor_nome,
  f.email as fornecedor_email,
  f.telefone as fornecedor_telefone,
  pf.created_at as data_associacao
FROM produtos p
INNER JOIN produto_fornecedor pf ON p.id = pf.produto_id
INNER JOIN fornecedores f ON pf.fornecedor_id = f.id
ORDER BY p.nome, f.nome;

-- ============================================================================
-- CONSULTA 3: Análise de Categorias com Agregação
-- ============================================================================
-- Importância: Relatório executivo - quantos produtos por categoria
-- Tipo: GROUP BY com agregações (COUNT, MIN, MAX, AVG)
-- Otimização: Índice em categoria_id e GROUP BY
-- 
-- Cenário: Quais categorias têm mais produtos? Qual o preço médio?
-- Esperado: 15 categorias com estatísticas

SELECT 
  c.id,
  c.nome as categoria,
  COUNT(p.id) as total_produtos,
  COUNT(DISTINCT p.id) as produtos_unicos,
  MIN(p.preco) as preco_minimo,
  MAX(p.preco) as preco_maximo,
  ROUND(AVG(p.preco), 2) as preco_medio,
  SUM(p.quantidade_estoque) as estoque_total,
  ROUND(SUM(p.preco * p.quantidade_estoque), 2) as valor_total_estoque
FROM categorias c
LEFT JOIN produtos p ON c.id = p.categoria_id
GROUP BY c.id, c.nome
ORDER BY total_produtos DESC;

-- ============================================================================
-- CONSULTA 4: Filtragem por Período com Ordenação
-- ============================================================================
-- Importância: Rastrear novos produtos e mudanças recentes
-- Tipo: WHERE com data, ORDER BY, LIMIT
-- Otimização: Índice em created_at melhora muito
-- 
-- Cenário: Quais produtos foram adicionados nos últimos 30 dias?
-- Esperado: Histórico de criação/atualização

SELECT 
  id,
  nome,
  descricao,
  preco,
  quantidade_estoque,
  created_at,
  updated_at,
  CASE 
    WHEN updated_at > created_at THEN 'Modificado'
    ELSE 'Novo'
  END as status_produto
FROM produtos
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
  OR updated_at >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY created_at DESC, updated_at DESC
LIMIT 100;

-- ============================================================================
-- CONSULTA 5: Relatório de Fornecedores com Contagem
-- ============================================================================
-- Importância: Estratégia de supply chain - quais fornecedores são mais críticos?
-- Tipo: DISTINCT, COUNT, LEFT JOIN com agregação
-- Otimização: Índice em fornecedor_id da tabela pivô
-- 
-- Cenário: Quantos produtos cada fornecedor oferece? Qual sua importância?
-- Esperado: ~20 fornecedores com estatísticas

SELECT 
  f.id,
  f.nome as fornecedor,
  f.cnpj,
  f.email,
  f.telefone,
  COUNT(DISTINCT pf.produto_id) as total_produtos_fornecidos,
  COUNT(DISTINCT p.categoria_id) as categorias_atendidas,
  ROUND(AVG(p.preco), 2) as preco_medio_produtos,
  MIN(p.preco) as menor_produto,
  MAX(p.preco) as maior_produto
FROM fornecedores f
LEFT JOIN produto_fornecedor pf ON f.id = pf.fornecedor_id
LEFT JOIN produtos p ON pf.produto_id = p.id
GROUP BY f.id, f.nome, f.cnpj, f.email, f.telefone
ORDER BY total_produtos_fornecidos DESC;

-- ============================================================================
-- CONSULTA 6: Busca Avançada Multi-Critério
-- ============================================================================
-- Importância: Suporte a filtros avançados na interface
-- Tipo: Multiple JOINs com WHERE complexo
-- Otimização: Índices em categoria_id, preco, quantidade_estoque
-- 
-- Cenário: Encontrar produtos:
--   - Na categoria "Notebooks" OU "Periféricos"
--   - Preço entre R$ 1000 e R$ 5000
--   - Com estoque > 20 unidades
--   - Que têm fornecedores São Paulo/Rio

SELECT 
  p.id,
  p.nome as produto,
  p.descricao,
  p.preco,
  p.quantidade_estoque,
  c.nome as categoria,
  COUNT(DISTINCT f.id) as total_fornecedores,
  GROUP_CONCAT(DISTINCT f.nome, ', ') as fornecedores_lista
FROM produtos p
INNER JOIN categorias c ON p.categoria_id = c.id
LEFT JOIN produto_fornecedor pf ON p.id = pf.produto_id
LEFT JOIN fornecedores f ON pf.fornecedor_id = f.id
WHERE c.nome IN ('Eletrônicos', 'Informática', 'Periféricos', 'Redes')
  AND p.preco BETWEEN 500.00 AND 5000.00
  AND p.quantidade_estoque > 20
GROUP BY p.id, p.nome, p.descricao, p.preco, p.quantidade_estoque, c.nome
HAVING COUNT(DISTINCT f.id) > 0
ORDER BY p.preco ASC;

-- ============================================================================
-- CONSULTAS AUXILIARES PARA MONITORAMENTO
-- ============================================================================

-- Total de produtos por status de estoque
SELECT 
  CASE 
    WHEN quantidade_estoque = 0 THEN 'Sem Estoque'
    WHEN quantidade_estoque < 10 THEN 'Crítico'
    WHEN quantidade_estoque < 50 THEN 'Baixo'
    ELSE 'Normal'
  END as status,
  COUNT(*) as total_produtos,
  SUM(quantidade_estoque) as total_unidades
FROM produtos
GROUP BY status;

-- Valor total do inventário
SELECT 
  COUNT(*) as total_produtos,
  SUM(quantidade_estoque) as total_unidades,
  ROUND(SUM(preco * quantidade_estoque), 2) as valor_total_inventario,
  ROUND(AVG(preco), 2) as preco_medio,
  MIN(preco) as preco_minimo,
  MAX(preco) as preco_maximo
FROM produtos;

-- Usuários e sua atividade (para auditoría)
SELECT 
  id,
  nome,
  email,
  created_at,
  updated_at,
  EXTRACT(DAY FROM AGE(NOW(), created_at)) as dias_cadastro
FROM usuarios
ORDER BY created_at DESC;

-- ============================================================================
-- NOTAS DE OTIMIZAÇÃO
-- ============================================================================
-- 
-- Índices Recomendados (ver INDICES.md):
-- 
-- 1. CREATE INDEX idx_produtos_categoria_id ON produtos(categoria_id);
--    → Melhora JOIN com categorias
-- 
-- 2. CREATE INDEX idx_produtos_quantidade ON produtos(quantidade_estoque);
--    → Melhora filtros de estoque crítico
-- 
-- 3. CREATE INDEX idx_produtos_preco ON produtos(preco);
--    → Melhora filtros de faixa de preço
-- 
-- 4. CREATE INDEX idx_produtos_created_at ON produtos(created_at);
--    → Melhora buscas por período
-- 
-- 5. CREATE INDEX idx_produto_fornecedor_produto_id ON produto_fornecedor(produto_id);
--    → Melhora JOINs com tabela pivô
-- 
-- 6. CREATE INDEX idx_produto_fornecedor_fornecedor_id ON produto_fornecedor(fornecedor_id);
--    → Inverso: buscar produtos de um fornecedor
--
-- 7. CREATE UNIQUE INDEX idx_usuarios_email ON usuarios(email);
--    → Garante unicidade de email (já foi feito no schema)
--
-- ============================================================================
