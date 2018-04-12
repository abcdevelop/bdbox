const pkg = require('./package')

const nodeExternals = require('webpack-node-externals')

module.exports = {
  //mode: 'universal',
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },

  /*
  ** Global CSS
  */
  css: [
    'vuetify/src/stylus/main.styl',
    'font-awesome/css/font-awesome.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src:'@/plugins/vuetify', ssr: true },
    { src: '@/plugins/vue-jstree', ssr: false },
    { src: '~/plugins/nuxt-client-init.js', ssr: false },
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/font-awesome'
  ],

  /*
  ** Axios module configuration
  */
  axios: {
    baseURL: 'https://infos-tools.firebaseio.com'
    // See https://github.com/nuxt-community/axios-module#options
    //baseURL: process.env.BASE_URL || 'https://infos-tools.firebaseio.com',
    //instance.defaults.headers.get['Accepts'] : 'application/json'
  },

  /*
  ** Build configuration
  */
  build: {
    vendor: ['vue-jstree'],
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      if (ctx.isServer) {
        config.externals = [
          nodeExternals({
            whitelist: [/^vuetify/]
          })
        ]
      }
    }
  },
  env: {
    //   baseURL: process.env.BASE_URL || 'https://mynuxtblog.firebaseio.com',
    //   fbAPIKey: '',
    //   HOST:'0.0.0.0',
    //   NODE_ENV:'production',
    //   NPM_CONFIG_PRODUCTION:false
  }
}
