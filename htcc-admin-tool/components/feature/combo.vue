<template>

  <material-card text>
    <v-card-title class="header-functions">
      <v-btn color="green white--text" to="/features/add">Thêm combo</v-btn>
      <v-text-field v-model="search" append-icon="search" label="Tìm kiếm" single-line hide-details></v-text-field>
    </v-card-title>
    <div>

      <div v-if="!isLoadingDataDone" class="text-center">
        <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
      </div>

      <v-data-table v-if="isLoadingDataDone" :headers="headers" :items="items" :search="search" hide-default-footer
        :page.sync="page" :items-per-page="itemsPerPage" @page-count="pageCount = $event">
        <template v-slot:header="{ props: { headers } }">
          <thead>
            <span class="subheading font-weight-light text--darken-3" v-text="headers.text" />
          </thead>
        </template>
        <template v-slot:body="{ items }">
          <tbody>
            <tr v-for="item in items" :key="item.comboId">
              <td>{{ item.comboId }}</td>
              <td>{{ item.comboName }}</td>
              <td>{{ item.discountPercentage }}</td>
              <td>{{ formatCurrency(item.totalPrice)}}</td>
              <td class="text-xs-right">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon color="tertiary" v-on="on" @click.stop="showFeatureList(item)">mdi-format-list-bulleted
                    </v-icon>
                  </template>
                  <span class="white--text">Xem danh sách chức năng</span>
                </v-tooltip>
              </td>
              <td class="text-xs-right">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon color="tertiary" v-on="on" @click.stop="goToEditPage(item.comboId)">edit
                    </v-icon>
                  </template>
                  <span class="white--text">Chỉnh sửa gói chức năng</span>
                </v-tooltip>
              </td>

              <td>
                
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon color="tertiary" v-on="on" @click.stop="ShowDeleteDialog(item)">mdi-account-remove
                    </v-icon>
                  </template>
                  <span class="white--text">Xóa gói chức năng</span>
                </v-tooltip>
              </td>

            </tr>
          </tbody>

          <v-dialog v-if="ChoosenItem" width="530" v-model="showListDialog">
            <v-card
      class="mx-auto"
      max-width="300"
      tile
    >
      <v-list rounded>
        <v-subheader>Danh sách chức năng</v-subheader>
        <v-list-item-group v-model="ChoosenItem" color="primary">
          <v-list-item
            v-for="(item, i) in getEnableFeature(ChoosenItem.comboDetail)"
            :key="i"
          >
            <v-list-item-content >
              <v-list-item-title class="item-feature">
                {{item}}
                <template v-if="item === 'Quản lý nhân viên'">
                  : {{ChoosenItem.comboDetail.EMPLOYEE_MANAGE}} người
                </template>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
          </v-dialog>

          <v-dialog width="530" v-model="editInfoForm">
            <material-card color="success" elevation="12" title="Cập nhập chức năng">
              <v-form ref="form">
                <v-card-text v-if="ChoosenItem !== null">
                  <v-row>
                    <v-col cols="6">
                      <v-text-field v-model="ChoosenItem.featureId" label="Mã chức năng" :readonly="true" />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field v-model="ChoosenItem.featureName" label="Tên chức năng" />
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="6">
                      <v-text-field v-model="ChoosenItem.unitPrice" label="Đơn giá" />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field v-model="ChoosenItem.displayScreen" label="Tên màn hình" :readonly="true" />
                    </v-col>
                  </v-row>

                  <v-radio-group label="Tính giá trên từng nhân viên" v-model="ChoosenItem.calcByEachEmployee">
                    <v-radio label="Không" value="0"></v-radio>
                    <v-radio label="Có" value="1"></v-radio>
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
              <v-card-title class="green white--text">Cập nhập chức năng</v-card-title>

              <v-card-text class="mt-2">Bạn có chắc muốn cập nhập chức năng này?</v-card-text>

              <v-card-actions>
                <v-btn color="green darken-1" text @click="editFeature(ChoosenItem)"
                  :loading="loadingConfirmEditDialog">Đồng ý</v-btn>

                <v-btn color="red darken-1" text @click="()=>{ConfirmDialog = false;}">Hủy</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="DeleteDialog" max-width="290">
                  <v-card>
                    <v-card-title class="green white--text">Xóa gói chức năng</v-card-title>

                    <v-card-text class="mt-2">Bạn có chắc muốn xóa gói chức năng này?</v-card-text>

                    <v-card-actions>
                      <v-btn
                        color="green darken-1"
                        text
                        @click="deleteCombo()"
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

      featureList: [],

      ChoosenItem: null,

      showListDialog: false,

      editInfoForm: false,
      editFormLoading: false,

      ConfirmDialog: false,
      loadingConfirmEditDialog: false,

      DeleteDialog:false,
      loadingBtnDelete: false,

      page: 1,
      pageCount: 0,
      itemsPerPage: 5,

      search: "",
      headers: [{
          sortable: false,
          text: "Mã"
        },
        {
          sortable: false,
          text: "Tên"
        },
        {
          text: "Giảm giá"
        },
        {
          text: "Tổng giá"
        }
      ],

      items: []
    }),
    methods: {
      ...mapActions({
        setInfo: "notification/setInfo"
      }),
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
        this.ChoosenItem = item;
        this.ChoosenItem.calcByEachEmployee += "";

        this.editInfoForm = true;
      },
      ShowDeleteDialog(item) {
      this.ChoosenItem = item;
      this.DeleteDialog = true;
    },
    deleteCombo() {
      this.$axios
        .delete("/api/admin/combos/" + this.ChoosenItem.comboId)
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
    },
    calTotalPrice(item) {
        const $this = this;
        let totalPrice = 0;

        const detail = item.comboDetail;
        const amountEmployee = parseInt(detail.EMPLOYEE_MANAGE);
        if(!amountEmployee) {
          return 0;
        }

        Object.keys(detail).forEach(element => {
                 if(element != 'EMPLOYEE_MANAGE' && detail[element]) {
                  totalPrice += $this.featureList.find(el => el.featureId === element).unitPrice;
                 }

               })

        totalPrice *= amountEmployee;

        return totalPrice*(100 - parseFloat(item.discountPercentage))/100;
      },
    goToEditPage(id) {
      this.$router.push({
        path: "/features/update/" + id
      });
    },
    showFeatureList(item) {
      this.ChoosenItem = item;
      this.showListDialog = true;
    },
    getEnableFeature(item){

      const result = [];
      Object.keys(item).forEach(element => {
        if(item[element]) {
          result.push(this.featureList.find(el=>el.featureId === element).featureName);
        }
      });

      console.log("result: ", result)

      return result;
    },
      async getFeatureComboList() {
        let $this = this;

        $this.isLoadingDataDone = false;

        await $this.$axios
          .get("/api/admin/combos")
          .then(function (response) {
            if (response.data.returnCode == 1) {
              $this.items = response.data.data;

              console.log("items combo:",$this.items);

              $this.items.forEach(el => {
                el["totalPrice"] = $this.calTotalPrice(el)
              })

              $this.isLoadingDataDone = true;

              console.log("item: ", $this.items);
            } else {
              $this.TriggerNotiError(res.data.returnMessage);
            }
          })
          .catch(function (error) {
            $this.TriggerNotiError("Error get feature combo");
          });
      },
      async getFeatureList() {
        let $this = this;

        $this.isLoadingDataDone = false;

        await $this.$axios
          .get("/api/admin/features")
          .then(function (response) {
            if (response.data.returnCode == 1) {
              $this.featureList = response.data.data;
              $this.isLoadingDataDone = true;
            } else {
              $this.TriggerNotiError(res.data.returnMessage);
            }
          })
          .catch(function (error) {
            $this.TriggerNotiError("Error get feature list");
          });
      },
      formatCurrency(money) {
        return this.$convertVND(money) + ' đồng';
      }
    },
    created: async function () {
      await this.getFeatureList();
      await this.getFeatureComboList();
    }
  };

</script>

<style scoped>
.item-feature {
  font-weight: bold;
}
.header-functions {
  display: block
}
</style>
