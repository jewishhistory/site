const Eleventy = require('@11ty/eleventy');
const dotenv = require('dotenv');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config');
const { fetchContent, getLogger } = require('./helpers');

const logger = getLogger();

dotenv.config();

const repository = process.env.CONTENT_REPOSITORY;
const folder = process.env.CONTENT_FOLDER;
const webpackCompiler = webpack({ mode: 'production', ...webpackConfig });

(async function () {
  logger.clear();
  logger.info('Build project');

  // Получаем контент из удаленного репозитория
  fetchContent({ repository, folder });
  logger.info('The content is fetched');

  // Собираем assets
  webpackCompiler.run(
    (err, stats) => {
      if (err) {
        logger.error(err.details);
        return;
      }

      const info = stats.toString();

      if (stats.hasErrors()) {
        logger.error(info);
      }

      if (stats.hasWarnings()) {
        logger.warn(info);
      }

      if (!stats.hasErrors() && !stats.hasWarnings()) {
        logger.info('The assets have been built');
        webpackCompiler.close((closeErr) => {
          if (closeErr) {
            logger.error(closeErr);
          }
        });
      }
    },
  );

  // Генерируем статику
  const elev = new Eleventy(folder, '_site', { quiet: true });
  await elev.write();
  logger.info('The site is assembled');
})();
