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
                    <v-col class="d-flex" cols="12" sm="9">
                      <v-text-field
                        v-model="searchNoti"
                        append-icon="search"
                        label="Search"
                        single-line
                        hide-details
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-title>

                <div>
                  <v-data-table
                    :headers="headersNoti"
                    :items="ListNoti"
                    :search="searchNoti"
                    hide-default-footer
                    :page.sync="pageConfirmed"
                    :items-per-page="itemsPerPage"
                    @page-count="pageCountConfirmed = $event"
                  >
                    <template v-slot:no-data>Không có thông báo trong ngày này</template>

                    <template v-if="ListNoti.length !== 0" v-slot:body="{ items }">
                      <tbody>
                        <tr v-for="item in items" :key="item.notiId">
                          <td>{{ item.targetClientId }}</td>
                          <td>{{ item.companyId  }}</td>
                          <td>{{ item.username  }}</td>
                          <td>{{ item.sendTime  }}</td>
                          <td>{{ item.title  }}</td>
                          <td>{{ item.content  }}</td>
                          <td>{{ item.iconURL  }}</td>
                          <td>{{ item.status  }}</td>
                          
                        </tr>
                      </tbody>
                    </template>
                  </v-data-table>
                  <v-pagination v-model="pageConfirmed" :length="pageCountConfirmed"></v-pagination>
                </div>
              </v-container>
            </v-tab-item>
          </v-tabs-items>

          <v-dialog width="530" v-model="EditDialog">
            <material-card color="success" elevation="12" title="Đổi mật khẩu">
              <v-form ref="form">
                <v-card-text v-if="ChoosenItem !== null">
                  <v-text-field v-model="ChoosenItem.category" label="Category" :readonly="true" />
                  <v-text-field
                    v-model="ChoosenItem.complaintId"
                    label="Complaint Id"
                    :readonly="true"
                  />
                  <v-text-field v-model="ChoosenItem.content" label="Content" :readonly="true" />
                  <v-text-field v-model="ChoosenItem.date" label="Date" :readonly="true" />
                  <v-textarea v-model="ChoosenItem.response" label="Ghi chú"></v-textarea>

                  <v-radio-group v-model="ChoosenItem.status">
                    <v-radio label="Từ chối" value="0"></v-radio>
                    <v-radio label="Xử lý" value="1"></v-radio>
                  </v-radio-group>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="green darken-1" text @click="ConfirmDialog = true">Đồng ý</v-btn>

                  <v-btn color="red darken-1" text @click="EditDialog = false">Hủy</v-btn>
                </v-card-actions>
              </v-form>
            </material-card>
          </v-dialog>

          <v-dialog v-model="ConfirmDialog" max-width="290">
            <v-card>
              <v-card-title class="green white--text">Cập nhập khiếu nại</v-card-title>

              <v-card-text class="mt-2">Bạn có chắc muốn cập nhập đơn khiếu nại này?</v-card-text>

              <v-card-actions>
                <v-btn
                  color="green darken-1"
                  text
                  @click="editStatus"
                  :loading="loadingConfirmEditDialog"
                >Đồng ý</v-btn>

                <v-btn color="red darken-1" text @click="()=>{ConfirmDialog = false;}">Hủy</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="ImgDialog" max-width="500">
            <v-img :src="ChoosenImage" :lazy-src="LazyImg2">
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-dialog>

          <v-dialog width="700" v-model="ListContentDialog">
            <material-card color="success" elevation="12" title="Danh sách lịch sử khiếu nại">
              <v-data-table :headers="headersContent" :items="ChoosenContents" hide-default-footer>
                <template v-slot:body="{ items }">
                  <tbody>
                    <tr v-for="item in items" :key="item.Content">
                      <td style="max-width: 300px;">{{ item.content }}</td>
                      <td style="max-width: 300px;">{{ item.response }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-data-table>
            </material-card>
          </v-dialog>

          <!-- <v-card-title>
            <v-text-field
              v-model="searchConfirmed"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>

          <div>
            <v-data-table
              :headers="headers"
              :items="ConfirmedItems"
              :search="search"
              hide-default-footer
              :page.sync="page"
              :items-per-page="itemsPerPage"
              @page-count="pageCount = $event"
            >
             
            </v-data-table>
            <v-pagination v-model="page" :length="pageCount"></v-pagination>
          </div>-->
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

    /*edit*/

    EditDialog: false,
    loadingEditDialog: false,
    ChoosenItem: null,
    response: "",
    status: 1,

    ConfirmDialog: false,
    loadingConfirmEditDialog: false,

    /*complaint*/
    ListComplaint: [],

    searchNoti: "",

    pagePending: 1,
    pageCountPending: 0,

    pageConfirmed: 1,
    pageCountConfirmed: 0,

    itemsPerPage: 5,
    dialog: false,
    btnLock: true,
    search: "",
    headersNoti: [
      {
        text: "Hệ thống nhận",
        value: "targetClientId",
        class: "stickyCollumn",
        fixed: true
      },
      {
        sortable: false,
        text: "Đối tượng nhận",
        value: "receiverType",
        class: "stickyCollumn",
        fixed: true
      },
      {
        sortable: false,
        text: "Mã công ty",
        value: "companyId"
      },
      {
        sortable: false,
        text: "Người nhận",
        value: "username",
        align: "center"
      },
      {
        text: "Mã công ty",
        value: "companyId"
      },
      {
        text: "Thời gian gửi",
        value: "sendTime"
      },
      {
        text: "Tiêu đề",
        value: "title"
      },
      {
        text: "Nội dung",
        value: "content"
      },
      {
        text: "icon",
        value: "iconURL"
      },
      {
        text: "Trạng thái",
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
    PendingItems: [],
    ListNoti: [],
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
      await this.getListComplaint(this.date);
    },

    async getListNoti(date) {
      let $this = this;

      $this.isLoadingDataDone = false;

      console.log("date: ", date)

      date = date.replace("-", "");

      $this.ListNoti = [];

      await $this.$axios
        .get("/api/admin/notifications/" + date)
        .then(function(response) {
          if (response.data.returnCode == 1) {
            response.data.data.forEach(element => {
              if (element.status == 2) $this.PendingItems.push(element);
              else $this.ConfirmedItems.push(element);
            });

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

  },
  created: async function() {
    this.getListNoti(this.date);
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
</style>
