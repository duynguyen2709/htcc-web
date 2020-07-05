<template>
  <v-flex xs12>
    <v-btn color="#4caf50" class="white--text ml-4" @click="$router.go(-1)">Quay lại</v-btn>
    <material-card color="primary" elevation="12" title="Thêm gói chức năng">
      <!-- <v-card> -->
      <v-form ref="form" @submit.prevent v-model="isValid">
        <v-card-text>
          <div class="wrapper">
            <div class="wrapper-select">
              <template style="display: block;" v-for="(item, i) in featureList">
                <v-list-item :key="`item-${i}`" :value="item" active-class="deep-purple--text text--accent-4">

                  <v-list-item-content>
                    <v-list-item-title v-text="item.featureName"></v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-text-field
                      class="input-number" 
                      v-if="item.featureId === 'EMPLOYEE_MANAGE'" 
                      v-model="amountEmployee" 
                      :rules="[rules.onlyNumber]"
                      @change="calTotalPrice"/>
                    <v-checkbox 
                      v-else v-model="selectedItems" 
                      :value="item.featureId" 
                      @change="calTotalPrice">
                    </v-checkbox>
                  </v-list-item-action>

                </v-list-item>
              </template>
            </div>

            <div class="wrapper-input">
              <v-text-field readonly label="Mã gói" class="green-input input-file" v-model="idCombo"
                :rules="[rules.required]" />

              <v-text-field label="Tên gói" class="green-input input-file" v-model="nameCombo"
                :rules="[rules.required]" />

              <v-text-field label="Giảm giá (%)" class="green-input input-file" v-model="discount"
                :rules="[rules.required, rules.percent, rules.floatNumber]" @change="calTotalPrice"/>

              <v-text-field readonly label="Tổng cộng" class="green-input input-file" v-model="fTotalPrice"
                :rules="[rules.required]" />

            </div>
          </div>

        </v-card-text>
        <v-card-actions>
          <v-btn
            :disabled="!isValid"
            color="green" class="mx-auto d-block white--text" @click="ConfirmDialog = true">Cập nhập</v-btn>
        </v-card-actions>
      </v-form>
    </material-card>

    <v-dialog v-model="ConfirmDialog" max-width="290">
      <v-card>
        <v-card-title class="green white--text">Thêm icon</v-card-title>

        <v-card-text class="mt-2">Bạn có chắc muốn cập nhập gói chức năng này?</v-card-text>

        <v-card-actions>
          <v-btn color="green darken-1" text @click="add" :loading="loadingBtnConfirm">Đồng ý</v-btn>

          <v-btn color="red darken-1" text @click="ConfirmDialog = false">Hủy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-flex>


</template>

<style>
  .img-logo {
    max-width: 300px;
    max-height: 300px;
    margin: 0 auto;
  }

  .input-file {

    padding-top: 50px;
    width: 600px;
    margin: 0 auto;
  }

  .hidden {
    display: none !important;
  }

  .wrapper {
    display: flex;
    flex-direction: row-reverse;
  }

  .wrapper-select {
    flex-grow: 1;
  }

  .wrapper-input {
    padding-right: 30px;
  }

  .wrapper-input div {
    max-width: 550px;
  }

  .v-list-item__content {
    padding: 2px 0px !important;
  }

  .input-number {
    padding-bottom: 10px;
  }

</style>

