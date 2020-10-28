import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { config as loadENV } from 'dotenv';

import ArticlesController from './controllers/articles';
import errorMiddleware from './middleware/error';

import Article from './models/article';
import archiveJob from './cronjob';

loadENV();

const isDevelopmentEnv = process.env.NODE_ENV === 'development';
const app = express();

(async () => {
  try {
    await createConnection({
      type: 'postgres',
      url: process.env.DB_URL as string,
      entities: [Article],
      synchronize: isDevelopmentEnv,
      logging: isDevelopmentEnv,
    });

    app.use(cors());
    app.use(express.static(`${__dirname}/public`));
    app.use(express.json());

    app.use('/articles', new ArticlesController().router);

    app.use(errorMiddleware);

    app.listen(process.env.PORT, () => archiveJob.start());
  } catch (error) {
    console.error(error);
  }
})();
