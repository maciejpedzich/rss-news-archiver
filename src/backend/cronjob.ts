import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import { CronJob } from 'cron';
import { getRepository } from 'typeorm';
import { config as loadENV } from 'dotenv';
import Parser from 'rss-parser';

import Article from './models/article';

loadENV();

async function onTick() {
  const MIME_TYPE_MAP: { [mime: string]: string } = {
    'image/jpeg': '.jpg',
    'image/png': '.png'
  };

  const articleRepository = getRepository(Article);
  const rssParser = new Parser();

  const feed = await rssParser.parseURL(
    process.env.FEED_URL as string
  );
  const items = feed.items as Parser.Item[];

  for (const item of items) {
    const {
      title,
      link,
      guid,
      pubDate,
      contentSnippet,
      enclosure
    } = item;
    const articleArchived = await articleRepository
      .findOne({ title });

    if (!articleArchived) {
      const { url, type } = enclosure as Parser.Enclosure;
      const article = articleRepository.create({
        title,
        link,
        guid,
        datePublished: pubDate,
        description: contentSnippet?.replace('Keep reading', '')
      });

      const imageBuffer = await (await fetch(url)).buffer();
      const extension = MIME_TYPE_MAP[type as string];
      const filename = `${article.guid}${extension}`;

      await fs.writeFile(
        `${__dirname}/public/images/${filename}`,
        imageBuffer
      );
      article.imageLink = `${process.env.API_URL}/images/${filename}`;

      await articleRepository.save(article);
    }
  }
};

const archiveJob = new CronJob('0 * * * *', onTick);

export default archiveJob;
