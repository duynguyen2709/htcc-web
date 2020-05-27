<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex md12>
        <v-btn color="green white--text" to="/icons/add">Thêm icon</v-btn>
        <material-card text>
          <v-card-title>
            <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
          </v-card-title>
          <div>
            <div v-if="!isLoadingDataDone" class="text-center">
              <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
            </div>

            <v-data-table v-if="isLoadingDataDone" :headers="headers" :items="items" :search="search"
              hide-default-footer :page.sync="page" :items-per-page="itemsPerPage" @page-count="pageCount = $event">
              <template v-slot:header="{ props: { headers } }">
                <thead>
                  <span class="subheading font-weight-light text--darken-3" v-text="headers.text" />
                </thead>
              </template>

              <template v-slot:body="{ items }">
                <tbody>
                  <tr v-for="item in items" :key="item.iconId">
                    <td>{{ item.iconId }}</td>
                    <td>
                      <v-avatar>
                        <v-img :src="item.iconURL" :lazy-src="LazyImg">
                        <template v-slot:placeholder>
                                    <v-row class="fill-height ma-0" align="center" justify="center">
                                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                    </v-row>
                                  </template>
                                </v-img>
                      </v-avatar>
                    </td>
                    <td>{{ item.screenId }}</td>
                    <td>{{ item.screenDescription }}</td>
                   
                    <td>
                      <v-icon color="tertiary" @click.stop="ShowDeleteDialog(item)">mdi-account-remove</v-icon>
                    </td>
                  </tr>
                </tbody>

                <v-dialog v-model="editInfoForm" width="700">
                  <edit-form v-if="ChoosenItem" title="Chỉnh sửa thông tin admin"
                    :usernameNotEdit="ChoosenItem.username" :fullName="ChoosenItem.fullName"
                    :phoneNumber="ChoosenItem.phoneNumber" :email="ChoosenItem.email" :loading="editFormLoading"
                    btn="Cập nhật" @OnClickEdit="updateProfile($event, ChoosenItem)"></edit-form>
                </v-dialog>

                

                <v-dialog v-model="DeleteDialog" max-width="290">
                  <v-card>
                    <v-card-title class="green white--text">Xóa icon</v-card-title>

                    <v-card-text class="mt-2">Bạn có chắc muốn xóa icon này?</v-card-text>

                    <v-card-actions>
                      <v-btn color="green darken-1" text @click="deleteIcon()" :loading="loadingBtnDelete">Đồng ý
                      </v-btn>

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
      LazyImg: "./vuetifylogo.png",

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
          sortable: false,
          text: "ID",
          value: "iconId"
        },
        {
          sortable: false,
          text: "Ảnh"
        },
        
        {
          sortable: false,
          text: "Màn hình",
          value: "screenId"
        },
        {
          sortable: false,
          text: "Mô tả",
          value: "screenDescription"
        }
      ],

      items: [],
      ChoosenItems: []
    }),
    methods: {
      ...mapActions({
        setInfo: "notification/setInfo"
      }),
      clickItem: function (id) {
        this.$router.push({
          path: "/admins/edit/" + id
        });
      },
      TriggerNoti(mess) {
        this.setInfo({
          color: "success",
          mess: mess,
          status: true
        });
      },
      TriggerNotiError(mess) {
        this.setInfo({
          color: "error",
          mess: mess,
          status: true
        });
      },
      clickEditForm(item) {
        console.log("this username: " + item.username);
        this.ChoosenItem = item;
        console.log("this username choosenitem: " + item.username);
        this.editInfoForm = true;
      },
      updateProfile(e, user) {
        // let ChoosenItem = this.items.find(item => item.id === id);
        // ChoosenItem.dialog = false;
        console.log("editloading: " + this.editFormLoading);
        this.editFormLoading = true;
        user.email = e.user.email;
        user.fullName = e.user.fullName;
        user.phoneNumber = e.user.phoneNumber;

        let url = "/api/admin/users/" + user.username;
        console.log("url: " + url);
        this.$axios
          .put(url, {
            avatar: user.avatar,
            email: e.user.email,
            fullName: e.user.fullName,
            password: user.password,
            phoneNumber: e.user.phoneNumber,
            role: user.role,
            status: e.user.status,
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
          .catch(function (error) {
            //handle error
            //this.is_loading = false;
            console.log("Error:");
            console.log(error);
          });
      },
      async getListIcons() {
        let $this = this;

        $this.isLoadingDataDone = false;

        await $this.$axios
          .get("/api/admin/icons")
          .then(function (response) {
            if (response.data.returnCode == 1) {
              // console.log("this admins: " +  JSON.stringify(response.data.data))
              $this.items = response.data.data.iconList;
              console.log("this icons: " + JSON.stringify($this.items));

              $this.isLoadingDataDone = true;
            } else {
              console.log("this error message: " + response.data.returnMessage);
            }
          })
          .catch(function (error) {
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
            "/api/admin/users/" + this.ChoosenItem.username + "/status/" + status
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
          .catch(function (error) {
            console.log("Error set status:");
            console.log(error);
          });

        this.StatusDialog = false;
      },
      deleteIcon() {
        this.loadingBtnDelete = true;
        this.$axios
          .delete("/api/admin/icons/" + this.ChoosenItem.iconId)
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
          .catch(function (error) {
            console.log("Error set status:");
            console.log(error);
          });
      }
    },
    created: async function () {
      this.getListIcons();
    },
    watch: {
      editInfoForm: function (val) {
        if (!val) this.editFormLoading = false;
      }
    }
  };

</script>
