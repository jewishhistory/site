const Image = require('@11ty/eleventy-img');
const { format } = require('date-fns');
const ruLocale = require('date-fns/locale/ru');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const htmlmin = require('html-minifier');
const path = require('path');

module.exports = (config) => {
  config.setDataDeepMerge(true);

  config.setLiquidOptions({
    strictFilters: false,
  });

  const markdownItOptions = {
    html: true,
  };

  const markdownLib = markdownIt(markdownItOptions).use(
    markdownItAnchor,
    {
      permalink: markdownItAnchor.permalink.headerLink()
    }
  );

  config.setLibrary('md', markdownLib);

  config.addTransform("htmlmin", function(content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if( outputPath && outputPath.endsWith(".html") ) {
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
    }

    return content;
  });


  return {
    dir: {
      input: 'content',
      includes: '../src/_includes',
      layouts: '../src/layouts',
      markdownTemplateEngine: 'liquid'
    }
  };
};
