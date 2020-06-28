<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex md12>
        <material-card text>
          <v-dialog
            style="color: black; !important"
            ref="dialog"
            v-model="datePicker"
            :return-value.sync="date"
            width="290px"
          >
            <v-date-picker
              class="dp"
              locale="vi-VN"
              v-model="date"
              type="date"
              @input="clickDatePicker"
            ></v-date-picker>
          </v-dialog>

          <v-tabs v-model="tab">
            <v-tab key="SendNoti">Gửi thông báo</v-tab>
            <v-tab key="ListNoti">Danh sách thông báo</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item key="SendNoti">
              <material-card color="primary" title="Gửi thông báo">
                <v-form ref="form" v-model="isValid">
                  <v-container py-0>
                    <v-layout wrap>
                      <v-flex xs12 md12>
                        <v-select
                          :items="ListCompanyId"
                          v-model="CompanyId"
                          label="Mã công ty"
                        ></v-select>
                      </v-flex>
                      <v-flex xs12 md12>
                        <v-text-field
                          label="Tiêu đề"
                          class="green-input"
                          v-model="title"
                          :rules="[rules.required]"
                        />
                      </v-flex>
                      <v-flex xs12 md12>
                        <v-text-field
                          label="Nội dung"
                          class="green-input"
                          v-model="content"
                          :rules="[rules.required]"
                        />
                      </v-flex>
                      <v-flex xs12 md12 style="display: flex;">
                        <img class="img-icon" :src="getIcon(IconId)" />

                        <v-select
                          :items="ListIconId"
                          v-model="IconId"
                          item-text="screenDescription"
                          item-value="iconId"
                          label="Icon"
                          :rules="[rules.required]"
                          style="margin-left: 30px;"
                        ></v-select>
                      </v-flex>
                      <v-flex xs12 md12>
                        <v-select
                          :items="ListReceiverType"
                          v-model="ReceiverType"
                          item-text="name"
                          item-value="id"
                          label="Người nhận"
                          :rules="[rules.required]"
                        ></v-select>
                      </v-flex>
                      <v-flex xs12 md12 v-if="ReceiverType == 3">
                        <v-text-field
                          label="Tên người nhận"
                          class="green-input"
                          v-model="username"
                          :rules="[rules.required]"
                        />
                      </v-flex>
                      <v-flex xs12 md12>
                        <v-select
                          :items="ListTargetClientId"
                          v-model="TargetClientId"
                          item-text="name"
                          item-value="id"
                          label="Hệ thống nhận"
                          :rules="[rules.required]"
                        ></v-select>
                      </v-flex>

                      <v-btn
                        :disabled="!isValid"
                        class="mx-0 font-weight-light"
                        color="success"
                        @click="ConfirmDialog = true"
                      >Gửi thông báo</v-btn>
                    </v-layout>
                  </v-container>
                </v-form>
              </material-card>
            </v-tab-item>
            <v-tab-item key="ListNoti">
              <v-container>
                <v-card-title>
                  <v-row align="center">
                    <v-col class="d-flex" cols="12" sm="3">
                      <v-text-field
                        v-model="date"
                        label="Chọn một ngày"
                        prepend-icon="event"
                        readonly
                        style="margin-bottom: -22px !important;"
                        @click.stop="datePicker=true"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="9">
                      <v-text-field
                        v-model="searchNoti"
                        append-icon="search"
                        label="Search"
                        single-line
                        hide-details
                      ></v-text-field>

                      <div class="filters">
                        <v-select
                          :items="ListCompanyId"
                          v-model="FilterCompanyId"
                          label="Mã công ty"
                        ></v-select>

                        <v-select
                          :items="ListReceiverType"
                          v-model="FilterReceiverType"
                          item-text="name"
                          item-value="id"
                          label="Người nhận"
                        ></v-select>

                        <v-select
                          :items="ListTargetClientId"
                          v-model="FilterTargetClientId"
                          item-text="name"
                          item-value="id"
                          label="Hệ thống nhận"
                        ></v-select>

                      

                      </div>

                      <div class="pair-btn">
                        <v-btn
                        class="mx-0 font-weight-light"
                        color="success"
                        @click="doTheFilter()"
                      >Lọc</v-btn>
                      <v-btn
                        class="mx-0 font-weight-light"
                        color="error"
                        @click="clearTheFilter()"
                      >Xóa bộ lọc</v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-title>

                <div>
                  <div v-if="!isLoadingDataDone" class="text-center">
                    <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
                  </div>

                  <v-data-table
                    v-if="isLoadingDataDone"
                    :headers="headersNoti"
                    :items="ListChoosenNoti"
                    :search="searchNoti"
                    hide-default-footer
                    :page.sync="pageNoti"
                    :items-per-page="itemsPerPage"
                    @page-count="pageCountNoti = $event"
                  >
                    <template v-slot:no-data>
                      <!-- <div class="no-data"> -->
                        <v-icon size="90">mdi-bell-off</v-icon>
                        <p>Không có thông báo trong ngày này</p>
                      <!-- </div> -->
                    </template>

                    <template v-if="ListChoosenNoti.length !== 0" v-slot:body="{ items }">
                      <tbody>
                        <tr v-for="item in items" :key="item.notiId">
                          <td>
                            <img class="img-icon" :src="item.iconUrl" />
                          </td>
                          <td>{{ getTypeSystem(item.targetClientId) }}</td>
                          <td>{{ getReceiveType(item.receiverType) }}</td>
                          <td>{{ item.companyId }}</td>
                          <td>{{ item.username }}</td>
                          <td>{{ getDate(item.sendTime) }}</td>
                          <td>{{ item.title }}</td>
                          <td>{{ item.content }}</td>

                          <td>{{ getStatus(item.status) }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-data-table>
                  <v-pagination v-model="pageNoti" :length="pageCountNoti"></v-pagination>
                </div>
              </v-container>
            </v-tab-item>
          </v-tabs-items>
        </material-card>
      </v-flex>

      <v-dialog v-model="ConfirmDialog" max-width="290">
        <v-card>
          <v-card-title class="green white--text">Gửi thông báo</v-card-title>

          <v-card-text class="mt-2">Bạn có chắc muốn gửi thông báo này?</v-card-text>

          <v-card-actions>
            <v-btn color="green darken-1" text @click="sendNoti" :loading="loadingBtnConfirm">Đồng ý</v-btn>

            <v-btn color="red darken-1" text @click="ConfirmDialog = false">Hủy</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
    isValid: false,
    isLoadingDataDone: false,
    ConfirmDialog: false,
    loadingBtnConfirm: false,

    /*add noti*/
    ListIconId: [],
    IconId: null,
    ListCompanyId: [],
    CompanyId: null,

    ListReceiverType: [
      {
        id: 1,
        name: "Toàn hệ thống"
      },
      {
        id: 2,
        name: "Công ty"
      },
      {
        id: 3,
        name: "Người dùng cụ thể"
      }
    ],
    ReceiverType: null,
    ListTargetClientId: [
      {
        id: 1,
        name: "Mobile"
      },
      {
        id: 2,
        name: "Web quản lý"
      },
      {
        id: 3,
        name: "Web admin"
      }
    ],
    TargetClientId: null,

    title: "",
    content: "",
    username: "",

    rules: {
      required: value => !!value || "Không được để trống"
    },

    /*filter*/
    FilterTargetClientId: "",
    FilterReceiverType: "",
    FilterCompanyId: "",


    /*content dialog*/
    ListContentDialog: false,
    ChoosenContents: [],

    /*images*/
    LazyImg: "/vuetifylogo.png",
    LazyImg2: "/v.png",
    ChoosenImage: "",
    ImgDialog: "",

    /*date picker*/
    datePicker: false,
    date: new Date().toISOString().substr(0, 10),

    tab: null,

    searchNoti: "",

    /*complaint*/
    ListComplaint: [],

    searchNoti: "",

    pageNoti: 1,
    pageCountNoti: 0,

    itemsPerPage: 5,

    headersNoti: [
      {
        text: "icon",
        value: "iconURL",
        width: 100
      },
      {
        text: "Hệ thống nhận",
        value: "TargetClientId",
        width: 170,
        align: "center"
      },
      {
        text: "Đối tượng nhận",
        value: "receiverType",
        width: 170,
        align: "center"
      },
      {
        text: "Mã công ty",
        value: "companyId",
        width: 150,
        align: "center"
      },
      {
        text: "Người nhận",
        value: "username",
        width: 150,
        align: "center"
      },
      {
        text: "Thời gian gửi",
        width: 170,
        value: "sendTime"
      },
      {
        text: "Tiêu đề",
        width: 140,
        value: "title"
      },
      {
        text: "Nội dung",
        width: 170,
        value: "content"
      },
      {
        text: "Trạng thái",
        width: 150,
        value: "status"
      }
    ],
    headersContent: [
      {
        text: "Nội dung",
        value: "content",
        align: "center",
        divine: true,
        width: 300
      },
      {
        text: "Ghi chú",
        value: "response",
        align: "center",
        width: 300
      }
    ],
    ListNoti: [],
    ListChoosenNoti: [],
    ChoosenItems: []
  }),
  computed: {
    ...mapGetters({
      amountComplaint: "complaint/getAmount"
    })
  },
  methods: {
    ...mapActions({
      setInfo: "notification/setInfo",
      setAmountComplaint: "complaint/setAmount"
    }),

    clickImg(img) {
      this.ChoosenImage = img;
      this.ImgDialog = true;
    },

    MaxLengthContent(item) {
      return item.content.length > item.response.length
        ? item.content.length
        : item.response.length;
    },

    async clickDatePicker() {
      this.datePicker = false;
      this.$refs.dialog.save(this.date);
      console.log(this.date);
      await this.getListNoti(this.date);
    },
    getTypeSystem(id) {
      if (id == 1) return "Mobile";
      else if (id == 2) return "Web quản lý";

      return "Web admin";
    },
    getReceiveType(id) {
      if (id == 0) return "Toàn bộ hệ thống";
      else if (id == 1) return "Công ty";

      return "Người dùng";
    },
    getStatus(id) {
      if (id == 0) return "Thất bại";
      else if (id == 1) return "Thành công";
      else return "Đang xử lý";
    },
    getDate(time){
      var todayTime = new Date(time);
    // var month = todayTime .getMonth() + 1;
    // var day = todayTime .getDate();
    // var year = todayTime .getFullYear();

    var hour = todayTime.getHours();
    var minute = todayTime.getMinutes();

    return hour + ":" + minute;

      //return new Date(time*1000);
    },
    async getListNoti(date) {
      let $this = this;

      $this.isLoadingDataDone = false;

      console.log("date: ", date);

      date = date.split("-").join("");

      console.log("date after: ", date);

      $this.ListNoti = [];

      await $this.$axios
        .get("/api/admin/notifications/" + date)
        .then(function(response) {
          if (response.data.returnCode == 1) {
            // response.data.data.forEach(element => {
            //   if (element.status == 2) $this.PendingItems.push(element);
            //   else $this.ConfirmedItems.push(element);
            // });

            console.log(response.data);

            $this.ListNoti = response.data.data;

            $this.ListChoosenNoti = $this.ListNoti;

            console.log("done data pending complaint");
            $this.isLoadingDataDone = true;
          } else {
            console.log(
              "this error message complaint: " + response.data.returnMessage
            );
          }
        })
        .catch(function(error) {
          console.log("Error get list complaint:");
          console.log(error);
        });
    },
    async getListCompanyId(date) {
      let $this = this;

      await $this.$axios
        .get("/api/admin/companies")
        .then(function(response) {
          if (response.data.returnCode == 1) {
            // response.data.data.forEach(element => {
            //   if (element.status == 2) $this.PendingItems.push(element);
            //   else $this.ConfirmedItems.push(element);
            // });

            //console.log(response.data);

            response.data.data.forEach(element => {
              $this.ListCompanyId.push(element.companyId);
            });
            //$this.List = response.data.data;

            console.log("done data companyId");
          } else {
            console.log(
              "this error message companyId noti: " +
                response.data.returnMessage
            );
          }
        })
        .catch(function(error) {
          console.log("Error get list complaint:");
          console.log(error);
        });
    },
    async getListIcon(date) {
      let $this = this;

      await $this.$axios
        .get("/api/admin/icons")
        .then(function(response) {
          if (response.data.returnCode == 1) {
            // response.data.data.forEach(element => {
            //   if (element.status == 2) $this.PendingItems.push(element);
            //   else $this.ConfirmedItems.push(element);
            // });

            //console.log(response.data);

            $this.ListIconId = response.data.data.iconList;

            console.log("done data companyId");
          } else {
            console.log(
              "this error message companyId noti: " +
                response.data.returnMessage
            );
          }
        })
        .catch(function(error) {
          console.log("Error get list complaint:");
          console.log(error);
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

    getIcon(id) {
      console.log("icon id change: ", id);

      let icon = this.ListIconId.find(element => element.iconId === id);
      if (!icon) return "/vuetifylogo.png";
      console.log("icon: ", icon);
      return icon["iconURL"];
    },

    sendNoti() {
      this.loadingBtnConfirm = true;
      // this.isLoadingBtnSave = true;
      this.$axios
        .post("/api/admin/notifications", {
          companyId: this.CompanyId,
          content:
            this.content,
          iconId: this.IconId,
          receiverType: this.ReceiverType - 1,
          sender: this.$auth.user.username,
          targetClientId: this.TargetClientId,
          title: this.title,
          username: this.username
        })
        .then(res => {
          this.isLoadingBtnSave = false;
          this.loadingBtnConfirm = false;
          this.ConfirmDialog = false;
          if (res.data.returnCode != 1) {
            this.TriggerNotiError(res.data.returnMessage);
          } else {
            //this.is_loading = false;
            this.TriggerNoti(res.data.returnMessage);
            //$this.goBack();
          }
        });

      //     console.log("error push")
    },

    doTheFilter(){
      // this.ListChoosenNoti = this.ListNoti.find(element=>(element.targetClientId == this.FilterTargetClientId)
      //                                                   && (element.receiverType == this.FilterReceiverType) 
      //                                                   && (element.companyId == this.FilterCompanyId))

      this.ListChoosenNoti = []
      this.ListNoti.forEach(el => {
        let flagTarget = true;
        let flagReceiver = true;
        let flagCompany = true;

        if(this.FilterTargetClientId){
          if(el.targetClientId != this.FilterTargetClientId)
            flagTarget = false;
        }

        if(this.FilterReceiverType){
          if(el.receiverType != (this.FilterReceiverType - 1))
            flagReceiver = false;
        }

        if(this.FilterCompanyId){
          if(el.companyId != this.FilterCompanyId)
            flagTarget = false;
        }

        if(flagTarget && flagReceiver && flagCompany)
            this.ListChoosenNoti.push(el)                                          
      })
    },
    clearTheFilter() {
      this.FilterCompanyId = ""
      this.FilterReceiverType = ""
      this.companyId = ""

      this.ListChoosenNoti = this.ListNoti
    }
  },
  created: async function() {
    this.getListNoti(this.date);
    this.getListCompanyId();
    this.getListIcon();
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

.pair-btn button{
  margin: 20px !important;
}
</style>
