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
import { seedData1, seedData2, seedData, down } from './utils/seed.data';
import userService from './services/user.service';

const PORT = process.env.PORT || 8000;

createConnection({
  type: "mysql",
  host: "database",
  port: 3306,
  username: "root",
  password: "root",
  database: "lrbsl_database",
  charset: "utf8",
  synchronize: process.env.NODE_ENV !== 'production',
  entities: [
    '**/**.entity.ts'
  ],
  migrations: ["migration/*.ts"],
  cli: {
    migrationsDir: "migration"
  },
  connectTimeout: 30000,
  acquireTimeout: 30000,
  maxQueryExecutionTime: 5000
}).then(async (connection) => {
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

  // await userService.getUsersCount().then(async (count) => {
  //   if(count <= 0) {
  //     await seedData1();
  //   }
  //   await seedData2();
  // }).catch((err) => console.log(err));

  let queryRunner = connection.createQueryRunner();
  await queryRunner.connect().then((res) => {
    console.log("##########" + res)
  }).catch((err) => {console.log(err)});
  await down(queryRunner).then((res) => {
    console.log("@@@@@@@2" + res)
  }).catch((err) => {console.log(err)});

  express.listen(PORT, () => {
    logger.info(`Server running at ${PORT}`);
  });
}).catch((error) => {
  logger.info(`Database connection failed with error ${error}`);
});

export default express;