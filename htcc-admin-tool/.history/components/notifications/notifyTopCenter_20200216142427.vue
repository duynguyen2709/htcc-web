<template>
  <v-snackbar :color="info.color" top v-model="InputStatus" dark timeout="1000">
    <v-icon color="white" class="mr-3">mdi-bell-plus</v-icon>
    <div>{{info.mess}}</div>
    <!-- <v-icon size="16" @click="setStatus(false)">mdi-close-circle</v-icon> -->
    <v-icon size="16">mdi-close-circle</v-icon>
  </v-snackbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters({
        info: 'notification/getInfo'
      }),
      InputStatus: {
        get() {
          return this.info.status
        },
        set(val) {
          this.setStatus(val)
        }
      }
    },
    methods: {
      ...mapActions({
        setStatus: 'notification/setStatus'
      }),
    }
}
</script>
