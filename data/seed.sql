-- ============================================================================
-- GestorIQ - Dados de Teste e Seed
-- ============================================================================
-- Este arquivo contém dados fictícios para população inicial do banco
-- Inclui 100+ registros de categorias, fornecedores, produtos e usuários
-- 
-- Executar com:
--   node command.js seed
-- ============================================================================

-- ============================================================================
-- USUÁRIOS (10 usuários adicionais + admin)
-- ============================================================================

INSERT INTO usuarios (nome, email, senha_hash) VALUES
  -- Admin já é criado automaticamente
  ('Maria Silva', 'maria@gestoriq.com', '120000:' || RANDOM()::text || ':' || RANDOM()::text),
  ('João Santos', 'joao@gestoriq.com', '120000:' || RANDOM()::text || ':' || RANDOM()::text),
  ('Ana Costa', 'ana@gestoriq.com', '120000:' || RANDOM()::text || ':' || RANDOM()::text),
  ('Carlos Oliveira', 'carlos@gestoriq.com', '120000:' || RANDOM()::text || ':' || RANDOM()::text),
  ('Patricia Souza', 'patricia@gestoriq.com', '120000:' || RANDOM()::text || ':' || RANDOM()::text),
  ('Roberto Lima', 'roberto@gestoriq.com', '120000:' || RANDOM()::text || ':' || RANDOM()::text),
  ('Fernanda Alves', 'fernanda@gestoriq.com', '120000:' || RANDOM()::text || ':' || RANDOM()::text),
  ('Marcos Pereira', 'marcos@gestoriq.com', '120000:' || RANDOM()::text || ':' || RANDOM()::text),
  ('Lucia Martins', 'lucia@gestoriq.com', '120000:' || RANDOM()::text || ':' || RANDOM()::text),
  ('Felipe Gomes', 'felipe@gestoriq.com', '120000:' || RANDOM()::text || ':' || RANDOM()::text)
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- CATEGORIAS (15 categorias diferentes)
-- ============================================================================

INSERT INTO categorias (nome, descricao) VALUES
  ('Eletrônicos', 'Produtos eletrônicos em geral, computadores, periféricos'),
  ('Informática', 'Computadores, notebooks, desktops, componentes'),
  ('Periféricos', 'Mouses, teclados, webcams, fones de ouvido'),
  ('Redes', 'Cabos de rede, switches, routers, modems'),
  ('Impressoras', 'Impressoras laser, jato de tinta, multifuncionais'),
  ('Armazenamento', 'Hard drives, SSDs, pendrives, cartões de memória'),
  ('Gabinetes', 'Gabinetes, fontes, coolers, ventiladores'),
  ('Monitores', 'Monitores LCD, LED, full HD, 4K'),
  ('Tablets', 'Tablets Android, iPad, acessórios para tablets'),
  ('Smartphones', 'Celulares, capas, películas, carregadores'),
  ('Acessórios USB', 'Hubs USB, docking stations, adaptadores'),
  ('Cabos e Conectores', 'Cabos HDMI, USB, 3.5mm, VGA, DisplayPort'),
  ('Software', 'Programas, sistemas operacionais, antivírus'),
  ('Gaming', 'Mouses gaming, teclados mecânicos, headsets'),
  ('Servidores', 'Servidores, racks, UPS, energia')
ON CONFLICT (nome) DO NOTHING;

-- ============================================================================
-- FORNECEDORES (20 fornecedores fictícios)
-- ============================================================================

