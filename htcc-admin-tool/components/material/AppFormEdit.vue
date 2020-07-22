<template>
  <material-card color="primary" :title="title" :text="text">
    <v-form ref="form" v-model="isValid">
      <v-container py-0>
        <v-layout wrap>
          <v-avatar v-if="thisUser.avatar" slot="offset" class="mx-auto d-block" size="130">
            <v-img :src="thisUser.avatar" lazy-src="/vuetifylogo.png">
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-avatar>
          <v-flex v-if="thisUser.avatar" xs12 md12>
            <v-dialog width="530" v-model="dialog">
              <template v-slot:activator="{ on }">
                <v-btn color="green" class="mx-auto d-block white--text" v-on="on">Đổi ảnh đại diện</v-btn>
              </template>

              <material-card color="primary" elevation="12" title="Đổi ảnh đại diện">
                <v-form ref="form" @submit.prevent>
                  <v-card-text>
                    <v-avatar slot="offset" class="mx-auto d-block" size="130">

                      <v-img :src="thisUser.avatar" lazy-src="/vuetifylogo.png">
                        <template v-slot:placeholder>
                          <v-row class="fill-height ma-0" align="center" justify="center">
                            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                          </v-row>
                        </template>

                      </v-img>
                    </v-avatar>
                    <v-file-input
                      v-model="file"
                      ref="InputAvatar"
                      chips
                      label="Chọn ảnh đại diện"
                      @change="onFilePicked"
                      accept="image/png, image/jpeg, image/bmp"
                    ></v-file-input>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn :loading="isLoadingBtnSave" :disabled="!file" color="green" class="mx-auto d-block white--text" @click="saveAvatar">Lưu</v-btn>
                    <v-btn
                      color="red"
                      class="mx-auto d-block white--text"
                      @click="pressCancelAvatar"
                    >Hủy</v-btn>
                  </v-card-actions>
                </v-form>
              </material-card>
            </v-dialog>
          </v-flex>
          <v-flex v-if="CompanyIdNotEdit" xs12 md12>
            <v-text-field
              label="Mã công ty"
              class="green-input"
              readonly
              v-model="CompanyIdNotEdit"
            />
          </v-flex>
          <v-flex v-if="thisUsername" xs12 md12>
            <v-text-field
              label="Tên đăng nhập"
              class="green-input"
              :rules="[rules.required]"
              v-model="thisUser.username"
            />
          </v-flex>
          <v-flex v-if="thisUsernameNotEdit" xs12 md12>
            <v-text-field
              label="Tên đăng nhập"
              class="green-input"
              readonly
              v-model="thisUsernameNotEdit"
            />
          </v-flex>
          <v-flex v-if="thisPassword" xs12 md12>
            <v-text-field
              label="Mật khẩu"
              class="green-input"
              :rules="[rules.required, rules.password]"
              v-model="thisUser.password"
              :append-icon="ShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="ShowPassword = !ShowPassword"
              :type="ShowPassword ? 'text' : 'password'"
            />
          </v-flex>
          <v-flex v-if="thisPassword" xs12 md12>
            <v-text-field
              label="Xác thực mật khẩu"
              class="green-input"
              :rules="[rules.required, rules.PasswordConfirm]"
              v-model="PasswordConfirm"
              :append-icon="ShowPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="ShowPasswordConfirm = !ShowPasswordConfirm"
              :type="ShowPasswordConfirm ? 'text' : 'password'"
            />
          </v-flex>
          <v-flex v-if="!isCompany" xs12 md12>
            <v-text-field
              label="Email"
              class="green-input"
              :rules="[rules.required, rules.email]"
              v-model="thisUser.email"
            />
          </v-flex>
          <v-flex v-if="!isCompany && !NoFullName" xs12 md12>
            <v-text-field
              label="Tên đầy đủ"
              class="green-input"
              :rules="[rules.required]"
              v-model="thisUser.fullName"
            />
          </v-flex>
          <v-flex v-if="!isCompany" xs12 md12>
            <v-text-field
              label="Số điện thoại"
              class="green-input"
              :rules="[rules.required, rules.phone]"
              v-model="thisUser.phoneNumber"
            />
          </v-flex>
          <v-flex v-if="thisUser.role" xs12 md6></v-flex>
          <v-flex v-if="thisUser.status" xs12 md6>
            <v-icon
              color="tertiary"
              @click="thisUser.status=!thisUser.status"
            >{{thisUser.status ? 'lock' : 'lock_open'}}</v-icon>
          </v-flex>

          <!-- For company -->
          <v-flex v-if="isCompany && !companyIdNoEdit" xs12 md12>
            <v-text-field
              label="Mã công ty"
              class="green-input"
              :rules="[rules.required]"
              v-model="thisCompany.companyId"
            />
          </v-flex>
          <v-flex v-if="isCompany && companyIdNoEdit" xs12 md12>
            <v-text-field
              label="Mã công ty"
              class="green-input"
              readonly
              v-model="companyIdNoEdit"
            />
          </v-flex>
          <v-flex v-if="isCompany && !NoFullName" xs12 md12>
            <!-- <v-flex  xs12 md12> -->
            <v-text-field
              label="Tên công ty"
              class="green-input"
              :rules="[rules.required]"
              v-model="thisCompany.companyName"
            />
          </v-flex>
          
          <v-flex v-if="isCompany" xs12 md12>
            <v-text-field
              label="Email"
              class="green-input"
              :rules="[rules.required, rules.email]"
              v-model="thisCompany.email"
            />
          </v-flex>
          <v-flex v-if="isCompany" xs12 md12>
            <v-text-field
              label="Số điện thoại"
              class="green-input"
              :rules="[rules.required, rules.phone]"
              v-model="thisCompany.phoneNumber"
            />
          </v-flex>
          <v-flex v-if="isCompany" xs12 md12>
            <v-text-field
              label="Địa chỉ"
              class="green-input"
              :rules="[rules.required]"
              v-model="thisCompany.address"
            />
          </v-flex>

        </v-layout>
      </v-container>

      <v-flex xs12 text-xs-right>
        <v-btn v-if="!isCompany"
          :disabled="!isValid"
          :loading="loading"
          class="mx-0 font-weight-light"
          color="success"
          @click.prevent="$emit('OnClickEdit', {user: thisUser})"
        >{{btn || OK}}</v-btn>
        <v-btn v-if="isCompany"
          :disabled="!isValid"
          :loading="loading"
          class="mx-0 font-weight-light"
          color="success"
          @click.prevent="$emit('OnClickEdit', {company: thisCompany})"
        >{{btn || OK}}</v-btn>
      </v-flex>
    </v-form>
  </material-card>
