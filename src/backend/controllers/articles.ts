import {
  Request,
  Response,
  NextFunction,
  Router,
} from 'express';
import { getRepository, Between } from 'typeorm';

import Article from '../models/article';

export default class ArticlesController {
  router = Router();

  constructor() {
    this.router.get('/', this.getArticles);
    this.router.get('/count', this.getArticleCount);
  }

  private async getArticles(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const articleRepository = getRepository(Article);

    try {
      const datePublished = new Date(
        req.query.date
        ? req.query.date as string
        : new Date()
      ).toISOString();

      const articles = await articleRepository
        .createQueryBuilder('article')
        .where(
          'DATE(article.datePublished) = :datePublished',
          { datePublished }
        )
        .getMany();

      return res
        .status(200)
        .json(articles);
    } catch (error) {
      return next(error);
    }
  }

  private async getArticleCount(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const articleRepository = getRepository(Article);

    try {
      const today = new Date();
      const thisYear = today.getFullYear();
      const thisMonth = today.getMonth() + 1;

      const start = new Date(
        req.query.start
        ? req.query.start as string
        : `${thisYear}-${thisMonth}-01`
      );

      const end = req.query.start
        ? (
          req.query.end
          ? new Date(req.query.end as string)
          : new Date(
            start.getFullYear(),
            start.getMonth() + 1,
            0,
          )
        )
        : new Date(thisYear, thisMonth, 0);

      const articles = (
        await articleRepository.find({ datePublished: Between(start, end) })
      ).reduce(
        (obj: { [key: string]: number }, article) => {
          const datePublished = article.datePublished
            .toISOString()
            .substr(0, 10);

          obj[datePublished]
            ? obj[datePublished]++
            : obj[datePublished] = 1;

          return obj;
        },
        {},
      );

      return res
        .status(200)
        .json(articles);
    } catch (error) {
      return next(error);
    }
  }
}
