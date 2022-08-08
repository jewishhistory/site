const path = require('path');
const spawn = require('cross-spawn');

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
