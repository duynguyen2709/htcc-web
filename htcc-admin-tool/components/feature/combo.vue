<template>


  <material-card color="primary" title="Gửi thông báo">
    <v-form ref="form" v-model="isValid">
      <v-container py-0>
        <v-layout wrap>
          <v-flex xs12 md12>
            <v-select :items="ListCompanyId" v-model="CompanyId" label="Mã công ty"></v-select>
          </v-flex>
          <v-flex xs12 md12>
            <v-text-field label="Tiêu đề" class="green-input" v-model="title" :rules="[rules.required]" />
          </v-flex>
          <v-flex xs12 md12>
            <v-text-field label="Nội dung" class="green-input" v-model="content" :rules="[rules.required]" />
          </v-flex>
          <v-flex xs12 md12 style="display: flex;">
            <img class="img-icon" :src="getIcon(IconId)" />

            <v-select :items="ListIconId" v-model="IconId" item-text="screenDescription" item-value="iconId"
              label="Icon" :rules="[rules.required]" style="margin-left: 30px;"></v-select>
          </v-flex>
          <v-flex xs12 md12>
            <v-select :items="ListReceiverType" v-model="ReceiverType" item-text="name" item-value="id"
              label="Người nhận" :rules="[rules.required]"></v-select>
          </v-flex>
          <v-flex xs12 md12 v-if="ReceiverType == 3">
            <v-text-field label="Tên người nhận" class="green-input" v-model="username" :rules="[rules.required]" />
          </v-flex>
          <v-flex xs12 md12>
            <v-select :items="ListTargetClientId" v-model="TargetClientId" item-text="name" item-value="id"
              label="Hệ thống nhận" :rules="[rules.required]"></v-select>
          </v-flex>

          <v-btn :disabled="!isValid" class="mx-0 font-weight-light" color="success" @click="ConfirmDialog = true">Gửi
            thông báo</v-btn>
        </v-layout>
      </v-container>
    </v-form>
  </material-card>

</template>

