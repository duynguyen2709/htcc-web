<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex md12>
        <material-card text>
          <v-dialog
            style="color: black; !important"
            ref="dialog"
            v-model="MonthPicker"
            :return-value.sync="month"
            width="290px"
          >
            <v-date-picker
              class="dp"
              locale="vi-VN"
              v-model="month"
              type="month"
              @input="clickDatePicker"
            >
            </v-date-picker>
          </v-dialog>

          <v-tabs v-model="tab">
            <v-tab key="Pending">Chưa xử lý</v-tab>
            <v-tab key="Confirmed">Đã xử lý</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item key="Pending">
              <v-container>
                <v-card-title>
                  <v-row align="center">
                    <v-col class="d-flex" cols="12" sm="3">
                      <v-text-field
                        v-model="month"
                        label="Chọn một tháng"
                        prepend-icon="event"
                        readonly
                        style="margin-bottom: -22px !important;"
                        @click.stop="MonthPicker=true"
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="12" sm="9">
                      <v-text-field
                        v-model="searchPending"
                        append-icon="search"
                        label="Search"
                        single-line
                        hide-details
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-title>

                <div>
                  <div v-if="!isLoadingDataDone" class="text-center">
                    <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
                  </div>

                  <template v-if="isLoadingDataDone && PendingItems.length === 0">
                    <div class="no-data">
                      <v-icon size="90">mdi-checkbox-blank-off</v-icon>
                      <p>Không có đơn hàng chưa giải quyết của tháng này</p>
                    </div>
                  </template>

                  <template  v-if=" PendingItems.length !== 0">
                  <v-data-table
                    v-if="isLoadingDataDone"
                    :headers="headersPending"
                    :items="PendingItems"
                    :search="searchPending"
                    hide-default-footer
                    :page.sync="pagePending"
                    :items-per-page="itemsPerPage"
                    @page-count="pageCountPending = $event"
                  >
                    <template v-slot:body="{ items }">
                      <tbody>
                        <tr v-for="item in items" :key="item.OrderId">
                          <td>{{ item.category }}</td>
                          <td>{{ item.OrderId }}</td>
                          <td>
                            <v-row>
                              <v-col cols="12">
                                <v-row>
                                  <v-col cols="11">{{ item.content[item.content.length - 1] }}</v-col>

                                  <v-col cols="1" v-if="item.content.length > 1">
                                    <v-tooltip bottom>
                                      <template v-slot:activator="{ on }">
                                        <v-icon
                                          color="tertiary"
                                          v-on="on"
                                          @click="clickListContent(item)"
                                        >mdi-chevron-down</v-icon>
                                      </template>
                                      <span class="white--text">Xem lịch sử khiếu nại</span>
                                    </v-tooltip>
                                  </v-col>
                                </v-row>
                              </v-col>
                            </v-row>
                          </td>
                          <td>{{ item.time }}</td>
                          <td>{{ item.date }}</td>
                          <td class="max-width: 180px !important;">
                            <v-row>
                              <v-col v-for="img in item.images" :key="img" cols="4">
                                <v-img
                                  width="60px"
                                  :src="img"
                                  :lazy-src="LazyImg"
                                  @click="clickImg(img)"
                                >
                                  <template v-slot:placeholder>
                                    <v-row class="fill-height ma-0" align="center" justify="center">
                                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                    </v-row>
                                  </template>
                                </v-img>
                              </v-col>
                            </v-row>
                          </td>
                          <td>{{ item.sender }}</td>

                          <td class="justify-center align-center">
                            <v-icon
                              class="mr-2 justify-center align-center"
                              @click="editItem(item)"
                            >mdi-pencil</v-icon>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-data-table>
                  <v-pagination v-model="pagePending" :length="pageCountPending"></v-pagination>
                  </template>
              </div>
              </v-container>
            </v-tab-item>
            <v-tab-item key="Confirmed">
              <v-container>
                <v-card-title>
                  <v-row align="center">
                    <v-col class="d-flex" cols="12" sm="3">
                      <v-text-field
                        v-model="month"
                        label="Chọn một tháng"
                        prepend-icon="event"
                        readonly
                        style="margin-bottom: -22px !important;"
                        @click.stop="MonthPicker=true"
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="12" sm="9">
                      <v-text-field
                        v-model="searchConfirmed"
                        append-icon="search"
                        label="Search"
                        single-line
                        hide-details
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-title>

                <div>
                  <template v-if=" PendingItems.length === 0">
                    <div class="no-data">
                      <v-icon size="90">mdi-checkbox-blank-off</v-icon>
                      <p>Không có đơn hàng chưa giải quyết của tháng này</p>
                    </div>
                  </template>

                  <template v-if="ConfirmedItems.length !== 0">
                  <v-data-table
                    :headers="headersConfirmed"
                    :items="ConfirmedItems"
                    :search="searchConfirmed"
                    hide-default-footer
                    :page.sync="pageConfirmed"
                    :items-per-page="itemsPerPage"
                    @page-count="pageCountConfirmed = $event"
                  >
                    <template  v-slot:body="{ items }">
                      <tbody>
                        <tr v-for="item in items" :key="item.OrderId">
                          <td>{{ item.category }}</td>
                          <td>{{ item.OrderId }}</td>

                          <td
                            style="max-width: 300px;"
                          >{{ item.content[MaxLengthContent(item) - 1] }}</td>
                          <td style="max-width: 350px;">
                            <v-row>
                              <v-col cols="12">
                                <v-row>
                                  <v-col cols="11">{{ item.response[MaxLengthContent(item) - 1] }}</v-col>

                                  <v-col cols="1" v-if="item.content.length > 1">
                                    <v-tooltip bottom>
                                      <template v-slot:activator="{ on }">
                                        <v-icon
                                          color="tertiary"
                                          v-on="on"
                                          @click="clickListConfirmedContent(item)"
                                        >mdi-chevron-down</v-icon>
                                      </template>
                                      <span class="white--text">Xem lịch sử khiếu nại</span>
                                    </v-tooltip>
                                  </v-col>
                                </v-row>
                              </v-col>
                            </v-row>
                          </td>

                          <td class="max-width: 180px !important;">{{ item.time }}</td>
                          <td>{{ item.date }}</td>
                          <td class="max-width: 180px !important;">
                            <v-row>
                              <v-col v-for="img in item.images" :key="img" cols="4">
                                <v-img
                                  width="60px"
                                  :src="img"
                                  :lazy-src="LazyImg"
                                  @click="clickImg(img)"
                                >
                                  <template v-slot:placeholder>
                                    <v-row class="fill-height ma-0" align="center" justify="center">
                                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                    </v-row>
                                  </template>
                                </v-img>
                              </v-col>
                            </v-row>
                          </td>
                          <td>
                            <p
                              class="font-weight-black"
                              v-bind:class="{'green--text': (item.status == '1'), 'red--text': (item.status == '0')}"
                              style="margin-bottom: 0px !important"
                            >{{item.status != 0 ? 'Đã xử lý' : 'Từ chối xử lý'}}</p>
                          </td>
                          <td>{{ item.sender }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-data-table>
                  <v-pagination v-model="pageConfirmed" :length="pageCountConfirmed"></v-pagination>
                  </template>
                </div>
              </v-container>
            </v-tab-item>
          </v-tabs-items>

          <v-dialog width="530" v-model="EditDialog">
            <material-card color="success" elevation="12" title="Cập nhập khiếu nại">
              <v-form ref="form">
                <v-card-text v-if="ChoosenItem !== null">
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="ChoosenItem.category"
                        label="Danh mục"
                        :readonly="true"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="ChoosenItem.OrderId"
                        label="Mã khiếu nại"
                        :readonly="true"
                      />
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="ChoosenItem.content"
                        label="Nội dung"
                        :readonly="true"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field v-model="ChoosenItem.date" label="Ngày" :readonly="true" />
                    </v-col>
                  </v-row>
                  <v-textarea rows="3" v-model="ChoosenItem.response" label="Ghi chú"></v-textarea>

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

    /*month picker*/
    MonthPicker: false,
    month: new Date().toISOString().substr(0, 7),

    tab: null,

    /*edit*/

    EditDialog: false,
    loadingEditDialog: false,
    ChoosenItem: null,
    response: "",
    status: 1,

    ConfirmDialog: false,
    loadingConfirmEditDialog: false,

    /*Order*/
    ListOrder: [],

    searchPending: "",

    searchConfirmed: "",

    pagePending: 1,
    pageCountPending: 0,

    pageConfirmed: 1,
    pageCountConfirmed: 0,

    itemsPerPage: 5,
    dialog: false,
    btnLock: true,
    search: "",
    headersPending: [
      {
        text: "Loại",
        value: "category",
        class: "stickyCollumn",
        fixed: true,
        width: 120
      },
      {
        sortable: false,
        text: "Mã khiếu nại",
        value: "OrderId",
        class: "stickyCollumn",
        fixed: true,
        width: 160
      },
      {
        sortable: false,
        text: "Nội dung",
        value: "content",
        align: "center",
        width: "300"
      },
      {
        text: "Thời gian",
        value: "time",
        width: 130
      },
      {
        text: "Ngày gửi",
        value: "date",
        width: 130
      },
      {
        sortable: false,
        text: "Hình ảnh",
        value: "images",
        align: "center",
        width: "180"
      },
      {
        sortable: false,
        text: "Người gửi",
        value: "sender",
        width: 110
      }
      // {
      //   text: "Chính sửa",
      //   value: "actions",
      //   sortable: false,
      //   align: "center"
      // }
    ],
    headersConfirmed: [
      {
        text: "Loại",
        value: "category",
        class: "stickyCollumn",
        fixed: true,
        width: 120
      },
      {
        sortable: false,
        text: "Mã khiếu nại",
        value: "OrderId",
        class: "stickyCollumn",
        fixed: true,
        width: 160
      },
      {
        sortable: false,
        text: "Nội dung",
        align: "center",
        width: "300"
      },
      {
        sortable: false,
        text: "Ghi chú",
        value: "response",
        align: "center",
        width: "350"
      },
      {
        text: "Thời gian",
        value: "time",
        width: 130
      },
      {
        text: "Ngày gửi",
        value: "date",
        width: 130
      },
      {
        sortable: false,
        text: "Hình ảnh",
        value: "images",
        align: "center",
        width: 180
      },
      {
        sortable: false,
        text: "Trạng thái",
        value: "status",
        width: 140
      },
      {
        sortable: false,
        text: "Người gửi",
        value: "sender",
        width: 110
      }
    ],
    PendingItems: [],
    ConfirmedItems: [],
    ChoosenItems: []
  }),
  computed: {
    ...mapGetters({
      amountOrder: "Order/getAmount"
    })
  },
  methods: {
    ...mapActions({
      setInfo: "notification/setInfo",
      setAmountOrder: "Order/setAmount"
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
      this.MonthPicker = false;
      this.$refs.dialog.save(this.month);
      console.log(this.month);
      await this.getListOrder(this.month);
    },

    editItem(item) {
      this.ChoosenItem = item;
      this.ChoosenItem.response = "";
      this.ChoosenItem.status = "1";
      this.EditDialog = true;
    },
    async editStatus() {
      let $this = this;

      this.loadingConfirmEditDialog = true;
      await this.$axios
        .put("/api/admin/Order/status", {
          OrderId: this.ChoosenItem.OrderId,
          response: this.ChoosenItem.response,
          status: this.ChoosenItem.status,
          yyyyMM: this.month.replace("-", "")
        })
        .then(res => {
          if (res.data.returnCode != 1) {
            $this.TriggerNotiError(res.data.returnMessage);
          } else {
            $this.TriggerNoti(res.data.returnMessage);
            let currentMonth = new Date().toISOString().substr(0, 7);
            if (this.month == currentMonth) {
              $this.setAmountOrder(this.amountOrder - 1);
            }
          }

          $this.loadingConfirmEditDialog = false;
        })
        .catch(function(error) {
          //handle error
          $this.loadingConfirmEditDialog = false;
          console.log("Error:");
          console.log(error);
          this.TriggerNotiError(error);
        });

      var index = this.PendingItems.indexOf(this.ChoosenItem);
      if (index !== -1) this.PendingItems.splice(index, 1);

      this.ConfirmedItems.push(this.ChoosenItem);

      this.ConfirmDialog = false;
      this.EditDialog = false;
    },
    deleteItem(item) {},

    async getListOrder(month) {
      let $this = this;

      $this.isLoadingDataDone = false;

      month = month.replace("-", "");

      $this.PendingItems = [];
      $this.ConfirmedItems = [];

      await $this.$axios
        .get("/api/admin/orders/" + month)
        .then(function(response) {
          if (response.data.returnCode == 1) {
            response.data.data.forEach(element => {
              if (element.status == 2) $this.PendingItems.push(element);
              else $this.ConfirmedItems.push(element);
            });

            console.log("done data pending Order");
            $this.isLoadingDataDone = true;
          } else {
            console.log(
              "this error message Order: " + response.data.returnMessage
            );
          }
        })
        .catch(function(error) {
          console.log("Error get list Order:");
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

    clickListConfirmedContent(item) {
      this.ListContentDialog = true;
      this.ChoosenContents = [];

      let i = 0;
      console.log("size response: " + item.response.length);
      console.log(item.content);
      for (; i < item.response.length; i++) {
        let temp = {
          content: item.content[i],
          response: item.response[i] || ""
        };
        this.ChoosenContents.push(temp);
      }
    }
  },
  created: async function() {
    this.getListOrder(this.month);
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

.two-text-field {
  display: flex;
}

.v-card__text {
  padding: 0px !important;
}

.v-messages {
  min-height: 0px !important;
}
</style>
