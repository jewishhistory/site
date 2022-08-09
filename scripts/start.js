const Eleventy = require('@11ty/eleventy');
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { fetchContent, getLogger } = require('./helpers');

const logger = getLogger();

dotenv.config();

const repository = process.env.CONTENT_REPOSITORY;
const folder = process.env.CONTENT_FOLDER;

(async function () {
  logger.clear();
  logger.info('Start project');

  // Получаем контент из удаленного репозитория
  fetchContent({ repository, folder });
  logger.info('The content is fetched');

  // Генерируем статику
  const elev = new Eleventy(folder);
  await elev.write();
  logger.info('The site is assembled');

  // Запускаем сервер для разработки
  const app = express();
  app.use('/', express.static(path.resolve(__dirname, '../_site')));
  app.listen(3000, () =>
    logger.info('The server is available at http://localhost:3000')
  );
})();
