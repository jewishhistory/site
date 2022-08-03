const spawn = require('cross-spawn');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const repository = process.env.CONTENT_REPOSITORY;

try {
  spawn.sync('cd', ['content'], { cwd: process.cwd() });
  spawn.sync('git', ['init'], { cwd: path.resolve(process.cwd(), 'content') });
  spawn.sync('git', ['remote', 'add', 'origin', repository], {
    cwd: path.resolve(process.cwd(), 'content'),
  });
  spawn.sync('git', ['pull', 'origin', 'master'], {
    cwd: path.resolve(process.cwd(), 'content'),
  });
  spawn.sync('rm', ['-rf', '.git'], {
    cwd: path.resolve(process.cwd(), 'content'),
  });
} catch (e) {
  throw new Error('The content are not fetched');
}