INSERT INTO fornecedores (nome, cnpj, telefone, email) VALUES
  ('Tech Solutions Brasil', '11.222.333/0001-44', '(11) 3021-5000', 'contato@techsolutions.com.br'),
  ('Distribuição TI Ltda', '22.333.444/0001-55', '(11) 3456-7890', 'vendas@distribuicaoti.com.br'),
  ('Computadores ABC', '33.444.555/0001-66', '(21) 3789-0123', 'contato@computadoresabc.com.br'),
  ('Eletrônicos Global', '44.555.666/0001-77', '(31) 9876-5432', 'vendas@eletronicosglob.com.br'),
  ('SupriBits Indústria', '55.666.777/0001-88', '(41) 2345-6789', 'comercial@supribits.com.br'),
  ('SoftWare Premium', '66.777.888/0001-99', '(51) 8765-4321', 'suporte@softwareprem.com.br'),
  ('Hardware Inovador', '77.888.999/0001-00', '(61) 3210-9876', 'contato@hardwareinov.com.br'),
  ('Distribuição NET', '88.999.000/0001-11', '(85) 9876-5432', 'vendas@distribnet.com.br'),
  ('TI Express Ltda', '99.000.111/0001-22', '(62) 3456-7890', 'logistica@tiexpress.com.br'),
  ('Mega Componentes', '00.111.222/0001-33', '(67) 8765-4321', 'contato@megacomp.com.br'),
  ('Equipamentos Pro', '11.222.333/0001-44', '(48) 2345-6789', 'vendas@equipspro.com.br'),
  ('Fornecedor Top', '22.333.444/0001-55', '(47) 9876-5432', 'contato@fornecedortop.com.br'),
  ('TechStore Nacional', '33.444.555/0001-66', '(49) 3210-9876', 'vendas@techstorenac.com.br'),
  ('Informática Avançada', '44.555.666/0001-77', '(84) 8765-4321', 'contato@informaticaavancada.com.br'),
  ('Distribuição Rápida', '55.666.777/0001-88', '(86) 2345-6789', 'vendas@distribrapida.com.br'),
  ('Componentes Premium', '66.777.888/0001-99', '(64) 9876-5432', 'suporte@comppremium.com.br'),
  ('Eletrônicos Direto', '77.888.999/0001-00', '(68) 3456-7890', 'vendas@eletdieto.com.br'),
  ('Hardware Brasil', '88.999.000/0001-11', '(69) 8765-4321', 'contato@hardwarebr.com.br'),
  ('Supri TI Completa', '99.000.111/0001-22', '(70) 2345-6789', 'comercial@supriticompleta.com.br'),
  ('Distribuidor Oficial', '00.111.222/0001-33', '(71) 9876-5432', 'vendas@distoficial.com.br')
ON CONFLICT (cnpj) DO NOTHING;

-- ============================================================================
-- PRODUTOS (60+ produtos variados)
-- ============================================================================

