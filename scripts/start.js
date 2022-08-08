const Eleventy = require('@11ty/eleventy');
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { fetchContent } = require('./helpers');

dotenv.config();

const repository = process.env.CONTENT_REPOSITORY;
const folder = process.env.CONTENT_FOLDER;

(async function () {
  // Получаем контент из удаленного репозитория
  fetchContent({ repository, folder });

  // Генерируем статику
  const elev = new Eleventy(folder);
  await elev.write();

  // Запускаем сервер для разработки
  const app = express();
  app.use('/', express.static(path.resolve(__dirname, '../_site')));
  app.listen(3000);
})();
