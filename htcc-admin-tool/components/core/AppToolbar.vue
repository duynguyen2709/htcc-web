<template class="d-toolbar ">
  <!-- <v-toolbar id="core-toolbar" flat prominent style="background: #eee;"> -->
  <v-toolbar id="core-toolbar" class="d-toolbar" text prominent style="background: #eee;">
    <div class="v-toolbar-title">
      <v-toolbar-title class="tertiary--text font-weight-bold">
        <v-btn v-if="responsive" class="default v-btn--simple" dark icon @click.stop="onClickBtn">
          <v-icon>mdi-view-list</v-icon>
        </v-btn>
        {{ title }}
      </v-toolbar-title>
    </div>

    <v-spacer />
    <v-toolbar-items class="d-toolbar">
      <v-flex align-center layout py-2>
        <div class="avatar-wrapper" @click="onClickUserProfile">
          <img :src="$auth.user.avatar"/>
          {{$auth.user.username}}
        </div>
      </v-flex>
      <nuxt-link
        v-ripple
        id="logout"
        class="toolbar-items primary"
        to="/"
        title="Logout"
        @click.native="$auth.logout()"
      >
        <v-icon color="white">mdi-logout</v-icon>
      </nuxt-link>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import materialCard from "~/components/material/AppCard";

export default {
  components: {
    materialCard
  },
  data: () => ({
    title: "",
    responsive: true,
    responsiveInput: true,
    dialog: false
  }),
  watch: {
    $route(val) {
      this.convertRouteToName(val.name)
    }
  },
  computed: {
    ...mapGetters({
      user: "user/getUser",
      fullname: "user/getFullname",
      drawer: "app/getDrawer"
    })
  },
  methods: {
    ...mapActions({
      setUsername: "user/setUsername",
      setDrawer: "app/setDrawer"
    }),

    convertRouteToName(RouteName) {
      let titleMap = new Map([
        ["index", "Khiếu nại"],
        ["Home", "Khiếu nại"],
        ["user-profile", "Thông tin cá nhân"],
        ["companies", "Danh sách công ty"],
        ["companyusers-id", "Danh sách quản trị viên công ty"],
        ["admins", "Danh sách quản trị viên"],
        ["icons", "icon"],
        ["noti", "Thông báo"],
        ["features", "Tính năng"],
        ["orders", "Đơn hàng"],
        ["analytic", "Thống kê"]
      ]);

      if (titleMap.has(RouteName)) {
        console.log("val name: ");
        console.log(RouteName);
        this.title = titleMap.get(RouteName);
      } else this.title = RouteName;
    },

    onClickBtn() {
      this.setDrawer(!this.drawer);
    },
    onClick() {
      // Do something
    },
    onResponsiveInverted() {
      if (window.innerWidth < 991) {
        this.responsive = true;
        this.responsiveInput = false;
      } else {
        this.responsive = false;
        this.responsiveInput = true;
      }
    },
    async logout() {
      await this.setUsername(null);
      this.$router.push({
        path: "/"
      });
    },
    onClickUserProfile() {
      this.$router.push({
        path: "/user-profile"
      });
    }
  },
  mounted() {
    this.convertRouteToName(this.$route.name);
    this.onResponsiveInverted();
    window.addEventListener("resize", this.onResponsiveInverted);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResponsiveInverted);
  }
};
</script>

<style lang="scss">
#core-toolbar a {
  text-decoration: none;
}

.d-toolbar {
  height: 64px !important;
}

.avatar-wrapper{
  font-size: 20px;
  font-weight: bold;

  display: flex;
  justify-content: center;

  margin-right: 30px;

  border-radius: 10px;
  background-color: #4caf50;
  color: #fff;

  padding: 10px;

  cursor: pointer;
}

.avatar-wrapper img{
  max-width: 30px;
  max-height: 30px;

  background-color: #fff;
  border-radius: 50%;

  margin-right: 5px;
  padding: 1px;
}

.v-toolbar {
  height: 96px !important;
  box-shadow: none !important;
  flex: none;
}

#logout {
  //color: #fff;
  border-radius: 10px;

  height: 51px;
}

.v-toolbar__content {
  display: flex;
      align-items: center !important;

  height: 96px !important;
}

.v-toolbar__items{
  display: flex;
      align-items: center !important;
}

.d-title-toolbar {
}
</style>
