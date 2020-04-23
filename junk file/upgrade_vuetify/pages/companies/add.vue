<template>
<v-flex xs12 >
  <v-btn color="#4caf50" class="white--text ml-4" @click="$router.go(-1)">Quay lại</v-btn>
        <edit-form
                          title="Thêm công ty"
                          :fullName="companyName"
                          :companyId="companyId"
                          :phoneNumber="phoneNumber"
                          :email="email"
                          :address="address"
                          :loading="isLoading"
                          isCompany
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
   companyName: '',
   email: '',
   phoneNumber: '',
   address: '',
   companyId: '',
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
        .post('/api/admin/companies', {
          address: e.company.address,
          companyName: e.company.companyName,
          companyId: e.company.companyId,
          email: e.company.email,
          phoneNumber: e.company.phoneNumber,
          status: 1
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
          this.$router.push({ path: "/companies/"});
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
