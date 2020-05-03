const pkg = require('./package');


export default {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    htmlAttrs: {
      lang: 'en-US',
    },
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
    ],
    noscript: [{ innerHTML: 'Sorry, your browser does not support JavaScript!' }],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'} ,
     //{rel: "stylesheet", type: "text/css", href: "dist/css/bootstrap-grid.min.css" }
      // { rel: "stylesheet", type: "text/css", href: "https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" }
    
    ],
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#ffffff' },

  /*
  ** Global CSS
  */
  css: [
    { src: 'normalize.css' },
    '@/assets/bootstrap-grid.min'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/vue-carousel', mode: 'client' },
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    [ 'nuxt-fontawesome', {
      component: 'fa',
      imports: [
        {
          set: '@fortawesome/free-brands-svg-icons',
          icons: [
            'faApple',
            'faGooglePlay',
            'faFacebookF',
            'faTwitter',
            'faInstagram',
            'faGooglePlusG',
            'faBehance',
            'faDribbble',
          ],
        },
        {
          set: '@fortawesome/free-regular-svg-icons',
          icons: [
            'faHandPointUp',
          ],
        },
        {
          set: '@fortawesome/free-solid-svg-icons',
          icons: [
            'faSync',
            'faCogs',
            'faChartLine',
            'faUsers',
            'faCheck',
            'faCircle',
            'faCode',
            'faDownload',
            'faEllipsisH',
            'faHeadset',
            'faLayerGroup',
            'faLock',
            'faLongArrowAltRight',
            'faLongArrowAltLeft',
            'faQuoteLeft',
            'faQuoteRight',
            'faTimes',
            'faMap',
            'faPhone',
            'faEnvelope',
          ],
        },
      ],
    }],
    '@nuxtjs/style-resources',
    '@nuxtjs/pwa',
    'nuxt-leaflet',
    'nuxt-webfontloader',
    'nuxtjs-mdi-font'
  ],

  /*
  ** Style resources
  */
  styleResources: {
    scss: [
      '~/assets/*/*.scss',
    ],
  },

  /*
  ** Web font loader
  */
  webfontloader: {
    google: {
      families: [
        'Montserrat:400,500,600',
        'Poppins:300,400,500,600',
        'Raleway:600',
      ],
    },
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

    },
  },
};
