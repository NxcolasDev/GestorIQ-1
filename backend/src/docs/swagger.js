const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'GestorIQ API',
    version: '1.0.0',
    description:
      'API REST para controle de estoque. Rotas de login/registro sao publicas; os CRUDs exigem autenticacao via Bearer JWT.',
  },
  servers: [
    {
      url: 'http://localhost/api',
      description: 'Servidor local via Nginx',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Informe o token JWT obtido em POST /login. Exemplo: Bearer eyJhbGci...',
      },
    },
    schemas: {
      LoginInput: {
        type: 'object',
        required: ['email', 'senha'],
        properties: {
          email: { type: 'string', format: 'email', example: 'admin@gestoriq.com' },
          senha: { type: 'string', example: 'senha123' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        },
      },
      UsuarioInput: {
        type: 'object',
        required: ['nome', 'email', 'senha'],
        properties: {
          nome:  { type: 'string', example: 'Ana Souza' },
          email: { type: 'string', format: 'email', example: 'ana@gestoriq.com' },
          senha: { type: 'string', example: 'senha123' },
        },
      },
      Usuario: {
        type: 'object',
        properties: {
          id:         { type: 'integer', example: 1 },
          nome:       { type: 'string',  example: 'Ana Souza' },
          email:      { type: 'string',  example: 'ana@gestoriq.com' },
          created_at: { type: 'string',  format: 'date-time' },
          updated_at: { type: 'string',  format: 'date-time' },
        },
      },
      CategoriaInput: {
        type: 'object',
        required: ['nome'],
        properties: {
          nome:      { type: 'string', example: 'Eletronicos' },
          descricao: { type: 'string', example: 'Produtos eletronicos em geral' },
        },
      },
      Categoria: {
        type: 'object',
        properties: {
          id:         { type: 'integer', example: 1 },
          nome:       { type: 'string',  example: 'Eletronicos' },
          descricao:  { type: 'string',  example: 'Produtos eletronicos em geral' },
          created_at: { type: 'string',  format: 'date-time' },
          updated_at: { type: 'string',  format: 'date-time' },
        },
      },
      FornecedorInput: {
        type: 'object',
        required: ['nome', 'cnpj'],
        properties: {
          nome:     { type: 'string', example: 'Tech Distribuidora Ltda' },
          cnpj:     { type: 'string', example: '12.345.678/0001-99' },
          telefone: { type: 'string', example: '(11) 99999-0000' },
          email:    { type: 'string', format: 'email', example: 'contato@tech.com.br' },
        },
      },
      Fornecedor: {
        type: 'object',
        properties: {
          id:         { type: 'integer', example: 1 },
          nome:       { type: 'string',  example: 'Tech Distribuidora Ltda' },
          cnpj:       { type: 'string',  example: '12.345.678/0001-99' },
          telefone:   { type: 'string',  example: '(11) 99999-0000' },
          email:      { type: 'string',  example: 'contato@tech.com.br' },
          created_at: { type: 'string',  format: 'date-time' },
          updated_at: { type: 'string',  format: 'date-time' },
        },
      },
      ProdutoInput: {
        type: 'object',
        required: ['nome', 'preco', 'quantidade_estoque', 'categoria_id'],
        properties: {
          nome:               { type: 'string',  example: 'Notebook Dell Inspiron' },
          descricao:          { type: 'string',  example: 'Notebook i7 16GB RAM' },
          preco:              { type: 'number',  format: 'float', example: 3499.90 },
          quantidade_estoque: { type: 'integer', example: 50 },
          categoria_id:       { type: 'integer', example: 1 },
        },
      },
      Produto: {
        type: 'object',
        properties: {
          id:                 { type: 'integer', example: 1 },
          nome:               { type: 'string',  example: 'Notebook Dell Inspiron' },
          descricao:          { type: 'string',  example: 'Notebook i7 16GB RAM' },
          preco:              { type: 'number',  example: 3499.90 },
          quantidade_estoque: { type: 'integer', example: 50 },
          categoria_id:       { type: 'integer', example: 1 },
          created_at:         { type: 'string',  format: 'date-time' },
          updated_at:         { type: 'string',  format: 'date-time' },
        },
      },
      Erro: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Recurso nao encontrado' },
        },
      },
    },
  },

  security: [{ bearerAuth: [] }],

  paths: {
    '/login': {
      post: {
        tags: ['Auth'],
        summary: 'Gerar token JWT',
        description: 'Autentica o usuario e retorna um token JWT valido por 24h.',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Token gerado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' },
              },
            },
          },
          401: { description: 'Credenciais invalidas' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Gerar token JWT',
        description: 'Alias de POST /login.',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Token gerado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' },
              },
            },
          },
          401: { description: 'Credenciais invalidas' },
        },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar usuario',
        description: 'Cria um usuario sem exigir token. Usado para bootstrap e testes.',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UsuarioInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Usuario registrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Usuario' },
              },
            },
          },
          400: { description: 'Dados invalidos' },
        },
      },
    },

    '/usuarios': {
      get: {
        tags: ['Usuarios'],
        summary: 'Listar usuarios',
        responses: {
          200: { description: 'Lista de usuarios', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Usuario' } } } } },
          401: { description: 'Token ausente ou invalido' },
        },
      },
      post: {
        tags: ['Usuarios'],
        summary: 'Criar usuario',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UsuarioInput' } } } },
        responses: {
          201: { description: 'Usuario criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Usuario' } } } },
          400: { description: 'Dados invalidos' },
          401: { description: 'Token ausente ou invalido' },
        },
      },
    },
    '/usuarios/{id}': {
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID do usuario' },
      ],
      get: {
        tags: ['Usuarios'],
        summary: 'Buscar usuario por ID',
        responses: {
          200: { description: 'Usuario encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Usuario' } } } },
          401: { description: 'Token ausente ou invalido' },
          404: { description: 'Usuario nao encontrado' },
        },
      },
      put: {
        tags: ['Usuarios'],
        summary: 'Atualizar usuario',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UsuarioInput' } } } },
        responses: {
          200: { description: 'Usuario atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Usuario' } } } },
          401: { description: 'Token ausente ou invalido' },
          404: { description: 'Usuario nao encontrado' },
        },
      },
      delete: {
        tags: ['Usuarios'],
        summary: 'Remover usuario',
        responses: {
          204: { description: 'Usuario removido com sucesso' },
          401: { description: 'Token ausente ou invalido' },
          404: { description: 'Usuario nao encontrado' },
        },
      },
    },

    '/categorias': {
      get: {
        tags: ['Categorias'],
        summary: 'Listar categorias',
        responses: {
          200: { description: 'Lista de categorias', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Categoria' } } } } },
          401: { description: 'Token ausente ou invalido' },
        },
      },
      post: {
        tags: ['Categorias'],
        summary: 'Criar categoria',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoriaInput' } } } },
        responses: {
          201: { description: 'Categoria criada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Categoria' } } } },
          400: { description: 'Dados invalidos' },
          401: { description: 'Token ausente ou invalido' },
        },
      },
    },
    '/categorias/{id}': {
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID da categoria' },
      ],
      get: {
        tags: ['Categorias'],
        summary: 'Buscar categoria por ID',
        responses: {
          200: { description: 'Categoria encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Categoria' } } } },
          401: { description: 'Token ausente ou invalido' },
          404: { description: 'Categoria nao encontrada' },
        },
      },
      put: {
        tags: ['Categorias'],
        summary: 'Atualizar categoria',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoriaInput' } } } },
        responses: {
          200: { description: 'Categoria atualizada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Categoria' } } } },
          401: { description: 'Token ausente ou invalido' },
          404: { description: 'Categoria nao encontrada' },
        },
      },
      delete: {
        tags: ['Categorias'],
        summary: 'Remover categoria',
        responses: {
          204: { description: 'Categoria removida com sucesso' },
          401: { description: 'Token ausente ou invalido' },
          404: { description: 'Categoria nao encontrada' },
        },
      },
    },

    '/fornecedores': {
      get: {
        tags: ['Fornecedores'],
        summary: 'Listar fornecedores',
        responses: {
          200: { description: 'Lista de fornecedores', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Fornecedor' } } } } },
          401: { description: 'Token ausente ou invalido' },
        },
      },
      post: {
        tags: ['Fornecedores'],
        summary: 'Criar fornecedor',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/FornecedorInput' } } } },
        responses: {
          201: { description: 'Fornecedor criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Fornecedor' } } } },
          400: { description: 'Dados invalidos' },
          401: { description: 'Token ausente ou invalido' },
        },
      },
    },
    '/fornecedores/{id}': {
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID do fornecedor' },
      ],
      get: {
        tags: ['Fornecedores'],
        summary: 'Buscar fornecedor por ID',
        responses: {
          200: { description: 'Fornecedor encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Fornecedor' } } } },
          401: { description: 'Token ausente ou invalido' },
          404: { description: 'Fornecedor nao encontrado' },
        },
      },
      put: {
        tags: ['Fornecedores'],
        summary: 'Atualizar fornecedor',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/FornecedorInput' } } } },
        responses: {
          200: { description: 'Fornecedor atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Fornecedor' } } } },
          401: { description: 'Token ausente ou invalido' },
          404: { description: 'Fornecedor nao encontrado' },
        },
      },
      delete: {
        tags: ['Fornecedores'],
        summary: 'Remover fornecedor',
        responses: {
          204: { description: 'Fornecedor removido com sucesso' },
          401: { description: 'Token ausente ou invalido' },
          404: { description: 'Fornecedor nao encontrado' },
        },
      },
    },

    '/produtos': {
      get: {
        tags: ['Produtos'],
        summary: 'Listar produtos',
        parameters: [
          { name: 'categoria_id', in: 'query', required: false, schema: { type: 'integer' }, description: 'Filtrar por categoria' },
        ],
        responses: {
          200: { description: 'Lista de produtos', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Produto' } } } } },
          401: { description: 'Token ausente ou invalido' },
        },
      },
      post: {
        tags: ['Produtos'],
        summary: 'Criar produto',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProdutoInput' } } } },
        responses: {
          201: { description: 'Produto criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Produto' } } } },
          400: { description: 'Dados invalidos' },
          401: { description: 'Token ausente ou invalido' },
        },
      },
    },
    '/produtos/{id}': {
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID do produto' },
      ],
      get: {
        tags: ['Produtos'],
        summary: 'Buscar produto por ID',
        responses: {
          200: { description: 'Produto encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Produto' } } } },
          401: { description: 'Token ausente ou invalido' },
          404: { description: 'Produto nao encontrado' },
        },
      },
      put: {
        tags: ['Produtos'],
        summary: 'Atualizar produto',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProdutoInput' } } } },
        responses: {
          200: { description: 'Produto atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Produto' } } } },
          401: { description: 'Token ausente ou invalido' },
          404: { description: 'Produto nao encontrado' },
        },
      },
      delete: {
        tags: ['Produtos'],
        summary: 'Remover produto',
        responses: {
          204: { description: 'Produto removido com sucesso' },
          401: { description: 'Token ausente ou invalido' },
          404: { description: 'Produto nao encontrado' },
        },
      },
    },

    '/produtos/{id}/fornecedores': {
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID do produto' },
      ],
      get: {
        tags: ['Produtos x Fornecedores'],
        summary: 'Listar fornecedores de um produto',
        description: 'Retorna todos os fornecedores associados ao produto via tabela pivo.',
        responses: {
          200: { description: 'Fornecedores do produto', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Fornecedor' } } } } },
          401: { description: 'Token ausente ou invalido' },
          404: { description: 'Produto nao encontrado' },
        },
      },
      post: {
        tags: ['Produtos x Fornecedores'],
        summary: 'Associar fornecedor a produto',
        description: 'Cria um registro na tabela pivo produto_fornecedor.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['fornecedor_id'],
                properties: {
                  fornecedor_id: { type: 'integer', example: 2 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Associacao criada com sucesso' },
          400: { description: 'Dados invalidos ou associacao ja existente' },
          401: { description: 'Token ausente ou invalido' },
        },
      },
    },
    '/produtos/{id}/fornecedores/{fornecedor_id}': {
      parameters: [
        { name: 'id',            in: 'path', required: true, schema: { type: 'integer' }, description: 'ID do produto' },
        { name: 'fornecedor_id', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID do fornecedor' },
      ],
      delete: {
        tags: ['Produtos x Fornecedores'],
        summary: 'Remover associacao produto-fornecedor',
        description: 'Remove o registro da tabela pivo produto_fornecedor.',
        responses: {
          204: { description: 'Associacao removida com sucesso' },
          401: { description: 'Token ausente ou invalido' },
          404: { description: 'Associacao nao encontrada' },
        },
      },
    },
  },
};

module.exports = swaggerDocument;
