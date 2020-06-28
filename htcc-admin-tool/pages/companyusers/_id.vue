<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex md12>
        <div>
          <v-btn color="#4caf50" class="white--text" @click="$router.go(-1)">Quay lại</v-btn>
        </div>
        
        <material-card text>
          <v-card-title>
            <v-col>
            <div>
          <v-btn color="green white--text" @click="goAdd">Thêm người dùng</v-btn>
        </div>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
            </v-col>
          </v-card-title>
          <div>

            <div v-if="!isLoadingDataDone" class="text-center">
                    <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
                  </div>

            <template v-if="isLoadingDataDone && items.length === 0">
                    <div class="no-data">
                        <v-icon size="90">mdi-bell-off</v-icon>
                        <p>Không có thông báo trong ngày này</p>
                      </div>
                  </template>
            
            <template v-if="items.length != 0">
            <v-data-table v-if="isLoadingDataDone"
              :headers="headers"
              :items="items"
              :search="search"
              hide-default-footer
              :page.sync="page"
              :items-per-page="itemsPerPage"
              @page-count="pageCount = $event"
            >
              <template v-slot:header="{ props: { headers } }">
                <thead>
                  <span class="subheading font-weight-light text--darken-3" v-text="headers.text" />
                </thead>
              </template>
              
              <template v-slot:body="{ items }">
                <tbody>
                  <tr v-for="item in items" :key="item.username">
                    <td>
                        {{ item.companyId }}
                    </td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.username }}</td>
                    <!-- <td>{{ item.password }}</td> -->
                    <td>{{ item.phoneNumber }}</td>
                    <td class="text-xs-right">
                      <!-- <v-btn color="success" @click="dialog=true">Chỉnh sửa</v-btn> -->
                      
                        <!-- <template v-slot:activator="{ on }"> -->
                          <!-- <v-btn color="success" v-on="on">Chỉnh sửa</v-btn> -->
                          <v-icon color="tertiary" @click.stop="clickEditForm(item)">edit</v-icon>
                        <!-- </template> -->
                       
                    </td>
                    <td style="width: 100px;">
                      <v-row style="justify-content: space-around">
                        <p
                          class="font-weight-black"
                          v-bind:class="{'green--text': item.status, 'red--text': !item.status}"
                          style="margin-bottom: 0px !important"
                        >{{item.status != 0 ? 'Hoạt động' : 'Khóa'}}</p>
                        <v-icon
                          color="tertiary"
                          @click.stop="ShowStatusDialog(item)"
                        >{{item.status == 0 ? 'lock' : 'lock_open'}}</v-icon>
                      </v-row>
                    </td>
                    <!-- <td>
                      <v-icon
                        color="tertiary"
                        @click.stop="ShowDeleteDialog(item)"
                      >mdi-account-remove</v-icon>
                    </td> -->
                  </tr>
                </tbody>

                <v-dialog v-model="editInfoForm" width="700">
                  
                        <edit-form
                        v-if= "ChoosenItem"
                          title="Chỉnh sửa thông tin admin"
                          :usernameNotEdit="ChoosenItem.username"
                          :phoneNumber="ChoosenItem.phoneNumber"
                          :email="ChoosenItem.email"
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
                    >Bạn có chắc muốn thay đổi trạng thái của quản trị viên này?</v-card-text>

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
                    <v-card-title class="green white--text">Xóa quản trị viên</v-card-title>

                    <v-card-text class="mt-2">Bạn có chắc muốn xóa quản trị viên này?</v-card-text>

                    <v-card-actions>
                      <v-btn
                        color="green darken-1"
                        text=""
                        :loading="loadingBtnDelete"
                      >Đồng ý</v-btn>

                      <v-btn color="red darken-1" text @click="DeleteDialog = false">Hủy</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </template>
            </v-data-table>
            <v-pagination v-model="page" :length="pageCount"></v-pagination>
            </template>
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
    
    CompanyId: null,

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
        text: "Mã công ty",
        value: "companyId"
      },
      {
        sortable: false,
        text: "email",
        value: "email"
      },
      {
        sortable: false,
        text: "Tên đăng nhập",
        value: "username"
      },
      // {
      //   text: "Mật khẩu",
      //   value: "password"
      // },
      {
        sortable: false,
        text: "Số điện thoại",
        value: "phoneNumber"
      }
    ],

    items: [],
    ChoosenItems: []
  }),
  methods: {
    ...mapActions({
      setInfo: "notification/setInfo"
    }),
    clickItem: function(id) {
      this.$router.push({ path: "/admins/edit/" + id });
    },
    TriggerNoti(mess) {
      this.setInfo({ color: "success", mess: mess, status: true });
    },
    TriggerNotiError(mess) {
      this.setInfo({ color: "error", mess: mess, status: true });
    },
    clickEditForm(item){
      console.log("this username: " + item.username)
      this.ChoosenItem = item;
      console.log("this username choosenitem: " + item.username)
      this.editInfoForm = true;
    },
    updateProfile(e, user) {
      // let ChoosenItem = this.items.find(item => item.id === id);
      // ChoosenItem.dialog = false;
      let $this= this;
      console.log("editloading: " + this.editFormLoading)
      this.editFormLoading = true;
      user.email = e.user.email;
      user.phoneNumber = e.user.phoneNumber;

      let url = "/api/admin/companyusers/" + $this.CompanyId + "/" + user.username;
      console.log("url: " + url);
      this.$axios
        .put(url, {
            CompanyId: $this.CompanyId,
          email: e.user.email,
          password: user.password,
          phoneNumber: e.user.phoneNumber,
          status: user.status,
          username: user.username
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
    async getListAdmins() {
      let $this = this;

        $this.CompanyId = $this.$route.params.id

      $this.isLoadingDataDone = false;

      await $this.$axios
        .get("/api/admin/companyusers/" + $this.CompanyId)
        .then(function(response) {
          if (response.data.returnCode == 1) {
            // console.log("this admins: " +  JSON.stringify(response.data.data))
            $this.items = response.data.data;
            console.log("this admins: " + JSON.stringify($this.items));

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
          "/api/admin/companyusers/" + this.CompanyId + "/" + this.ChoosenItem.username + "/status/" + status
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
        .delete("/api/admin/users/" + this.ChoosenItem.username)
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
    goAdd(){
        this.$router.push({ path: "/companyusers/add/" + this.CompanyId })
    }
  },
  created: async function() {

    this.getListAdmins();
  },
  watch: {
    editInfoForm: function(val){
      if(!val)
        this.editFormLoading = false;
    }
  }
};
</script>
