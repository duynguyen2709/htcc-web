<template>
  <material-card text>
    <v-card-title>
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
            <tr v-for="item in items" :key="item.companyName">
              <td>{{ item.featureId }}</td>
              <td>{{ item.featureName }}</td>
              <td>{{ item.unitPrice }}</td>
              <td style="text-align: center;">{{ item.calcByEachEmployee ? "Có" : "Không" }}</td>
              <td>{{ item.displayScreen }}</td>
              <td class="text-xs-right">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon color="tertiary" v-on="on" @click.stop="clickEditForm(item)">edit
                    </v-icon>
                  </template>
                  <span class="white--text">Chỉnh sửa chức năng</span>
                </v-tooltip>
              </td>

            </tr>
          </tbody>

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

      ChoosenItem: null,

      editInfoForm: false,
      editFormLoading: false,

      ConfirmDialog: false,
      loadingConfirmEditDialog: false,

      page: 1,
      pageCount: 0,
      itemsPerPage: 5,
      
      search: "",
      headers: [{
          sortable: false,
          text: "Mã",
          value: "featureId"
        },
        {
          sortable: false,
          text: "Tên",
          value: "featureName"
        },
        {
          text: "Đơn giá",
          value: "unitPrice"
        },
        {
          sortable: false,
          text: "Tính giá trên từng nhân viên",
          value: "calcByEachEmployee",
          align: "center"
        },
        {
          sortable: false,
          text: "Tên màn hình",
          value: "displayScreen"
        },

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
      async getFeatureList() {
        let $this = this;

        $this.isLoadingDataDone = false;

        await $this.$axios
          .get("/api/admin/features")
          .then(function (response) {
            if (response.data.returnCode == 1) {
              $this.items = response.data.data;
              $this.isLoadingDataDone = true;

              console.log("item: ", $this.items);
            } else {
              this.TriggerNotiError(res.data.returnMessage);
            }
          })
          .catch(function (error) {
            this.TriggerNotiError("Error get feature list");
          });
      },

      async editFeature(item) {
        let $this = this;

        this.loadingConfirmEditDialog = true;

        console.log("item: ", item);
        await this.$axios
          .put("/api/admin/features/" + item.featureId, {
            featureId: item.featureId,
            featureName: item.featureName,
            unitPrice: item.unitPrice,
            calcByEachEmployee: parseInt(item.calcByEachEmployee),
            linkedScreen: item.linkedScreen,
            displayScreen: item.displayScreen
          })
          .then(res => {
            if (res.data.returnCode != 1) {
              $this.TriggerNotiError(res.data.returnMessage);
            } else {
              $this.TriggerNoti(res.data.returnMessage);
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

        this.ConfirmDialog = false;
        this.editInfoForm = false;
      },
    },
    created: async function () {

      this.getFeatureList();
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
