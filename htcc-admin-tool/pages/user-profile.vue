<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex xs12 md8>
        <!-- <material-card color="green" title="Edit Profile" text="Complete your profile">
          <v-form>
            <v-container py-0>
              <v-layout wrap>
                <v-flex xs12 md4>
                  <v-text-field label="Company (disabled)" disabled />
                </v-flex>
                <v-flex xs12 md4>
                  <v-text-field class="purple-input" label="User Name" />
                </v-flex>
                <v-flex xs12 md4>
                  <v-text-field
                    label="Email Address"
                    class="purple-input"
                    :rules="[rules.required, rules.email]"
                  />
                </v-flex>
                <v-flex xs12 md6>
                  <v-text-field
                    v-model="InlineUser.firstname"
                    label="First Name"
                    class="purple-input"
                  />
                </v-flex>
                <v-flex xs12 md6>
                  <v-text-field
                    v-model="InlineUser.lastname"
                    label="Last Name"
                    class="purple-input"
                  />
                </v-flex>
                <v-flex xs12 md12>
                  <v-text-field
                    label="Phone"
                    class="purple-input"
                    :rules="[rules.required, rules.phone]"
                  />
                </v-flex>
                <v-flex xs12 md4>
                  <v-text-field label="City" class="purple-input" />
                </v-flex>
                <v-flex xs12 md4>
                  <v-text-field label="Country" class="purple-input" />
                </v-flex>
                <v-flex xs12 md4>
                  <v-text-field class="purple-input" label="Postal Code" type="number" />
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                    v-model="InlineUser.description"
                    class="purple-input"
                    label="About Me"
                    value="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                  />
                </v-flex>
                <v-flex xs12 text-xs-right>
                  <v-btn
                    class="mx-0 font-weight-light"
                    color="success"
                    @click="updateProfile"
                  >Update Profile</v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </material-card>-->
        <edit-form
          title="Thông tin cá nhân"
          text=""
          :avatar="user.avatar"
          :fullName="user.fullName"
          :phoneNumber="user.phoneNumber"
          :email="user.email"
          :loading="is_loading_update"
          btn="Cập nhập thông tin"
          @OnClickEdit="updateProfile($event)"
        ></edit-form>
      </v-flex>

      <!-- Card profile -->
      <v-flex xs12 md4>
        <material-card class="v-card-profile">
          <v-avatar slot="offset" class="mx-auto d-block" size="130">
            <!-- <v-img src="https://i.imgur.com/OoMeq4c.jpeg" /> -->

            <v-img :src="user.avatar" :lazy-src="LazyImg">
                                  <template v-slot:placeholder>
                                    <v-row class="fill-height ma-0" align="center" justify="center">
                                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                    </v-row>
                                  </template>
                                </v-img>
          </v-avatar>
          <v-card-text class="text-xs-center">
            <h6 class="category text-gray font-weight-bold title mb-3">{{ user.fullName }}</h6>
            <h4 class="card-title font-weight-light">{{ user.email }}</h4>
            <p class="card-description font-weight-light">{{ user.phoneNumber }}</p>
            <!-- <blockquote class="blockquote">{{}}</blockquote> -->
            <!-- <v-btn color="success" round class="font-weight-light">Change password</v-btn> -->

            <!-- Card edit -->
            <v-dialog width="530" v-model="dialog">
              <template v-slot:activator="{ on }">
                <!-- <v-btn color="red lighten-2" dark v-on="on">Click Me</v-btn> -->
                <!-- <v-btn color="success" rounded class="font-weight-light" v-on="on" @click="resetForm">Change password</v-btn> -->
                <v-btn color="success" rounded class="font-weight-light" v-on="on" >Đổi mật khẩu</v-btn>
              </template>

              <material-card color="success" elevation="12" title="Đổi mật khẩu">
                <!-- <v-card> -->
                <v-form ref="form" @submit.prevent>
                  <v-card-text>
                    <v-text-field
                      ref="OldPassword"
                      v-model="OldPassword"
                      prepend-icon="lock"
                      name="username"
                      label="Mật khẩu hiện tại"
                      :rules="[rules.required]"
                      :append-icon="ShowPasswordOld ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="ShowPasswordOld = !ShowPasswordOld"
                      :type="ShowPasswordOld ? 'text' : 'password'"
                      @click="rules.CurrentPassword = true"
                    ></v-text-field>

                    <v-text-field
                      ref="NewPassword"
                      v-model="NewPassword"
                      prepend-icon="lock"
                      name="password"
                      label="Mật khẩu mới"
                      :rules="[rules.required, rules.password]"
                      :append-icon="ShowPasswordNew ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="ShowPasswordNew = !ShowPasswordNew"
                      :type="ShowPasswordNew ? 'text' : 'password'"
                    ></v-text-field>

                    <v-text-field
                      ref="NewPasswordConfirm"
                      v-model="NewPasswordConfirm"
                      prepend-icon="lock"
                      name="password"
                      label="Xác nhận mật khẩu mới"
                      :rules="[rules.required, rules.NewPasswordConfirm]"
                      :append-icon="ShowPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="ShowPasswordConfirm = !ShowPasswordConfirm"
                      :type="ShowPasswordConfirm ? 'text' : 'password'"
                    ></v-text-field>
                  </v-card-text>
                  <v-card-actions>
                    <!-- <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon color="tertiary" v-on="on" @click="resetForm">mdi-refresh</v-icon>
                      </template>
                      <span class="white--text">Đặt lại form</span>
                    </v-tooltip> -->

                    <!-- <v-btn
                    icon
                    @click="resetForm"
                    class="black--text"
                  >
                    <v-icon>mdi-refresh</v-icon>
                    </v-btn>-->
                    <v-layout justify-center align-center>
                      <v-btn :loading="is_loading_password" color="success" @click="changePassword">Đổi mật khẩu</v-btn>
                    </v-layout>
                  </v-card-actions>
                </v-form>
              </material-card>
              <!-- </v-card> -->
            </v-dialog>
          </v-card-text>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style>
  .text-xs-center{
      text-align: center!important;
  }
