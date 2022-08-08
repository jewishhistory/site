const dotenv = require('dotenv');
const path = require('path');
const { fetchContent } = require('./helpers');

dotenv.config();

const repository = process.env.CONTENT_REPOSITORY;
const folder = process.env.CONTENT_FOLDER;

fetchContent({ repository, folder });
