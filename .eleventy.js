const fs = require('fs')
const moment = require('moment')
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const markdownIt = require('markdown-it')
const markdownItLinkAttr = require('markdown-it-link-attributes')

module.exports = function(eleventyConfig) {
  /**
   * Opts in to a full deep merge when combining the Data Cascade.
   *
   * @link https://www.11ty.dev/docs/data-deep-merge/#data-deep-merge
   */
  eleventyConfig.setDataDeepMerge(true)

  /**
   * Add custom watch targets
   *
   * @link https://www.11ty.dev/docs/config/#add-your-own-watch-targets
   */
  eleventyConfig.addWatchTarget('./src/assets/')

  /**
   * Passthrough file copy
   *
   * @link https://www.11ty.io/docs/copy/
   */
  eleventyConfig.addPassthroughCopy('./src/site/favicon.ico')

  /**
   * Add filters
   *
   * @link https://www.11ty.io/docs/filters/
   */
  eleventyConfig.addFilter('dateReadable', date => {
    return moment(date).format('LL')
  })

  eleventyConfig.addFilter('limit', function(array, limit) {
    if (!limit) {
      return array
    }
    return array.slice(0, limit)
  })

  /**
   * Add shortcodes
   *
   * @link https://www.11ty.io/docs/shortcodes/
   */
  eleventyConfig.addShortcode('excerpt', article => {
    if (!article.hasOwnProperty('templateContent')) {
      console.warn(
        'Failed to extract excerpt: Document has no property "templateContent".'
      )
      return null
    }

    let excerpt = null
    const content = article.templateContent

    // The start and end separators to try and match to extract the excerpt
    const separatorsList = [
      { start: '<!-- Excerpt Start -->', end: '<!-- Excerpt End -->' },
      { start: '<p>', end: '</p>' },
    ]

    separatorsList.some(separators => {
      const startPosition = content.indexOf(separators.start)
      const endPosition = content.indexOf(separators.end)

      if (startPosition !== -1 && endPosition !== -1) {
        excerpt = content
          .substring(startPosition + separators.start.length, endPosition)
          .trim()
        return true // Exit out of array loop on first match
      }
    })

    return excerpt
  })
  /**
   * Add Transforms
   *
   * @link https://www.11ty.io/docs/config/#transforms
   */
  if (process.env.ELEVENTY_ENV === 'production') {
    eleventyConfig.addTransform('htmlmin', require('./src/utils/htmlmin.js'))
  }

  /**
   * Override BrowserSync Server options
   *
   * @link https://www.11ty.dev/docs/config/#override-browsersync-server-options
   */
  eleventyConfig.setBrowserSyncConfig({
    notify: true,
    snippetOptions: {
      rule: {
        match: /<\/head>/i,
        fn: function(snippet, match) {
          return snippet + match
        },
      },
    },
    // Set local server 404 fallback
    callbacks: {
      ready: function(err, browserSync) {
        const content_404 = fs.readFileSync('dist/404/index.html')

        browserSync.addMiddleware('*', (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404)
          res.end()
        })
      },
    },
  })

  /**
   * Set markdown libraries
   *
   * @link https://www.11ty.dev/docs/languages/markdown/#optional-set-your-own-library-instance
   */
  eleventyConfig.setLibrary(
    'md',
    markdownIt({ html: true }).use(markdownItLinkAttr, {
      // Make external links open in a new tab.
      pattern: /^https?:\/\//,
      attrs: {
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    })
  )

  /**
   * Add plugins
   *
   * @link https://www.11ty.dev/docs/plugins/
   */
  eleventyConfig.addPlugin(syntaxHighlight, {
    templateFormats: ['md'],
  })

  return {
    dir: {
      layouts: '_includes/layouts',
      input: 'src/site',
      output: 'dist',
    },
    passthroughFileCopy: true,
    templateFormats: ['njk', 'md'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  }
}
