const path = require('path');
const spawn = require('cross-spawn');
const clc = require('cli-color');

const LOGGER_COLORS = {
  info: clc.cyanBright.bold,
  error: clc.redBright.bold,
  warn: clc.yellowBright.bold,
};

const logger = require('console-log-level')({
  prefix(level) {
    const date = new Date();
    return LOGGER_COLORS[level](
      `[${level.toUpperCase()}][${date.toISOString()}]`
    );
  },
});

module.exports.fetchContent = ({ repository, folder }) => {
  const contentPath = path.resolve(process.cwd(), folder);

  try {
    spawn.sync('cd', [folder], { cwd: process.cwd() });
    spawn.sync('git', ['init'], { cwd: contentPath });
    spawn.sync('git', ['remote', 'add', 'origin', repository], {
      cwd: contentPath,
    });
    spawn.sync('git', ['pull', 'origin', 'master'], {
      cwd: contentPath,
    });
    spawn.sync('rm', ['-rf', '.git'], {
      cwd: contentPath,
    });
  } catch (e) {
    throw new Error('The content are not fetched');
  }
};

module.exports.getLogger = () => {
  return {
    clear: () => process.stdout.write(clc.reset),
    info: (msg) => logger.info(LOGGER_COLORS.info(msg)),
    error: (msg) => logger.error(LOGGER_COLORS.error(msg)),
    warn: (msg) => logger.warn(LOGGER_COLORS.warn(msg)),
  };
};
