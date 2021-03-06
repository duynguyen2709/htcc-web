import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],

    link: [ {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}, {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'} ],
  


  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/index.scss',
    //'~/assets/vuetify.min.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    // '~/plugins/vuetify',
    '~/plugins/acl.js'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
   // '@nuxtjs/vuetify',
   // Simple usage
   '@nuxtjs/vuetify',

   // With options
   ['@nuxtjs/vuetify', { treeShake: false }]
  ],
  /*
  ** Nuxt.js modules
  */
 modules: [
  // Doc: https://axios.nuxtjs.org/usage
  '@nuxtjs/axios',
  '@nuxtjs/auth'
],
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss', /*'~/assets/vuetify.min.css'*/],
    theme: {
      themes: {
        light: {
          primary: '#4caf50',
          secondary: '#4caf50',
          tertiary: '#495057',
          accent: '#82B1FF',
          error: '#f55a4e',
          info: '#00d3ee',
          success: '#5cb860',
          warning: '#ffa21a'
        },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  axios: {
    baseURL: 'https://naduy.info/',
    //baseURL: 'http://167.179.80.90:8761/'
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/api/gateway/public/login',
            method: 'post',
            propertyName: 'data.data.token'
          },
          user: {
            url: '/api/admin/me',
            method: 'get',
            propertyName: 'data'
          },
          //user: true,
          logout: { 
            url: '/api/gateway/private/logout/3',
            method: 'post',
          }
        },
        tokenRequired: true
      }
    },
    redirect: {
      login: '/login',
      logout: '/login',
      callback: '/login',
      home: '/'
    }
  },
  router: {
    middleware: ['auth']
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
