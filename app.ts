import express, { Application, NextFunction, Response, Request } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import apiRoutes from './api/index';
import webRoutes from './web/routes/index';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { db } from './configs/database';
import { whatsapp, whatsappRocket } from './configs/venombot';
import fs from 'fs/promises';
const YAML = require('yamljs');


const swaggerDocument = YAML.load('./configs/openapi.yaml');
// const swagger = require('./configs/openapi.yaml');
// import swaggerSpec from './configs/swaggerDef';


dotenv.config();

const PORT = process.env.SERVER_PORT;
const SESSION_NAME = process.env?.SESSION_NAME;


//GLOBAIS

const intialize = async () => {
  try {
    await fs.unlink("./tokens/" + SESSION_NAME + "/SingletonLock")
  } catch (error) {

  }


  global.$db = db;
  global.$whatsapp = await whatsappRocket();
  global.$chatRoom = {};

  const app: Application = express();

  // Configurações do aplicativo
  app.set('views', path.join(__dirname, 'web/views'));
  app.set('view engine', 'ejs');

  // Middleware
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Rotas da API
  app.use('/api', apiRoutes);
  // Middleware para servir arquivos estáticos
  app.use(express.static(path.join(__dirname, 'public')));
  // Rotas da aplicação web
  app.use('/', webRoutes);

  // Configura uma rota para download do arquivo JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=swagger.json');
    res.send(swaggerDocument);
  });



  // Tratamento de erro
  // Middleware para tratar erros
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  // Inicializa o servidor
  const server = app.listen('0.0.0.0:' + PORT ? PORT : 3000, () => {
    //@ts-ignore
    console.log(`Servidor iniciado na porta ${server.address()?.port}`);
  });

}
intialize();


