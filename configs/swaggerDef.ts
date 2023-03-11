import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API WA-AUTOVENOM',
    version: '1.0.0',
    description: 'API de utilização da automatização de whatsapp.',
  },
};

const options = {
  swaggerDefinition,
  apis: ['./api/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
