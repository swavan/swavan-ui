module.exports = {
  pages: {
    popup: {
      template: 'public/browser-extension.html',
      entry: './src/popup/main.js',
      title: 'SwaVan'
    },
    content_script: {
      template: 'public/browser-extension.html',
      entry: './src/content/index.js',
      title: 'SwaVan'
    }
  },
  pluginOptions: {
    browserExtension: {
      componentOptions: {
        background: {
          entry: 'src/background.js'
        }
      }
    }
  }
}
