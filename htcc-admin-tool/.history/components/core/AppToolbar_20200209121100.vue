<template>
  <v-toolbar id="core-toolbar" flat prominent style="background: #eee;">
    <div class="v-toolbar-title">
      <v-toolbar-title class="tertiary--text font-weight-light">
        <v-btn v-if="responsive" class="default v-btn--simple" dark icon @click.stop="onClickBtn">
          <v-icon>mdi-view-list</v-icon>
        </v-btn>
        {{ title }}
      </v-toolbar-title>
    </div>

    <v-spacer />
    <v-toolbar-items>
      <v-flex align-center layout py-2>
        <v-text-field
          v-if="responsiveInput"
          class="mr-4 mt-2 purple-input"
          label="Search..."
          hide-details
          color="purple"
        />
        <nuxt-link v-ripple class="toolbar-items" to="/" title="Dashboard">
          <v-icon color="tertiary">mdi-view-dashboard</v-icon>
        </nuxt-link>
        <v-menu bottom left content-class="dropdown-menu" offset-y transition="slide-y-transition">
          <router-link v-ripple slot="activator" class="toolbar-items" to="/notifications">
            <v-badge color="error" overlap>
              <template slot="badge">{{ notifications.length }}</template>
              <v-icon color="tertiary">mdi-bell</v-icon>
            </v-badge>
          </router-link>
          <v-card>
            <v-list dense>
              <v-list-tile
                v-for="notification in notifications"
                :key="notification"
                @click="onClick"
              >
                <v-list-tile-title v-text="notification" />
              </v-list-tile>
            </v-list>
          </v-card>
        </v-menu>
        <!-- <nuxt-link
          v-ripple
          class="toolbar-items"
          to="/user-profile"
          title="User profile"
        >
          <v-icon color="tertiary">mdi-account</v-icon>
        </nuxt-link>-->

      

        <v-dialog v-model="dialog" width="600">
          <template v-slot:activator="{ on }">
            <!-- <v-btn color="red lighten-2" dark v-on="on">Click Me</v-btn> -->
            <v-icon color="tertiary" v-on="on">mdi-account</v-icon>
          </template>

          <!-- <v-card>
            <v-card-title class="headline grey lighten-2" primary-title>Privacy Policy</v-card-title>

            <v-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="dialog = false">I accept</v-btn>
            </v-card-actions>
          </v-card>-->

          
          <v-flex >
            <material-card class="v-card-profile pt-2">
              <v-avatar slot="offset" class="mx-auto d-block" size="130">
                <img
                  src="https://demos.creative-tim.com/vue-material-dashboard/img/marc.aba54d65.jpg"
                />
              </v-avatar>
              <v-card-text class="text-xs-center">
                <h6 class="category text-gray font-weight-thin mb-3">{{ user.function }}</h6>
                <h4 class="card-title font-weight-light">{{ fullname }}</h4>
                <p class="card-description font-weight-light">{{ user.description }}</p>
                <blockquote class="blockquote">{{ user.citation }}</blockquote>
                <v-btn color="success" round class="font-weight-light">Follow</v-btn>
              </v-card-text>
            </material-card>
          </v-flex>
        </v-dialog>
      </v-flex>
        <nuxt-link v-ripple class="toolbar-items" to="/" title="Logout" @click.native="logout">
          <v-icon color="tertiary">mdi-logout</v-icon>
        </nuxt-link>
      
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import materialCard from '~/components/material/AppCard'

  export default {
    components: {
      materialCard
    },
    data: () => ({
      notifications: [
        'Mike, John responded to your email',
        'You have 5 new tasks',
        'You\'re now a friend with Andrew',
        'Another Notification',
        'Another One'
      ],
      title: 'Dashboard',
      responsive: true,
      responsiveInput: true
    }),
    watch: {
      '$route' (val) {
        this.title = val.name
      }
    },
    computed: {
      ...mapGetters({
        user: 'user/getUser',
        fullname: 'user/getFullname',
        drawer: 'app/getDrawer'
      })
    },
    methods: {
      ...mapActions({
        setUsername: 'user/setUsername',
        setDrawer: 'app/setDrawer'
      }),

      onClickBtn () {
        this.setDrawer(!this.drawer)
      },
      onClick () {
        // Do something
      },
      onResponsiveInverted () {
        if (window.innerWidth < 991) {
          this.responsive = true
          this.responsiveInput = false
        } else {
          this.responsive = false
          this.responsiveInput = true
        }
      },
      async logout() {
        await this.setUsername(null);
        this.$router.push({ path: '/' });
      }
    },
    mounted () {
      this.onResponsiveInverted()
      window.addEventListener('resize', this.onResponsiveInverted)
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.onResponsiveInverted)
    }
  }
</script>

<style>
  #core-toolbar a {
    text-decoration: none;
  }
</style>