<script>
  import {
    mapGetters
  } from "vuex";
  import {
    mapActions
  } from "vuex";
  import numeral from "numeral";
  import materialCard from "~/components/material/AppCard";
  import editForm from "~/components/material/AppFormEdit";

  export default {
    layout: "dashboard",
    components: {
      materialCard,
      editForm
    },
    data: () => ({
      featureList: [],
      selectedItems: [],
      amountEmployee: 0,

      totalPrice: "",

      idCombo: "",
      nameCombo: "",
      discount: 0,

      isValid: false,

      ConfirmDialog: false,
      loadingBtnConfirm: false,

      rules: {
        required: value => !!value || "Không được để trống",
        percent: value => {
           
            return (value <= 100 && value >= 0) || "Không hợp lệ, phải nằm trong khoảng từ 0 đến 100"
          },
        onlyNumber:  value => {
          const pattern = /^\d*$/;
          return (
            pattern.test(value) ||
            "chỉ được kí tự số"
          );
          
        },
        floatNumber: value => {
            // const pattern = /?\d+(\.\d+)?$/;
             const pattern = /\d+(\.\d+)?$/;
           return (
            pattern.test(value) ||
            "Không đúng định dạng"
          );
          }
      },

      isLoading: false
    }),
    computed: {
      fTotalPrice: {
        // getter
        get: function () {
          return this.$convertVND(this.totalPrice) + ' đồng';
        },
        // setter
        set: function (newValue) {
          this.totalPrice = newValue
        }
      }
    },
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
              this.TriggerNotiError(res.data.returnMessage);
            }
          })
          .catch(function (error) {
            this.TriggerNotiError("Error get feature list");
          });
      },

      convertToComboDetail() {
        const result = {};

        result["EMPLOYEE_MANAGE"] = this.amountEmployee;

        const flist = this.featureList;

        for(let i = 0; i < flist.length; i++) {
          if(flist[i].featureId === 'EMPLOYEE_MANAGE') {
            continue;
          } else if(this.selectedItems.includes(flist[i].featureId)) {
            result[flist[i].featureId] = true;
          } else {
            result[flist[i].featureId] = false;
          }
        }

        return result;
      },

      calTotalPrice() {
        this.totalPrice = 0;
        if(!this.amountEmployee) {
          console.log("empty employee");
          this.totalPrice = 0;
          return;
        }

        for(let i = 0; i < this.selectedItems.length; i++) {
          this.totalPrice = parseInt(this.totalPrice);
          this.totalPrice += this.featureList.find(el => el.featureId === this.selectedItems[i]).unitPrice*this.amountEmployee;
        }

        this.totalPrice = this.totalPrice*(100 - parseFloat(this.discount))/100;
      },

      async add(e) {
        this.loadingBtnConfirm = true;
        this.isLoading = true;
        let $this = this;
        await $this.$axios
          .put("/api/admin/combos/" + $this.idCombo, {
             "comboDetail": this.convertToComboDetail(),
              "comboId": this.idCombo,
              "comboName": this.nameCombo,
              "discountPercentage": parseFloat(this.discount),
              "totalPrice": this.totalPrice
          })
          .then(res => {
            if (res.data.returnCode != 1) {
              $this.TriggerNotiError(res.data.returnMessage);
            } else {
              $this.TriggerNoti(res.data.returnMessage);
              this.$router.push({
                path: "/features/"
              });
            }
          })
          .catch(function (error) {
            $this.TriggerNotiError(error.data);
          });

        this.isLoading = false;
      },
      async getFeatureComboList() {
        let $this = this;

        $this.isLoading = false;

        await $this.$axios
          .get("/api/admin/combos")
          .then(function (response) {
            if (response.data.returnCode == 1) {
              const item = response.data.data.find(el => el.comboId === $this.idCombo);

              $this.nameCombo = item.comboName;
              $this.discount = item.discountPercentage;
              
              

              const detail = item.comboDetail;
               Object.keys(detail).forEach(element => {
                 if(element === 'EMPLOYEE_MANAGE') {
                   $this.amountEmployee = detail[element];
                 } else if(detail[element]){
                   $this.selectedItems.push(element);
                 }

               })

               console.log("this selected: ", $this.selectedItems);

               $this.calTotalPrice();

              $this.isLoading = true;
            } else {
              $this.TriggerNotiError(res.data.returnMessage);
            }
          })
          .catch(function (error) {
            $this.TriggerNotiError("Error get feature list");
          });
      },

      checkFeature() {
        console.log(this.convertToComboDetail());
      }
    },
    created: async function () {
      this.idCombo = this.$route.params.id;
      this.getFeatureList();
      this.getFeatureComboList();
    }
  };

</script>