</template>

<style scoped>
.image-loading {
  filter: blur(8px);
  -webkit-filter: blur(8px);
}
</style>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import materialCard from "~/components/material/AppCard";
export default {
  components: {
    materialCard
  },
  props: {
    fullName: {
      type: String,
      required: false,
    },
    NoFullName: {
      type: Boolean,
      required: false
    },
    phoneNumber: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: false
    },
    username: {
      type: Boolean,
      required: false,
      default: false
    },
    password: {
      type: Boolean,
      required: false,
      default: false
    },
    role: {
      type: Number,
      required: false
    },
    status: {
      type: Number,
      required: false
    },
    avatar: {
      type: String,
      required: false
    },
    btn: {
      type: String,
      required: false
    },
    loading: {
      type: Boolean,
      required: false
    },
    CompanyIdNotEdit: {
      type: String,
      required: false
    },
    usernameNotEdit: {
      type: String,
      required: false
    },
    address: {
      type: String,
      required: false
    },
    companyId: {
      type: String,
      required: false,
      default: ''
    },
    companyIdNoEdit: {
      type: String,
      required: false
    },
    isCompany: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      /*image*/
      isLoading: true,
      imageFile: "",
      dialog: false,
      file: null,
      isLoadingBtnSave: false,

      thisUsername: this.username,
      thisPassword: this.password,

      thisUsernameNotEdit: this.usernameNotEdit,
      readonly: false,

      thisUser: {
        fullName: this.fullName,
        phoneNumber: this.phoneNumber,
        email: this.email,
        username: "",
        password: "",
        role: this.role || null,
        status: this.status || null,
        //avatar: "https://i.pinimg.com/originals/0d/36/e7/0d36e7a476b06333d9fe9960572b66b9.jpg"
        avatar: this.avatar || null
      },

      thisCompany: {
        companyName: this.fullName,
        companyId: this.companyId,
        phoneNumber: this.phoneNumber,
        email: this.email,
        status: this.status || null,
        address: this.address
      },

      ShowPassword: false,
      ShowPasswordConfirm: false,
      PasswordConfirm: "",
      is_loading_local: this.loading,

      isValid: true,

      rules: {
        required: value => !!value || "Không được để trống",
        //counter: value => value.length <= 20 || "Max 20 characters",
        email: value => {
          const pattern = /^[a-z0-9][a-z0-9_\.]{0,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/;
          return pattern.test(value) || "Email không hợp lệ.";
        },
        phone: value => {
          const pattern = /(09|01[2|6|8|9]|03)+([0-9]{8,})\b/g;
          return pattern.test(value) || "Số điện thoại không hợp lệ.";
        },
        password: value => {
          const pattern = /(?=.*[0-9])(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*()]{7,}$/;
          return (
            pattern.test(value) ||
            "Mật khẩu chưa hợp lệ, phải dài ít nhất 7  kí tự và chứa ít nhất 1 chữ số và kí tự đặc biệt !@#$%^&*"
          );
        },
        PasswordConfirm: value => {
          return (
            value == this.thisUser.password || "Mật khẩu mới không trùng khớp"
          );
        }
      }
    };
  },
  computed: {
    isFormValid: function() {
      if (!this.$refs.form.validate()) return false;
      return true;
    }
  },
  watch: {
    fullName: function(val) {
      this.thisUser.fullName = val;
      this.thisCompany.companyName = val;
    },
    phoneNumber: function(val) {
      this.thisUser.phoneNumber = val;
      this.thisCompany.phoneNumber = val;
    },
    email: function(val) {
      this.thisUser.email = val;
      this.thisCompany.email = val;
    },
    usernameNotEdit: function(val) {
      this.thisUsernameNotEdit = val;
    },
    address: function(val) {
      this.thisCompany.address = val;
    },


    // firstname: function(newVal, oldVal){
    //     this.InsideValue = newVal
    //     },
    // lastname: function(newVal, oldVal){
    //     this.InsideValue = newVal
    //     },
    // name: function(newVal, oldVal){
    //     this.InsideValue = newVal
    //     },
    // phone: function(newVal, oldVal){
    //     this.InsideValue = newVal
    //     },
    // email: function(newVal, oldVal){
    //     this.InsideValue = newVal
    //     }

    // loading: function(newVal, oldVal){
    //   console.log("newVal loading: " + newVal);
    //   //this.is_loading_local = newVal
    // }
  },
  methods: {
    ...mapActions({
      setInfo: "notification/setInfo"
    }),
    onFilePicked(e) {
      const files = e;

      //console.log(e);

      console.log("files");
      console.log(files);

      console.log("files[0]");
      console.log(files[0]);

      if (files != undefined) {
        console.log(files.name);

        let imageName = files.name;
        if (imageName.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files);
        fr.addEventListener("load", () => {
          this.thisUser.avatar = fr.result;
          this.imageFile = files; // this is an image file that can be sent to server...
        });
      } else {
        this.imageFile = "";
      }
    },
    pressCancelAvatar() {
      //console.log('cancel avatar')
      this.thisUser.avatar = this.avatar;
      this.imageFile = "";
      console.log(this.$refs.InputAvatar);
      this.file = null;
      this.dialog = false;
    },
    saveAvatar() {
      this.isLoadingBtnSave = true;
      let formData = new FormData();
      formData.append("avatar", this.imageFile);
      this.$axios
        .post(
          "/api/admin/me/avatar",
            formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        )
        .then(res => {
          if(res.data.returnCode != 1){
            this.TriggerNotiError(res.data.returnMessage);
            this.isLoadingBtnSave = false;
      this.dialog = false;
          }
          else{
          //this.is_loading = false;
          this.TriggerNoti(res.data.returnMessage);
          this.isLoadingBtnSave = false;
      this.dialog = false;
          
          //$this.goBack();
          }
        })

      
    //     console.log("error push")
    
    },
    TriggerNoti(mess){
      this.setInfo({color: 'success',
                mess: mess,
                status: true})
      },
    TriggerNotiError(mess){
      this.setInfo({color: 'error',
                mess: mess,
                status: true})
      }
  },
  created: async function() {
    console.log("loading prop: " + this.loading);
    console.log("loading edit: " + this.is_loading_local);
    console.log("isCompany: " + this.isCompany)
  }
};
</script>