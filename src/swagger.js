import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { version } from '../package.json'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version,
    },
    servers: [
      {
        url: import.meta.env.VITE_SERVER_URL + '/api',
      },
    ],
  },
  apis: ['./src/docs/*.yaml'],
}

const swaggerSpec = swaggerJsdoc(options)

export const setupSwaggerDocs = (app) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