<script>
  import {
    mapActions,
    mapGetters
  } from "vuex";

  import materialCard from "~/components/material/AppCard";
  import editForm from "~/components/material/AppFormEdit";

  export default {
    layout: "dashboard",
    components: {
      materialCard,
      editForm
    },
  data: () => ({
    isLoadingDataDone: false,

    ChoosenItem: null,

    /*status dialog*/
    StatusDialog: false,
    loadingBtnStatus: false,
    /*------------*/

    /*delete dialog*/
    DeleteDialog: false,
    loadingBtnDelete: false,
    /*------------*/

    editInfoForm: false,
    editFormLoading: false,

    page: 1,
    pageCount: 0,
    itemsPerPage: 5,
    Firstdialog: false,
    btnLock: true,
    search: "",
    headers: [
      {
        text: "Địa chỉ",
        value: "address"
      },
      {
        sortable: false,
        text: "Mã công ty",
        value: "companyId"
      },
      {
        sortable: false,
        text: "Tên công ty",
        value: "conpanyName"
      },
      {
        sortable: false,
        text: "Email",
        value: "email"
      },
      {
        sortable: false,
        text: "Số điện thoại",
        value: "phoneNumber"
      },
      
    ],

    items: []
  }),
  methods: {
    ...mapActions({
      setInfo: "notification/setInfo"
    }),
    clickItem: function(id) {
      this.$router.push({ path: "/companies/edit/" + id });
    },
    TriggerNoti(mess) {
      this.setInfo({ color: "success", mess: mess, status: true });
    },
    TriggerNotiError(mess) {
      this.setInfo({ color: "error", mess: mess, status: true });
    },
    clickEditForm(item){
      this.ChoosenItem = item;
      this.editInfoForm = true;
    },
    updateProfile(e, company) {
      // let ChoosenItem = this.items.find(item => item.id === id);
      // ChoosenItem.dialog = false;
      console.log("editloading: " + this.editFormLoading)
      this.editFormLoading = true;
      company.email = e.company.email;
      company.companyName = e.company.companyName;
      company.phoneNumber = e.company.phoneNumber;
      company.address = e.company.address;

      let url = "/api/admin/companies/" + company.companyId;
      console.log("url: " + url);
      this.$axios
        .put(url, {
          address: e.company.address,
          companyId: company.companyId,
          companyName: e.company.companyName,
          
          email: e.company.email,
          
          phoneNumber: e.company.phoneNumber,
          
          status: e.company.status,
        })
        .then(res => {
          if (res.data.returnCode != 1) {
            this.TriggerNotiError(res.data.returnMessage);
          } else {
            //this.is_loading = false;
            this.TriggerNoti("Cập nhật thông tin thành công");
            //window.location.reload(true);
            console.log("Response");
            console.log(res);
            //$this.goBack();
          }

          this.editFormLoading = false;
          this.editInfoForm = false;
        })
        .catch(function(error) {
          //handle error
          //this.is_loading = false;
          console.log("Error:");
          console.log(error);
        });
    },
    async getListcompanies() {
      let $this = this;

      $this.isLoadingDataDone = false;

      await $this.$axios
        .get("/api/admin/companies")
        .then(function(response) {
          if (response.data.returnCode == 1) {
            // console.log("this companies: " +  JSON.stringify(response.data.data))
            $this.items = response.data.data;
            console.log("this companies: " + JSON.stringify($this.items));

            $this.isLoadingDataDone = true;
          } else {
            console.log("this error message: " + response.data.returnMessage);
          }
        })
        .catch(function(error) {
          console.log("Error get list admin:");
          console.log(error);
        });
    },
    ShowStatusDialog(item) {
      this.ChoosenItem = item;
      this.StatusDialog = true;
    },
    ShowDeleteDialog(item) {
      this.ChoosenItem = item;
      this.DeleteDialog = true;
    },
    async setStatus() {
      let status = this.ChoosenItem.status == 0 ? 1 : 0;
      this.loadingBtnStatus = true;
      await this.$axios
        .put(
          "/api/admin/companies/" + this.ChoosenItem.companyId + "/status/" + status
        )
        .then(res => {
          if (res.data.returnCode != 1) {
            this.TriggerNotiError(res.data.returnMessage);
          } else {
            //this.is_loading = false;
            this.TriggerNoti(res.data.returnMessage);
            //window.location.reload(true);
            console.log("Response");
            console.log(res);

            this.ChoosenItem.status = status;
            this.loadingBtnStatus = false;
            //$this.goBack();
          }
        })
        .catch(function(error) {
          //handle error
          //this.is_loading = false;
          console.log("Error set status:");
          console.log(error);
        });

      this.StatusDialog = false;
    },
    deleteAdmin() {
      this.loadingBtnDelete = true;
      this.$axios
        .delete("/api/admin/companys/" + this.ChoosenItem.companyname)
        .then(res => {
          if (res.data.returnCode != 1) {
            this.TriggerNotiError(res.data.returnMessage);
          } else {
            //this.is_loading = false;
            this.TriggerNoti(res.data.returnMessage);
            //window.location.reload(true);
            console.log("Response");
            console.log(res);

            var index = this.items.indexOf(this.ChoosenItem);
            if (index !== -1) this.items.splice(index, 1);

            this.loadingBtnDelete = false;
            this.DeleteDialog = false;
            
          }
        })
        .catch(function(error) {
          //handle error
          //this.is_loading = false;
          console.log("Error set status:");
          console.log(error);
        });
    },
    goToCompanyUserPage(item){
      this.$router.push({ path: "/companyusers/" + item.companyId })
    }
  },
  created: async function() {

    this.getListcompanies();
  },
  watch: {
    editInfoForm: function(val){
      if(!val)
        this.editFormLoading = false;
    }
  }
  };

</script>

<style scoped>
  .dp {
    color: black !important;
  }

  .stickyCollumn {
    position: sticky;
    color: red !important;
  }

  .img-icon {
    width: 50px;
  }

  .filters {
    display: flex;
    align-items: baseline;
  }

  .filters div {
    margin: 10px;
  }

  .filters button {
    margin-bottom: 0px;
  }

  .pair-btn {
    display: flex;
    justify-content: center;
  }

  .pair-btn button {
    margin: 20px !important;
  }

</style>

