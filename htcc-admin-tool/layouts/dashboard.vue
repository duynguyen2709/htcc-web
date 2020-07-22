<template>
  <v-app>
    <core-toolbar />

    <notification />

    <core-drawer />

    <core-view />
  </v-app>
</template>

<script>
  import coreToolbar from '~/components/core/AppToolbar';
  import coreDrawer from '~/components/core/AppDrawer';
  import coreView from '~/components/core/AppView';
  import notification from '~/components/notifications/notifyTopCenter'

  export default {
    components: {
      coreToolbar,
      coreDrawer,
      coreView,
      notification
    }
  }
</script>

<style lang="scss">
  /* Remove in 1.2 */
  .v-datatable thead th.column.sortable i {
    vertical-align: unset;
  }
</style>