INSERT INTO produtos (nome, descricao, preco, quantidade_estoque, categoria_id) VALUES
  -- Notebooks
  ('Notebook Dell Inspiron 15', 'Dell Inspiron 15, Intel i7 12ª Gen, 16GB RAM, 512GB SSD', 3499.90, 45, 2),
  ('Notebook Lenovo IdeaPad', 'Lenovo IdeaPad 3, AMD Ryzen 5, 8GB RAM, 256GB SSD', 2299.90, 38, 2),
  ('Notebook HP Pavilion', 'HP Pavilion 15, Intel i5, 8GB RAM, 256GB SSD', 2499.90, 52, 2),
  ('Notebook ASUS VivoBook', 'ASUS VivoBook 15, Intel i7, 16GB RAM, 512GB SSD', 3199.90, 29, 2),
  ('Notebook Samsung Book', 'Samsung Book Intel, i5 11ª Gen, 8GB RAM, 256GB SSD', 2199.90, 41, 2),

  -- Mouses e Teclados
  ('Mouse Logitech MX Master 3', 'Mouse Logitech MX Master 3S, Wireless, Bluetooth', 399.90, 87, 3),
  ('Teclado Mecânico Gamer RGB', 'Teclado mecânico com switch Blue, RGB, USB', 249.90, 120, 3),
  ('Mouse Pad Grande XL', 'Mouse pad 80x30cm, borracha natural, antiderrapante', 89.90, 156, 3),
  ('Mouse Logitech G Pro', 'Mouse gaming Logitech com 8 botões programáveis', 189.90, 93, 14),
  ('Teclado sem fio 2.4GHz', 'Teclado sem fio alcance 10 metros, bateria AA', 129.90, 210, 3),

  -- Monitores
  ('Monitor Samsung 24" Full HD', 'Monitor Samsung S24R350, 24" FHD, 75Hz, HDMI', 699.90, 33, 8),
  ('Monitor LG 27" 4K', 'Monitor LG 27UP550, 27" 4K UHD, 60Hz, DisplayPort', 1899.90, 17, 8),
  ('Monitor ASUS 144Hz Gaming', 'ASUS VP28U, 28", 4K, 144Hz, DisplayPort, HDMI', 2199.90, 11, 8),
  ('Monitor Positivo 21.5" HD', 'Monitor Positivo 21.5", HD, 60Hz, VGA/HDMI', 599.90, 48, 8),

  -- SSDs e Armazenamento
  ('SSD Samsung 870 EVO 1TB', 'SSD SATA 2.5" 1TB, velocidade até 560MB/s', 379.90, 76, 6),
  ('SSD Kingston NV1 500GB', 'SSD NVMe 500GB, velocidade até 2100MB/s', 249.90, 102, 6),
  ('SSD WD Black 2TB', 'SSD NVMe 2TB, gaming, velocidade até 3600MB/s', 899.90, 24, 6),
  ('HD Externo 2TB WD', 'HD externo 2TB USB 3.0, portátil, 16MB cache', 399.90, 58, 6),
  ('Pendrive SanDisk 64GB', 'Pendrive 64GB USB 3.1, velocidade até 150MB/s', 59.90, 245, 6),

  -- Cabos e Conectores
  ('Cabo HDMI 2.1 3 metros', 'Cabo HDMI 2.1, 3 metros, 8K, 60Hz', 79.90, 180, 12),
  ('Cabo USB-C 1 metro', 'Cabo USB-C carregamento rápido 65W, 1 metro', 49.90, 220, 12),
  ('Cabo VGA 5 metros', 'Cabo VGA macho-macho 5 metros, RGB blindado', 39.90, 145, 12),
  ('Adaptador HDMI para VGA', 'Adaptador HDMI macho para VGA fêmea', 69.90, 95, 11),
  ('Hub USB 7 Portas', 'Hub USB 3.0 com 7 portas, fonte externa', 129.90, 61, 11),

  -- Impressoras
  ('Impressora HP DeskJet', 'Impressora jato tinta colorida A4, 8ppm', 449.90, 29, 5),
  ('Impressora Epson EcoTank', 'Impressora multifuncional EcoTank L14150', 1699.90, 8, 5),
  ('Impressora Laser Samsung', 'Impressora laser monocromática 35ppm', 1299.90, 12, 5),

  -- Redes
  ('Router WiFi 6 ASUS', 'Router ASUS AX1800, WiFi 6, mesh, 3 antenas', 599.90, 37, 4),
  ('Switch TP-Link 24 Portas', 'Switch gerenciável 24 portas Gigabit TP-Link', 499.90, 15, 4),
  ('Cabo Rede Cat6 30m', 'Cabo rede UTP Cat6 30 metros, azul', 89.90, 128, 4),

  -- Tablets e Celulares
  ('iPad Air 10.9" 64GB', 'iPad Air 10.9" WiFi, A15 Bionic, 64GB rosa', 3799.90, 6, 9),
  ('Samsung Galaxy Tab', 'Galaxy Tab S7+ 12.4", AMOLED, 128GB', 2999.90, 8, 9),
  ('iPhone 14 128GB', 'iPhone 14 128GB azul, A15 Bionic', 4299.90, 4, 10),
  ('Samsung Galaxy S23', 'Galaxy S23 256GB preto, Snapdragon 8 Gen 2', 3899.90, 5, 10),
  ('Motorola Moto G53', 'Moto G53 128GB branco, Snapdragon 480+', 999.90, 34, 10),

  -- Fones e Áudio
  ('Fone Sony WH-1000XM4', 'Fone over-ear com cancelamento ruído, 30h bateria', 1899.90, 18, 3),
  ('Fone AirPods Pro', 'Fones in-ear Apple AirPods Pro com cancelamento', 1799.90, 25, 3),
  ('Fone Logitech G Pro X', 'Headset gaming com microfone, som 7.1', 599.90, 42, 14),
  ('Caixa Bluetooth JBL', 'Caixa JBL Flip 6 portátil 12h bateria', 649.90, 31, 3),

  -- Webcams
  ('Webcam Logitech C920', 'Webcam Full HD 1080p 30fps USB', 249.90, 67, 3),
  ('Webcam 4K Razer', 'Webcam Razer Kiyo Pro 4K 30fps autofoco', 899.90, 9, 3),

  -- Ventiladores e Coolers
  ('Cooler Processador Corsair', 'Cooler CPU líquido 240mm RGB, Intel/AMD', 399.90, 44, 7),
  ('Ventilador 120mm RGB', 'Ventilador 120mm com LED RGB controlável', 89.90, 156, 7),
  ('Fonte 650W 80 Plus', 'Fonte ATX 650W 80 Plus Bronze semi-modular', 349.90, 37, 7),
  ('Gabinete ATX Full Tower', 'Gabinete ATX vidro temperado 4 ventiladores', 599.90, 19, 7),

  -- Softwares
  ('Microsoft Office 365', 'Office 365 1 ano, Word, Excel, PowerPoint, Teams', 299.90, 85, 13),
  ('Windows 11 Pro', 'Windows 11 Professional chave ativação original', 1099.90, 12, 13),
  ('Antivírus Norton 360', 'Norton 360 Deluxe 1 ano até 5 dispositivos', 129.90, 110, 13),

  -- Diversos
  ('Estabilizador 1200VA', 'Estabilizador 1200VA 4 tomadas regulação automática', 159.90, 54, 1),
  ('Nobreak 1440VA', 'Nobreak 1440VA com 1 bateria interna 60min', 699.90, 8, 1),
  ('Clip para Suporte Notebook', 'Suporte ajustável para notebook/tablet', 79.90, 203, 1),
  ('Suporte Ergonômico para Monitor', 'Braço articulável VESA para monitor até 27"', 249.90, 42, 1),
  ('Kit Limpeza de PC', 'Kit com ar comprimido, pano, pincéis e álcool', 49.90, 178, 1),
  ('Espuma de proteção para Cables', 'Espuma proteção 20 metros rolos variados', 39.90, 112, 1),
  ('Etiquetas Identificação Porta', 'Pack 100 etiquetas personalizáveis preto/branco', 19.90, 256, 1),
  ('Pasta com fechadura para Documentos', 'Pasta segurança com código de acesso tamanho A4', 89.90, 67, 1)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- RELAÇÃO PRODUTOS-FORNECEDORES (Tabela Pivô N:N)
-- ============================================================================
-- Cada produto tem 1-5 fornecedores diferentes
-- Total esperado: 150+ relacionamentos

INSERT INTO produto_fornecedor (produto_id, fornecedor_id)
SELECT 
  p.id,
  f.id
FROM (
  -- Distribuição pseudo-aleatória usando modulo
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn FROM produtos
) p
CROSS JOIN (
  SELECT id FROM fornecedores ORDER BY id
) f
WHERE (p.rn * f.id) % 12 < 5  -- Gera relacionamentos variados
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DADOS FINAIS - Verificação de Inserção
-- ============================================================================
-- Execute estas queries para verificar quantos registros foram inseridos:

-- SELECT 'Usuários' as tabela, COUNT(*) as total FROM usuarios
-- UNION ALL
-- SELECT 'Categorias', COUNT(*) FROM categorias
-- UNION ALL
-- SELECT 'Fornecedores', COUNT(*) FROM fornecedores
-- UNION ALL
-- SELECT 'Produtos', COUNT(*) FROM produtos
-- UNION ALL
-- SELECT 'Relacionamentos', COUNT(*) FROM produto_fornecedor;
