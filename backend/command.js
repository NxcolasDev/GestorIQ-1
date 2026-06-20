#!/usr/bin/env node

/**
 * GestorIQ CLI Commands
 * 
 * Entrypoint para comandos administrativos da aplicação.
 * Conforme requisitos dos PDFs: entrypoint CLI para Node.js
 * 
 * Uso:
 *   node command.js migrate          - Executar migrations
 *   node command.js seed             - Popular banco com dados de teste
 *   node command.js seed-admin       - Criar apenas usuário admin
 */

require('dotenv').config();
const { pool, query, initializeDatabase } = require('./src/config/database');
const fs = require('fs');
const path = require('path');

const COMMAND = process.argv[2];

const commands = {
  /**
   * Migrate - Executar migrations (create tables + seed admin)
   * Requer: DB_SYNC=true no .env
   */
  migrate: async () => {
    console.log('🔄 Executando migrations...');
    try {
      await initializeDatabase();
      console.log('✅ Migrations concluídas com sucesso!');
      process.exit(0);
    } catch (error) {
      console.error('❌ Erro ao executar migrations:', error.message);
      process.exit(1);
    }
  },

  /**
   * Seed - Popular banco com dados de teste (100+ registros)
   * Executa migrations primeiro, depois insere dados fictícios
   */
  seed: async () => {
    console.log('🌱 Populando banco com dados de teste...');
    try {
      // Executar migrations
      await initializeDatabase();
      console.log('✓ Tabelas criadas');

      // Ler e executar seed.sql
      const seedPath = path.join(__dirname, 'data', 'seed.sql');
      if (!fs.existsSync(seedPath)) {
        console.warn('⚠️ Arquivo data/seed.sql não encontrado');
        console.log('✅ Apenas migrations foram executadas');
        process.exit(0);
      }

      const seedSql = fs.readFileSync(seedPath, 'utf-8');
      
      // Executar cada statement do seed
      const statements = seedSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('--'));

      for (const statement of statements) {
        await pool.query(statement);
      }

      // Contar registros
      const stats = await Promise.all([
        pool.query('SELECT COUNT(*) as count FROM usuarios'),
        pool.query('SELECT COUNT(*) as count FROM categorias'),
        pool.query('SELECT COUNT(*) as count FROM fornecedores'),
        pool.query('SELECT COUNT(*) as count FROM produtos'),
        pool.query('SELECT COUNT(*) as count FROM produto_fornecedor'),
      ]);

      console.log('✓ Dados inseridos com sucesso');
      console.log(`  - Usuários: ${stats[0].rows[0].count}`);
      console.log(`  - Categorias: ${stats[1].rows[0].count}`);
      console.log(`  - Fornecedores: ${stats[2].rows[0].count}`);
      console.log(`  - Produtos: ${stats[3].rows[0].count}`);
      console.log(`  - Relacionamentos: ${stats[4].rows[0].count}`);
      
      console.log('✅ Seed concluído com sucesso!');
      process.exit(0);
    } catch (error) {
      console.error('❌ Erro ao executar seed:', error.message);
      process.exit(1);
    }
  },

  /**
   * Seed Admin - Apenas criar usuário administrador
   * Conforme .env: ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD
   */
  'seed-admin': async () => {
    console.log('👤 Criando usuário administrador...');
    try {
      await initializeDatabase();
      console.log('✅ Usuário admin criado com sucesso!');
      process.exit(0);
    } catch (error) {
      console.error('❌ Erro ao criar admin:', error.message);
      process.exit(1);
    }
  },

  /**
   * Health Check - Verificar conexão com banco
   */
  health: async () => {
    try {
      const result = await pool.query('SELECT NOW() as time');
      console.log('✅ Banco de dados OK');
      console.log(`   Timestamp: ${result.rows[0].time}`);
      process.exit(0);
    } catch (error) {
      console.error('❌ Erro ao conectar ao banco:', error.message);
      process.exit(1);
    }
  },

  /**
   * Help - Mostrar comandos disponíveis
   */
  help: () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║         GestorIQ - CLI Commands                        ║
╚════════════════════════════════════════════════════════╝

Comandos disponíveis:

  node command.js migrate         - Executar migrations e criar tabelas
  node command.js seed            - Migrations + popular com 100+ registros
  node command.js seed-admin      - Apenas criar usuário admin
  node command.js health          - Verificar conexão com banco
  node command.js help            - Mostrar esta mensagem

Configuração:

  Variáveis necessárias em .env:
    - DB_HOST         (padrão: localhost)
    - DB_PORT         (padrão: 5432)
    - DB_NAME         (padrão: gestoriq)
    - DB_USER         (padrão: postgres)
    - DB_PASSWORD     (padrão: postgres)
    - DB_SYNC         (true = criar tabelas automaticamente)
    - ADMIN_NAME      (padrão: Administrador)
    - ADMIN_EMAIL     (padrão: admin@gestoriq.com)
    - ADMIN_PASSWORD  (padrão: senha123)

Exemplos:

  1. Primeira execução (setup):
     $ node command.js migrate

  2. Inserir dados de teste:
     $ node command.js seed

  3. Verificar saúde do banco:
     $ node command.js health

Notas:

  - Todos os comandos requerem DB_SYNC=true no .env
  - Comandos de seed pressupõem tabelas já criadas
  - Use seed.sql para customizar dados de teste
    `);
    process.exit(0);
  },
};

// Executor
const executor = commands[COMMAND] || commands.help;

if (typeof executor === 'function') {
  executor().catch(error => {
    console.error('Erro não tratado:', error);
    process.exit(1);
  });
} else {
  commands.help();
}
