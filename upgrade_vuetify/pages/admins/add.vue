<template>
<v-flex xs12 >
        <edit-form
                          title="Thêm một quản trị viên"
                          avatar="https://i.pinimg.com/originals/0d/36/e7/0d36e7a476b06333d9fe9960572b66b9.jpg"
                          :fullName="fullName"
                          :phoneNumber="phoneNumber"
                          :email="email"
                          :username="username"
                          :password="password"
                          :loading="isLoading"
                          btn="Thêm"
                          @OnClickEdit="add($event)"
                        ></edit-form>
      </v-flex>
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import materialCard from "~/components/material/AppCard";
import editForm from "~/components/material/AppFormEdit";

export default {
  layout: "dashboard",
  components: {
    materialCard,
    editForm
  },
  data: () => ({
    username: true,
    password: true,
   fullName: '',
   email: '',
   phoneNumber: '',
   isLoading: false
  }),
  methods:{
    ...mapActions({
      setInfo: "notification/setInfo"
    }),
    TriggerNoti(mess){
      this.setInfo({color: 'success',
                mess: mess,
                status: true})
      },
    TriggerNotiError(mess){
      this.setInfo({color: 'error',
                mess: mess,
                status: true})
      },
    async add(e){
      this.isLoading = true;
      let $this = this
      await $this.$axios
        .post('/api/admin/users', {
          avatar: e.user.avatar,
          email: e.user.email,
          fullName: e.user.fullName,
          password: e.user.password,
          phoneNumber: e.user.phoneNumber,
          role: 0,
          status: 1,
          username: e.user.username,
        })
        .then(res => {
          if(res.data.returnCode != 1){
            this.TriggerNotiError(res.data.returnMessage);
          }
          else{
          //this.is_loading = false;
          this.TriggerNoti(res.data.returnMessage);
          //window.location.reload(true);
          console.log("Response");
          console.log(res);
          this.$router.push({ path: "/admins/"});
          }
        })
        .catch(function(error) {
          //handle error
          //this.is_loading = false;
          console.log("Error:");
          console.log(error);
        });

        this.isLoading = false;
    }
  }
};
</script>
