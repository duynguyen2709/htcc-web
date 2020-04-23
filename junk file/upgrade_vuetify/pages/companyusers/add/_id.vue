<template>
<v-flex xs12 >
  <v-btn color="#4caf50" class="white--text ml-4" @click="$router.go(-1)">Quay lại</v-btn>
        <edit-form
                          title="Thêm người dùng cho công ty"
                          :CompanyIdNotEdit="CompanyId"
                          :phoneNumber="phoneNumber"
                          :email="email"
                          :username="username"
                          :password="password"
                          :loading="isLoading"
                          NoFullName
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
      CompanyId: null,
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
        .post('/api/admin/companyusers', {
          companyId: this.CompanyId,
          email: e.user.email,
          password: e.user.password,
          phoneNumber: e.user.phoneNumber,
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
          this.$router.push({ path: "/companyusers/" + this.CompanyId});
          }
        })
        .catch(function(error) {
          //handle error
          //this.is_loading = false;
          console.log("Error:");
          console.log(error);
        });

        this.isLoading = false;
    },
    goBack(){
      this.$router.push
    }
  },
  created:async function() {

    this.CompanyId = this.$route.params.id;
  },
};
</script>
