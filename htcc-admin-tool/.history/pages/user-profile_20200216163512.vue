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
        </material-card> -->
        <edit-form 
          title="Edit profile" 
          text="Complete your profile" 
          :firstname="user.firstname"
          :lastname="user.lastname"
          :phone="user.phone"
          :email="user.email"
          @OnClickEdit="updateProfile"
          ></edit-form>
      </v-flex>
      <v-flex xs12 md4>
        <material-card class="v-card-profile">
          <v-avatar slot="offset" class="mx-auto d-block" size="130">
            <img src="https://demos.creative-tim.com/vue-material-dashboard/img/marc.aba54d65.jpg" />
          </v-avatar>
          <v-card-text class="text-xs-center">
            <h6 class="category text-gray font-weight-thin mb-3">{{ user.function }}</h6>
            <h4 class="card-title font-weight-light">{{ fullname }}</h4>
            <p class="card-description font-weight-light">{{ user.description }}</p>
            <blockquote class="blockquote">{{ user.citation }}</blockquote>
            <!-- <v-btn color="success" round class="font-weight-light">Change password</v-btn> -->
            <v-dialog width="530">
              <template v-slot:activator="{ on }">
                <!-- <v-btn color="red lighten-2" dark v-on="on">Click Me</v-btn> -->
                <v-btn color="success" round class="font-weight-light" v-on="on" @click="resetForm">Change password</v-btn>
              </template>

              <material-card color="success" elevation="12" title="Đổi mật khẩu">
                <v-card-text>
                  <v-form>
                    <v-text-field
                      ref="OldPassword"
                      v-model="OldPassword"
                      prepend-icon="lock"
                      name="username"
                      label="Mật khẩu hiện tại"
                      :rules="[rules.required, rules.CurrentPassword]"
                      :append-icon="ShowPasswordOld ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="ShowPasswordOld = !ShowPasswordOld"
                      :type="ShowPasswordOld ? 'text' : 'password'"
                      @click="()=>{rules.CurrentPassword=true}"
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
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-layout justify-center align-center>
                    <v-btn
                    icon
                    @click="resetForm"
                  >
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                    <v-btn color="success" @click="changePassword">Đổi mật khẩu</v-btn>
                  </v-layout>
                </v-card-actions>
              </material-card>
            </v-dialog>
          </v-card-text>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

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
        //   return (OldPassword === user.password) || "Mật khẩu hiện tại không trùng khớp"
        // }
        CurrentPassword: true,
        NewPasswordConfirm: true
      }
    };
  },
  computed: {
    ...mapGetters({
      user: "user/getUser",
      fullname: "user/getFullname"
    }),

    form () {
      return {
        OldPassword: this.OldPassword,
        NewPassword: this.NewPassword,
        NewPasswordConfirm: this.NewPasswordConfirm
      }
    },
  },
  methods: {
    ...mapActions({
      setUser: "user/setUser",
      setPassword: "user/setPassword"
    }),
    updateProfile: function() {
      //this.setUser(this.InlineUser);
      console.log("edit profile")
    },
    changePassword() {
      console.log("New p: " + this.OldPassword);
      console.log("Cur p: " + this.user.password);
      
      let flag = true;

      if (this.OldPassword !== this.user.password) {
        this.rules.CurrentPassword = "Mật khẩu hiện tại không trùng khớp";
        flag = false;
      }
      if (this.NewPassword !== this.NewPasswordConfirm) {
        this.rules.NewPasswordConfirm = "Mật khẩu mới không trùng khớp";
        flag = false;
      } 
      
      Object.keys(this.form).forEach(f => {
        if (!this.form[f])
          console.log("error form: " + f);
        this.$refs[f].validate(true)
      })

      if(flag)
        this.setPassword(this.NewPassword);
    },
    resetForm () {
      Object.keys(this.form).forEach(f => {
        this.$refs[f].reset()
      })
    }
  },
  created: function() {
    this.InlineUser = Object.assign({}, this.user);
  }
};
</script>
