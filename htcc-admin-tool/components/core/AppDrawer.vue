<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="inputValue"
    app
    dark
    floating
    persistent
    mobile-break-point="991"
    width="260"
  >
    <v-img class="wrapper-drawer" height="100%">
      <v-layout class="fill-height" tag="v-list" column>
        <v-list dense>
          <v-list-item avatar to="/admins">
            <v-list-item-avatar color="white">
              <v-img :src="logo" height="34" contain />
            </v-list-item-avatar>
            <v-list-item-title class="title">HTCC - ADMIN</v-list-item-title>
          </v-list-item>
        </v-list>

        <v-divider />

        <v-list>
          <v-list-item class="icon-wrapper" active-class="primary white--text" to="/user-profile">
            <v-list-item-action class="icon-menu">
              <v-icon>mdi-account</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="'Thông tin cá nhân'"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group
            class="no-padding"
            no-action
            value="true"
            v-show="this.$onlyVisibleTo([this.$ROLE.ADMIN])"
          >
            <template v-slot:activator>
              <v-list-item class="icon-wrapper">
                <v-list-item-action class="icon-menu">
                  <v-icon>mdi-account-multiple</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Quản lý khách hàng</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-list-item active-class="primary white--text" to="/companies">
              <v-list-item-content>
                <v-list-item-title v-text="'Quản lý công ty'" class></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>

          <v-list-group
            class="no-padding"
            no-action
            value="true"
            v-show="this.$onlyVisibleTo([this.$ROLE.ADMIN, this.$ROLE.SUBADMIN])"
          >
            <template v-slot:activator>
              <v-list-item class="icon-wrapper">
                <v-list-item-action class="icon-menu">
                  <v-icon>mdi-cog</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title class="title-with-arrow">Quản lý hệ thống</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-list-item active-class="primary white--text" to="/admins">
              <v-list-item-content>
                <v-list-item-title v-text="'Quản lý quản trị viên'" class></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>

          <v-list-item
            style="margin-top: 6px !important;"
            class="icon-wrapper"
            :active-class="color"
            to="/"
          >
            <v-list-item-action class="icon-menu" style="margin-left: 0px;">
              <v-icon>mdi-chat-alert</v-icon>
            </v-list-item-action>
            <v-badge color="red" :content="amountComplaint" v-if="amountComplaint !== 0">
              <v-list-item-content>
                <v-list-item-title v-text="'Khiếu nại'" class="pr-1"></v-list-item-title>
              </v-list-item-content>
            </v-badge>
            <v-list-item-content v-else>
                <v-list-item-title v-text="'Khiếu nại'" class="pr-1"></v-list-item-title>
              </v-list-item-content>
          </v-list-item>

          <v-list-item class="icon-wrapper" :active-class="color" to="/icons">
            <v-list-item-action class="icon-menu">
              <v-icon>mdi-emoticon</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="'Quản lý icon'" class="pr-1"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item class="icon-wrapper" :active-class="color" to="/noti">
            <v-list-item-action class="icon-menu">
              <v-icon>mdi-bell</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="'Quản lý thông báo'" class="pr-1"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item class="icon-wrapper" :active-class="color" to="/features">
            <v-list-item-action class="icon-menu">
              <v-icon>mdi-clipboard-list</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="'Quản lý tính năng'" class="pr-1"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            style="margin-top: 6px !important;"
            class="icon-wrapper"
            :active-class="color"
            to="/orders"
          >
            <v-list-item-action class="icon-menu" style="margin-left: 0px;">
              <v-icon>mdi-inbox-multiple</v-icon>
            </v-list-item-action>
            <v-badge color="red" :content="amountOrder" v-if="amountOrder !== 0">
              <v-list-item-content>
                <v-list-item-title v-text="'Đơn hàng'" class="pr-1"></v-list-item-title>
              </v-list-item-content>
            </v-badge>
            <v-list-item-content v-else>
                <v-list-item-title v-text="'Đơn hàng'" class="pr-1"></v-list-item-title>
              </v-list-item-content>
          </v-list-item>

          <v-list-item class="icon-wrapper" :active-class="color" to="/analytic">
            <v-list-item-action class="icon-menu">
              <v-icon>mdi-google-analytics</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="'Thống kê'" class="pr-1"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list>
      </v-layout>
    </v-img>
  </v-navigation-drawer>
</template>

<script>
// Utilities
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      PendingOrder: 0,
      logo: "/logo.png",
      links: [
        {
          to: "/",
          icon: "mdi-account",
          text: "Complaint"
        },
        {
          to: "/admins",
          icon: "mdi-account-multiple",
          text: "Admins"
        },
        {
          to: "/companies",
          icon: "mdi-account",
          text: "Companies"
        },
        {
          to: "/user-profile",
          icon: "mdi-account",
          text: "User Profile"
        }
      ],
      responsive: true
    };
  },
  computed: {
    ...mapGetters({
      image: "app/getImage",
      color: "app/getColor",
      drawer: "app/getDrawer",
      amountComplaint: "complaint/getAmount",
      amountOrder: "order/getAmount"
    }),

    inputValue: {
      get() {
        return this.drawer;
      },
      set(val) {
        this.setDrawer(val);
      }
    }
  },
  mounted() {
    this.getOrder();
    this.onResponsiveInverted();
    window.addEventListener("resize", this.onResponsiveInverted);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResponsiveInverted);
  },
  methods: {
    ...mapActions({
      setDrawer: "app/setDrawer",
      setAmountComplaint: "complaint/setAmount",
      setAmountOrder: "order/setAmount"
    }),

    onResponsiveInverted() {
      this.responsive = window.innerWidth < 991;
    },
    async getOrder() {
      let $this = this;
      await $this.$axios
        .get("/api/admin/home")
        .then(function(response) {
          if (response.data.returnCode == 1) {
            $this.setAmountComplaint(response.data.data.pendingComplaint);
            $this.setAmountOrder(response.data.data.pendingOrder);

          } else {
            console.log("this error message: " + response.data.returnMessage);
          }
        })
        .catch(function(error) {
          console.log("Error get list admin:");
          console.log(error);
        });
    }
  }
};
</script>

<style lang="scss">
.v-application--is-ltr .v-list-item__icon:last-of-type:not(:only-child) {
  margin-left: -10px !important;
}

#app-drawer {
  &.v-navigation-drawer .v-list {
    // background: rgba(27, 27, 27, 0.4);
    padding: 0;
  }

  .wrapper-drawer {
     background: linear-gradient(to bottom right,#1b5e20,#66bb6a);
  }

  .v-divider {
    margin: 0;
  }

  .v-list__tile {
    border-radius: 4px;

    &--buy {
      margin-top: auto;
      margin-bottom: 17px;
    }

    &__title {
      color: #ffffff;
    }
  }

  .v-image__image--contain {
    top: 9px;
    height: 60%;
  }

  .search-input {
    margin-bottom: 30px !important;
    padding-left: 15px;
    padding-right: 15px;
  }

  .icon-wrapper {
    padding-right: 0px !important;
    margin-right: 11px !important;
  }

  .no-padding {
    padding: 0px !important;
    margin-left: -16px !important;
  }

  .title-with-arrow {
    margin-right: -20px !important;
  }

  .v-list .v-list-item--active .v-icon {
    color: #fff !important;
  }
}
</style>
