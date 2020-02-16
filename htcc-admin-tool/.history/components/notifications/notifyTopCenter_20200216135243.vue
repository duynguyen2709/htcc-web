<template>
  <v-snackbar
    :color="info.color"
    top="true"
    v-model="info.status"
    dark
  >
    <v-icon color="white" class="mr-3">mdi-bell-plus</v-icon>
    <div>
      {{info.mess}}
    </div>
    <v-icon size="16" @click="setStatus(false)">mdi-close-circle</v-icon>
  </v-snackbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters({
        info: 'notifications/getInfo'
      }),
    },
    methods: {
      ...mapActions({
        setStatus: 'notifications/setStatus'
      }),
    }
}
</script>
