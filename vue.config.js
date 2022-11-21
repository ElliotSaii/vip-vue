const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,

  devServer: {
    open: false,
    https: false,
    hot: true,
    proxy: {
      '/admin/api': {
        // target: 'http://localhost:9090',
        target: 'http://154.39.248.73:9090',
        changeOrigin: true,
        ws: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },

  pluginOptions: {
    i18n: {
      locale:  'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableLegacy: false,
      runtimeOnly: false,
      compositionOnly: false,
      fullInstall: true
    }
  }
})