</style>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import materialCard from "~/components/material/AppCard";
import editForm from "~/components/material/AppFormEdit";

export default {
  layout: "dashboard",
  components: {
    materialCard,
    editForm
  },
  data() {
    return {

      LazyImg: "/vuetifylogo.png",

      //user
      user: Object.assign({}, this.$auth.user),

      //use for hidden password
      //-----------
      ShowPasswordOld: false,
      ShowPasswordNew: false,
      ShowPasswordConfirm: false,
      //-----------

      InlineUser: "",

      //Use for change password form
      //------------
      OldPassword: "",
      NewPassword: "",
      NewPasswordConfirm: "",
      //------------

      dialog: false,

      rules: {
        required: value => !!value || "Không được để trống",
        counter: value => value.length <= 20 || "Max 20 characters",
        email: value => {
          const pattern = /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/;
          return pattern.test(value) || "Email không hợp lệ.";
        },
        phone: value => {
          const pattern = /(09|01[2|6|8|9])+([0-9]{8})\b/g;
          return pattern.test(value) || "Số điện thoại không hợp lệ.";
        },
        password: value => {
          const pattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,}$/;
          return (
            pattern.test(value) ||
            "Mật khẩu chưa hợp lệ, phải dài ít nhất 7  kí tự và chứa ít nhất 1 chữ số và kí tự đặc biệt !@#$%^&*"
          );
        },
        // CurrentPassword: value => {
        //   return (value == this.user.password) || "Mật khẩu hiện tại không trùng khớp"
        // },
        CurrentPassword: true,
        NewPasswordConfirm: value => {
          return (value == this.NewPassword) || "Mật khẩu mới không trùng khớp"
        }
        //CurrentPassword: [true],
        //NewPasswordConfirm: [true]
      },


      is_loading_update: false,
      is_loading_password: false
    };
  },
  computed: {
    // ...mapGetters({
    //   user: "user/getUser",
    //   fullname: "user/getFullname"
    // }),

    // form () {
    //   return {
    //     OldPassword: this.OldPassword,
    //     NewPassword: this.NewPassword,
    //     NewPasswordConfirm: this.NewPasswordConfirm
    //   }
    // },
  },
  methods: {
    ...mapActions({
      setUser: "user/setUser",
      setPassword: "user/setPassword",
      setInfo: "notification/setInfo"
    }),
    updateProfile: async function(e) {
this.is_loading_update = true;
      //this.setUser(user);

      //console.log("edit profile")

      let url = "/api/admin/users/" + this.user.username
      console.log("url: " + url);
      await this.$axios
        .put(url, {
          avatar: this.user.avatar,
          email: e.user.email,
          fullName: e.user.fullName,
          password: this.user.password,
          phoneNumber: e.user.phoneNumber,
          role: this.user.role,
          status: this.user.status,
          username: this.user.username,
        })
        .then(res => {
          if(res.data.returnCode == 0){
            this.TriggerNoti(res.data.returnMessage);
          }
          else{
          //this.is_loading = false;
          this.TriggerNoti("Cập nhập thông tin thành công");

          this.user.fullName = e.user.fullName;
          this.user.email = e.user.email;
          this.user.phoneNumber = e.user.phoneNumber;

          console.log("Response");
          console.log(res);
          //$this.goBack();
          }
          this.is_loading_update = false;

        })
        .catch(function(error) {
          //handle error
          this.is_loading = false;
          console.log("Error:");
          console.log(error);
        });

      //e.preventDefault();
    },
    async changePassword() {
      console.log("New p: " + this.OldPassword);
      console.log("Cur p: " + this.user.password);
      this.is_loading_password = true;
      let flag = true;

      // if (this.OldPassword !== this.user.password) {
      //   this.rules.CurrentPassword = "Mật khẩu hiện tại không trùng khớp";
      //   flag = false;
      // }
      // if (this.NewPassword !== this.NewPasswordConfirm) {
      //   this.rules.NewPasswordConfirm = "Mật khẩu mới không trùng khớp";
      //   flag = false;
      // }

      // Object.keys(this.form).forEach(f => {
      //   console.log(f);
      //   if (!this.form[f])
      //     console.log("error form: " + f);
      //   this.$refs[f].validate(true)
      // })

      if (this.$refs.form.validate()) {
        console.log("cur pass: " + this.user.password)
        console.log("ref form validate");


        this.snackbar = true;

        let url = "/api/gateway/private/changepassword/3"
        await this.$axios
        .put(url, {
          "clientId": 3,
          "companyId": "",
          "newPassword": this.NewPassword,
          "oldPassword": this.OldPassword,
          "username": "admin"
        })
        .then(res => {
          if(res.data.returnCode != 1){
            this.TriggerNotiError(res.data.returnMessage);
          }
          else{
          //this.is_loading = false;
          this.TriggerNoti(res.data.returnMessage);
          console.log("Response");
          console.log(res);
          //$this.goBack();
          }

          this.dialog = false;
        })
        .catch(function(error) {
          //handle error
          //this.is_loading = false;
          console.log("Error:");
          console.log(error);
        });
      }
      else{
        console.log("ref form validate false");
        flag = false
      }
this.is_loading_password = false;
      // if(flag)
      //   {
      //     this.setPassword(this.NewPassword);
      //     this.TriggerNoti("Cập nhập mật khẩu thành công");
      //   }
    },
    resetForm () {

      // Object.keys(this.form).forEach(f => {
      //   console.log(f);
      //   this.$refs[f].reset()
      // })

      this.OldPassword= "";
      this.NewPassword= "";
      this.NewPasswordConfirm= "";
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
  created: function() {
    this.InlineUser = Object.assign({}, this.user);
  }
};
</script>
