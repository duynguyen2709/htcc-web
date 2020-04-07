<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex md12>
        <material-card text>
          <v-dialog style="color: black; !important" ref="dialog" v-model="MonthPicker" :return-value.sync="month"
            width="290px">
            <!-- <template v-slot:activator="{ on }">
              <v-text-field
                v-model="month"
                label="Chọn một tháng"
                prepend-icon="event"
                readonly
                v-on="on"
              ></v-text-field>
            </template>-->
            <v-date-picker class="dp" locale="vi-VN" v-model="month" type="month" @input="clickDatePicker">
              <!-- <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.dialog.save(date)">OK</v-btn>-->
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

                  <v-data-table v-if="isLoadingDataDone" :headers="headersPending" :items="PendingItems"
                    :search="searchPending" hide-default-footer :page.sync="pagePending" :items-per-page="itemsPerPage"
                    @page-count="pageCountPending = $event">



                    <template v-slot:no-data>Không có khiếu nại chưa giải quyết của tháng này</template>

                    <template v-if=" PendingItems.length !== 0" v-slot:body="{ items }">
                      <tbody>
                        <tr v-for="item in items" :key="item.ComplaintId">
                          <td>{{ item.category }}</td>
                          <td>{{ item.complaintId }}</td>
                          <td>{{ item.content }}</td>
                          <td>{{ item.time }}</td>
                          <td>{{ item.date }}</td>
                          <td class="width: 180px !important;">
                            <v-row>
                              <v-col v-for="img in item.images" :key="img" cols="4">
                                <v-img width="60px" :src="img" :lazy-src="LazyImg" @click="clickImg(img)">
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
                            <v-icon class="mr-2 justify-center align-center" @click="editItem(item)">mdi-pencil</v-icon>
                          </td>
                        </tr>
                      </tbody>
                    </template>


                    <!-- <template v-slot:item.actions="{ item }">
                      <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                    </template>-->
                  </v-data-table>
                  <v-pagination v-model="pagePending" :length="pageCountPending"></v-pagination>
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
                      <v-text-field v-model="searchConfirmed" append-icon="search" label="Search" single-line
                        hide-details></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-title>

                <div>
                  <v-data-table :headers="headersConfirmed" :items="ConfirmedItems" :search="searchConfirmed"
                    hide-default-footer :page.sync="pageConfirmed" :items-per-page="itemsPerPage"
                    @page-count="pageCountConfirmed = $event">
                    <template v-slot:no-data>Không có khiếu nại đã giải quyết của tháng này</template>

                    <template v-if="PendingItems.length !== 0" v-slot:body="{ items }">
                      <tbody>
                        <tr v-for="item in items" :key="item.ComplaintId">
                          <td>{{ item.category }}</td>
                          <td>{{ item.complaintId }}</td>
                          <td style="max-width: 300px;">{{ item.content }}</td>
                          <td>{{ item.time }}</td>
                          <td>{{ item.date }}</td>
                          <td class="width: 180px !important;">
                            <!-- <v-icon>image</v-icon> -->
                            <v-row>
                              <v-col v-for="img in item.images" :key="img" cols="4">
                                <v-img width="60px" :src="img" :lazy-src="LazyImg" @click="clickImg(img)">
                                  <template v-slot:placeholder>
                                    <v-row class="fill-height ma-0" align="center" justify="center">
                                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                    </v-row>
                                  </template>
                                </v-img>
                              </v-col>
                            </v-row>
                          </td>
                          <td>{{ item.response }}</td>
                          <td>{{ item.status }}</td>
                          <td>{{ item.sender }}</td>

                          <td class="justify-center align-center">
                            <v-icon class="mr-2 justify-center align-center" @click="editItem(item)">mdi-pencil</v-icon>
                          </td>
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
                  <v-text-field v-model="ChoosenItem.complaintId" label="Complaint Id" :readonly="true" />
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
                <v-btn color="green darken-1" text @click="editStatus" :loading="loadingConfirmEditDialog">Đồng ý
                </v-btn>

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

      /*complaint*/
      ListComplaint: [],

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
      headersPending: [{
          text: "Loại",
          value: "category",
          class: "stickyCollumn",
          fixed: true
        },
        {
          sortable: false,
          text: "Mã khiếu nại",
          value: "complaintId",
          class: "stickyCollumn",
          fixed: true
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
          value: "time"
        },
        {
          text: "Ngày gửi",
          value: "date"
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
          value: "sender"
        }
        // {
        //   text: "Chính sửa",
        //   value: "actions",
        //   sortable: false,
        //   align: "center"
        // }
      ],
      headersConfirmed: [{
          text: "Loại",
          value: "category",
          class: "stickyCollumn",
          fixed: true
        },
        {
          sortable: false,
          text: "ComplaintId",
          value: "complaintId",
          class: "stickyCollumn",
          fixed: true
        },
        {
          sortable: false,
          text: "Nội dung",
          value: "content",
          width: "300"
        },
        {
          text: "Thời gian",
          value: "time"
        },
        {
          text: "Ngày gửi",
          value: "date"
        },
        {
          sortable: false,
          text: "Hình ảnh",
          value: "images"
        },
        {
          sortable: false,
          text: "Ghi chú",
          value: "response"
        },
        {
          sortable: false,
          text: "Trạng thái",
          value: "status"
        },
        {
          sortable: false,
          text: "Người gửi",
          value: "sender"
        }
      ],
      PendingItems: [],
      ConfirmedItems: [],
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

      async clickDatePicker() {
        this.MonthPicker = false;
        this.$refs.dialog.save(this.month);
        console.log(this.month);
        await this.getListComplaint(this.month);
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
          .put("/api/admin/complaint/status", {
            complaintId: this.ChoosenItem.complaintId,
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
                $this.setAmountComplaint(this.amountComplaint - 1);
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

      async getListComplaint(month) {
        let $this = this;

        $this.isLoadingDataDone = false;

        month = month.replace("-", "");
        

        $this.PendingItems = [];
        $this.ConfirmedItems = [];

        await $this.$axios
          .get("/api/admin/complaint/" + month)
          .then(function (response) {
            if (response.data.returnCode == 1) {
              //$this.items = response.data.data;
              //console.log("this admins: " + JSON.stringify($this.items));
              response.data.data.forEach(element => {
                if (element.status == 2) $this.PendingItems.push(element);
                else $this.ConfirmedItems.push(element);
              });

              console.log("done data pending complaint")
              $this.isLoadingDataDone = true;
            } else {
              console.log(
                "this error message complaint: " + response.data.returnMessage
              );
            }
          })
          .catch(function (error) {
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
      }
    },
    created: async function () {
      this.getListComplaint(this.month);
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
