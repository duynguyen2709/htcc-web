<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex md12>
        <material-card text>
          <v-dialog style="color: black; !important" ref="dialog" v-model="MonthPicker" :return-value.sync="month"
            width="290px">
            <v-date-picker class="dp" locale="vi-VN" v-model="month" type="month" @input="clickDatePicker">
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
                      <v-text-field v-model="month" label="Chọn một tháng" prepend-icon="event" readonly
                        style="margin-bottom: -22px !important;" @click.stop="MonthPicker=true"></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="12" sm="9">
                      <v-text-field v-model="searchPending" append-icon="search" label="Search" single-line
                        hide-details></v-text-field>
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

                  <template v-if=" PendingItems.length !== 0">
                    <v-data-table v-if="isLoadingDataDone" :headers="headersPending" :items="PendingItems"
                      :search="searchPending" hide-default-footer :page.sync="pagePending"
                      :items-per-page="itemsPerPage" @page-count="pageCountPending = $event">
                      <template v-slot:body="{ items }">
                        <tbody>
                          <tr v-for="item in items" :key="item.OrderId">
                            <td>{{ item.orderId }}</td>
                            <td class="text-center">{{ getDate(item.date) }}</td>

                            <td>{{ item.companyId }}</td>
                            <td>{{ item.email }}</td>
                            <td>{{ item.paymentName }}</td>
                            <td>{{ item.paymentId }}</td>
                            <td class="text-center">{{ getPaymentCycleType(item.paymentCycleType) }}</td>
                            <td>{{ item.comboName }}</td>
                            <td class="text-center">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-icon color="tertiary" v-on="on" @click.stop="showFeatureList(item)">
                                    mdi-format-list-bulleted
                                  </v-icon>
                                </template>
                                <span class="white--text">Xem danh sách chức năng</span>
                              </v-tooltip>
                            </td>
                            <td class="text-right">{{ $convertVND(item.totalPrice) }}</td>
                            <td class="text-right">{{ $convertVND(item.paidPrice) }}</td>
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
                      <v-text-field v-model="month" label="Chọn một tháng" prepend-icon="event" readonly
                        style="margin-bottom: -22px !important;" @click.stop="MonthPicker=true"></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="12" sm="9">
                      <v-text-field v-model="searchPending" append-icon="search" label="Search" single-line
                        hide-details></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-title>

                <div>
                  <div v-if="!isLoadingDataDone" class="text-center">
                    <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
                  </div>

                  <template v-if="isLoadingDataDone && ConfirmedItems.length === 0">
                    <div class="no-data">
                      <v-icon size="90">mdi-checkbox-blank-off</v-icon>
                      <p>Không có đơn hàng đã duyệt của tháng này</p>
                    </div>
                  </template>

                  <template v-if=" ConfirmedItems.length !== 0">
                    <v-data-table v-if="isLoadingDataDone" :headers="headersConfirmed" :items="ConfirmedItems"
                      :search="searchPending" hide-default-footer :page.sync="pagePending"
                      :items-per-page="itemsPerPage" @page-count="pageCountPending = $event">
                      <template v-slot:body="{ items }">
                        <tbody>
                          <tr v-for="item in items" :key="item.OrderId">
                            <td>{{ item.orderId }}</td>
                            <td class="text-center">{{ getDate(item.date) }}</td>

                            <td>{{ item.companyId }}</td>
                            <td>{{ item.email }}</td>
                            <td>{{ item.paymentName }}</td>
                            <td>{{ item.paymentId }}</td>
                            <td class="text-center">{{ getPaymentCycleType(item.paymentCycleType) }}</td>
                            <td>{{ item.comboName }}</td>
                            <td class="text-center">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-icon color="tertiary" v-on="on" @click.stop="showFeatureList(item)">
                                    mdi-format-list-bulleted
                                  </v-icon>
                                </template>
                                <span class="white--text">Xem danh sách chức năng</span>
                              </v-tooltip>
                            </td>
                            <td class="text-right">{{ $convertVND(item.totalPrice) }}</td>
                            <td class="text-right">{{ $convertVND(item.paidPrice) }}</td>
                            <td :class="getClassObjectStatus(item.orderStatus)" class="text-center">{{getStatus(item.orderStatus)}}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-data-table>
                    <v-pagination v-model="pagePending" :length="pageCountPending"></v-pagination>
                  </template>
                </div>
              </v-container>
            </v-tab-item>
          </v-tabs-items>

          <v-dialog width="530" v-model="EditDialog">
             <v-card>
              <v-card-title class="green white--text">Duyệt đơn hàng</v-card-title>

              <v-card-text class="mt-2 card-text">Bạn có chắc muốn duyệt đơn khiếu nại này?</v-card-text>

              <v-card-actions>
                <v-row
            align="center"
            justify="end"
          >
                  <v-btn color="green darken-1" text @click="editStatus" :loading="loadingConfirmEditDialog">Đồng ý
                  </v-btn>

                  <v-btn color="red darken-1" text @click="()=>{ConfirmDialog = false;}">Hủy</v-btn>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="ConfirmDialog" max-width="290">
            <v-card>
              <v-card-title class="green white--text">Cập nhập khiếu nại</v-card-title>

              <v-card-text class="mt-2">Bạn có chắc muốn cập nhập đơn khiếu nại này?</v-card-text>

              <v-card-actions>
                <v-row
            align="center"
            justify="end"
          >
                  <v-btn color="green darken-1" text @click="editStatus" :loading="loadingConfirmEditDialog">Đồng ý
                  </v-btn>

                  <v-btn color="red darken-1" text @click="()=>{ConfirmDialog = false;}">Hủy</v-btn>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-dialog>



          <v-dialog v-if="ChoosenItem" width="300" v-model="showListDialog">
            <v-card class="mx-auto" max-width="300" tile>
              <v-list rounded>
                <v-subheader>Danh sách chức năng</v-subheader>
                <v-list-item-group v-model="ChoosenItem" color="primary">
                  <v-list-item v-for="(item, i) in ChoosenItem.featureList" :key="i">
                    <v-list-item-content>
                      <v-list-item-title class="item-feature">
                        {{item}}
                        <!-- <template v-if="item.include('Quản lý nhân viên')">
                  : {{ChoosenItem.comboDetail.EMPLOYEE_MANAGE}} người
                </template> -->
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-dialog>

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
      isLoadingDataDone: false,

      /*content dialog*/
      ListContentDialog: false,
      ChoosenContents: [],

      showListDialog: false,

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

      headersPending: 
      [{
          text: "Mã đơn hàng",
          width: 200,
          align: "center"
        },
        {
          text: "Ngày thanh toán",
          width: 200,
          align: "center"
        },
        {
          sortable: false,
          text: "Mã công ty",
          width: 200,
          align: "center"
        },
        {
          sortable: false,
          text: "Email công ty",
          width: 300,
          align: "center"
        },
        {
          sortable: false,
          text: "Tên người thanh toán",
          width: 200,
          align: "center"
        },
        {
          sortable: false,
          text: "Mã thanh toán",
          width: 200,
          align: "center"
        },
        {
          sortable: false,
          text: "Loại thanh toán",
          width: 200,
          align: "center"
        },
        {
          sortable: false,
          text: "Tên gói",
          width: 100,
          align: "center"
        },
        {
          sortable: false,
          text: "Danh sách chức năng",
          width: 200,
          align: "center"
        },
        {
          sortable: false,
          text: "Tổng tiền",
          width: 150,
          align: "center"
        }, {
          sortable: false,
          text: "Số tiền đã thanh toán",
          width: 200,
          align: "center"
        }
      ],
      headersConfirmed: 
      [{
          text: "Mã đơn hàng",
          width: 200,
          align: "center"
        },
        {
          text: "Ngày thanh toán",
          width: 200,
          align: "center"
        },
        {
          sortable: false,
          text: "Mã công ty",
          width: 200,
          align: "center"
        },
        {
          sortable: false,
          text: "Email công ty",
          width: 300,
          align: "center"
        },
        {
          sortable: false,
          text: "Tên người thanh toán",
          width: 200,
          align: "center"
        },
        {
          sortable: false,
          text: "Mã thanh toán",
          width: 200,
          align: "center"
        },
        {
          sortable: false,
          text: "Loại thanh toán",
          width: 200,
          align: "center"
        },
        {
          sortable: false,
          text: "Tên gói",
          width: 100,
          align: "center"
        },
        {
          sortable: false,
          text: "Danh sách chức năng",
          width: 200,
          align: "center"
        },
        {
          sortable: false,
          text: "Tổng tiền",
          width: 150,
          align: "center"
        }, 
        {
          sortable: false,
          text: "Số tiền đã thanh toán",
          width: 200,
          align: "center"
        }, 
        {
          sortable: false,
          text: "Trạng thái",
          width: 150,
          align: "center"
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

      showFeatureList(item) {
        this.ChoosenItem = item;
        this.showListDialog = true;
      },

      getDate(date) {
        return date.substr(date.length - 2, date.length);
      },
      getPaymentCycleType(type) {
        return type == 1 ? 'Theo tháng' : 'Theo năm'
      },
      getStatus(status) {
        return status ? 'Thành công' : 'Hủy'
      },
      getClassObjectStatus(status) {
        return {
          'green--text': status,
          'red--text': !status
        }
      },

      MaxLengthContent(item) {
        return item.content.length > item.response.length ?
          item.content.length :
          item.response.length;
      },

      async clickDatePicker() {
        this.MonthPicker = false;
        this.$refs.dialog.save(this.month);
        console.log(this.month);
        await this.getListOrder(this.month);
      },

      editItem(item) {
        this.ChoosenItem = item;
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
          .catch(function (error) {
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
          .then(function (response) {
            if (response.data.returnCode == 1) {
              response.data.data.forEach(element => {
                if (element.orderStatus == 2) {
                  $this.PendingItems.push(element);
                } else { 
                  $this.ConfirmedItems.push(element);
                }
              });

              console.log("done data pending Order");
              console.log("$this response: ", response.data.data);
              $this.isLoadingDataDone = true;
            } else {
              console.log(
                "this error message Order: " + response.data.returnMessage
              );
            }
          })
          .catch(function (error) {
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
    created: async function () {
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

  .card-text {
    font-size: 20px;
    font-weight: bold;
    margin: 0 auto;
    width: fit-content;
    padding: 30px 0px !important;
  }

</style>
