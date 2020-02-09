import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as morgan from 'morgan';

import express from './config/express';
import application from './constants/application';

import * as errorHandler from './middlewares/apiErrorHandler';
import joiErrorHandler from './middlewares/joiErrorHandler';
import logger from './config/logger';
import authenticate from './middlewares/authenticate';

import indexRoute from './routes/index';

const PORT = process.env.PORT || 8000;

createConnection({
  type: "mysql",
  host: "172.230.0.1",
  port: 3306,
  username: "root",
  password: "root",
  database: "lrbsl_database"
}).then(() => {
  logger.info('database connection created');
  express.use(morgan('dev'));
  express.use(authenticate);

  // Router
  express.use(application.url.base, indexRoute);

  // Joi Error Handler
  express.use(joiErrorHandler);
  // Error Handler
  express.use(errorHandler.notFoundErrorHandler);

  express.use(errorHandler.errorHandler);

  express.listen(PORT, () => {
    logger.info(`Server running at ${PORT}`);
  });
}).catch((error) => {
  logger.info(`Database connection failed with error ${error}`);
});

export default express;