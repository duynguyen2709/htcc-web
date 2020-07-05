<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex md12>
        <v-btn color="green white--text" to="/companies/add">Thêm công ty</v-btn>
        <material-card text>
          <v-card-title>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Tìm kiếm"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <div>

            <div v-if="!isLoadingDataDone" class="text-center">
                    <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
                  </div>
            
            <v-data-table v-if="isLoadingDataDone"
              :headers="headers"
              :items="items"
              :search="search"
              hide-default-footer
              :page.sync="page"
              :items-per-page="itemsPerPage"
              @page-count="pageCount = $event"
            >
              <!-- <template slot="headers" slot-scope="{ header }"> -->
              <template v-slot:header="{ props: { headers } }">
                <thead>
                  <span class="subheading font-weight-light text--darken-3" v-text="headers.text" />
                </thead>
              </template>
              <!-- <template slot="items" slot-scope="{ item }"> -->
              <template v-slot:body="{ items }">
                <tbody>
                  <tr v-for="item in items" :key="item.companyName">
                    <td>
                      {{item.address}}
                    </td>
                    <td>{{ item.companyId }}</td>
                    <td>{{ item.companyName }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.phoneNumber }}</td>
                    <td class="text-xs-right">
                          <v-icon color="tertiary" @click.stop="clickEditForm(item)">edit</v-icon>
                     
                    </td>
                    <td class="text-xs-right">
                   <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                    <v-icon color="tertiary" v-on="on" @click.stop="goToCompanyUserPage(item)">mdi-format-list-bulleted</v-icon>
                                  </template>
                                  <span class="white--text">Xem danh sách quản trị viên</span>
                                </v-tooltip>
                    </td>
                    <td style="width: 115px;">
                      <v-row style="justify-content: space-around">
                        <p
                          class="font-weight-black"
                          v-bind:class="{'green--text': item.status, 'red--text': !item.status}"
                          style="margin-bottom: 0px !important; margin-left: 5px !important;"
                        >{{item.status != 0 ? 'Hoạt động' : 'Khóa'}}</p>
                        <v-icon
                          color="tertiary"
                          @click.stop="ShowStatusDialog(item)"
                        >{{item.status == 0 ? 'lock' : 'lock_open'}}</v-icon>
                      </v-row>
                    </td>
                  </tr>
                </tbody>

                <v-dialog v-model="editInfoForm" width="700">
                  
                        <edit-form
                        v-if= "ChoosenItem"
                          title="Chỉnh sửa thông tin công ty"
                          isCompany
                          :companyIdNoEdit="ChoosenItem.companyId"
                          :fullName="ChoosenItem.companyName"
                          :phoneNumber="ChoosenItem.phoneNumber"
                          :email="ChoosenItem.email"
                          :address="ChoosenItem.address"
                          :loading="editFormLoading"
                          btn="Cập nhật"
                          @OnClickEdit="updateProfile($event, ChoosenItem)"
                        ></edit-form>
                      </v-dialog>

                <v-dialog v-model="StatusDialog" max-width="290">
                  <v-card>
                    <v-card-title class="green white--text">Thay đổi trạng thái</v-card-title>

                    <v-card-text
                      class="mt-2"
                    >Bạn có chắc muốn thay đổi trạng thái của công ty này?</v-card-text>

                    <v-card-actions>
                      <v-btn
                        color="green darken-1"
                        text
                        @click="setStatus()"
                        :loading="loadingBtnStatus"
                      >Đồng ý</v-btn>

                      <v-btn color="red darken-1" text @click="StatusDialog = false">Hủy</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>

                <v-dialog v-model="DeleteDialog" max-width="290">
                  <v-card>
                    <v-card-title class="green white--text">Xóa công ty</v-card-title>

                    <v-card-text class="mt-2">Bạn có chắc muốn xóa công ty này?</v-card-text>

                    <v-card-actions>
                      <v-btn
                        color="green darken-1"
                        text
                        @click="deleteAdmin()"
                        :loading="loadingBtnDelete"
                      >Đồng ý</v-btn>

                      <v-btn color="red darken-1" text @click="DeleteDialog = false">Hủy</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </template>
            </v-data-table>
            <v-pagination v-model="page" :length="pageCount"></v-pagination>
          </div>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
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
