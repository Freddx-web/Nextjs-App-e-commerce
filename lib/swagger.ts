import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'E-Commerce API Documentation',
        version: '1.0.0',
        description: 'API documentation for Next.js E-Commerce application',
      },
      servers: [
        {
          url: '/api',
          description: 'API Server',
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
        schemas: {
          Product: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              description: { type: 'string' },
              price: { type: 'number', format: 'float' },
              categoryId: { type: 'string', format: 'uuid' },
              images: { type: 'array', items: { type: 'string' } },
              stock: { type: 'integer' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              category: { $ref: '#/components/schemas/Category' },
            },
          },
          Category: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              description: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
          Order: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              userId: { type: 'string', format: 'uuid' },
              total: { type: 'number', format: 'float' },
              status: { type: 'string', enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              orderItems: {
                type: 'array',
                items: { $ref: '#/components/schemas/OrderItem' },
              },
            },
          },
          OrderItem: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              orderId: { type: 'string', format: 'uuid' },
              productId: { type: 'string', format: 'uuid' },
              quantity: { type: 'integer' },
              price: { type: 'number', format: 'float' },
              product: { $ref: '#/components/schemas/Product' },
            },
          },
          User: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              email: { type: 'string', format: 'email' },
              role: { type: 'string', enum: ['USER', 'ADMIN'] },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
          Cart: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              userId: { type: 'string', format: 'uuid' },
              items: {
                type: 'array',
                items: { $ref: '#/components/schemas/CartItem' },
              },
            },
          },
          CartItem: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              cartId: { type: 'string', format: 'uuid' },
              productId: { type: 'string', format: 'uuid' },
              quantity: { type: 'integer' },
              product: { $ref: '#/components/schemas/Product' },
            },
          },
          Error: {
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
      security: [
        {
          BearerAuth: [],
        },
      ],
    },
  });
  return spec;
};
