<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-alert type="error" v-model="isFalse">{{message}}</v-alert>

          <material-card color="success" elevation="12" title="Connexion">
             <v-form @submit.prevent="logIn"> 
               <!-- <v-form> -->
            <v-card-text>
             
                <v-text-field
                  type="text"
                  v-model="username"
                  prepend-icon="person"
                  name="username"
                  label="Login"
                  placeholder
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  prepend-icon="lock"
                  name="password"
                  label="Password"
                  placeholder
                  :append-icon="ShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="ShowPassword = !ShowPassword"
                  :type="ShowPassword ? 'text' : 'password'"
                ></v-text-field>
              
            </v-card-text>
            <v-card-actions>
              <v-layout justify-center align-center>
                <v-dialog width="530">
                  <template v-slot:activator="{ on }">
                    <!-- <v-btn color="red lighten-2" dark v-on="on">Click Me</v-btn> -->
                    <!-- <v-btn text small v-on="on" class="red--text" flat>Quên mật khẩu</v-btn> -->
                    <v-btn text small v-on="on" class="red--text" >Quên mật khẩu</v-btn>
                  </template>

                  <material-card color="success" elevation="12" title="Đổi mật khẩu">
                    <v-card-text>
                      <v-form>
                        <v-text-field
                          ref="EmailConfirm"
                          v-model="EmailConfirm"
                          prepend-icon="mail"
                          label="Email để nhận thông báo"
                          :rules="[rules.required, rules.email]"
                          
                        ></v-text-field>
                      </v-form>
                    </v-card-text>
                    <v-card-actions>
                      <v-layout justify-center align-center>
                        <!-- <v-btn icon @click="resetForm">
                          <v-icon>mdi-refresh</v-icon>
                        </v-btn> -->
                        <!-- <v-btn color="success" @click="changePassword" v-on="on">Đổi mật khẩu</v-btn> -->
                        <v-btn color="success" @click="changePassword">Đổi mật khẩu</v-btn>
                      </v-layout>
                    </v-card-actions>
                  </material-card>
                </v-dialog>
              </v-layout>
              <v-layout justify-center align-center>
                <v-btn type="submit" color="success" :loading="isLoading">Đăng nhập</v-btn>
                <!-- <v-btn color="success" type="submit" >Đăng nhập</v-btn> -->
              </v-layout>
              
            </v-card-actions>
            </v-form>
          </material-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import materialCard from "~/components/material/AppCard";

export default {
  components: {
    materialCard
  },
  data() {
    return {
      isFalse: false,
      message: "123",
      username: "admin",
      password: "123",
      ShowPassword: false,
      EmailConfirm: "",
      rules: {
        required: [value => !!value || "Không được để trống"],
        email: [value => {
          const pattern = /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/;
          return pattern.test(value) || "Email không hợp lệ.";
        }]
      },
      isLoading: false
    };
  },
  computed: {
    ...mapGetters({
      TrueUsername: "user/getUsername",
      TruePassword: "user/getPassword"
    }),
    isDisabled() {
      if (this.username !== this.TrueUsername) {
        this.message = "Không tồn tại người dùng này";
        return false;
      } else if (this.password !== this.TruePassword) {
        this.message = "Sai mật khẩu";
        return false;
      }
      return true;
    }
  },
  methods: {
    ...mapActions({
      setUsername: "user/setUsername"
    }),
    changePassword(){

    },
    async authenticate() {
      if (this.isDisabled) {
        //await this.setUsername(this.defaultUserPassword);
        this.$router.push({ path: "dashboard" });
      } else {
        this.isFalse = true;
      }
    },
    async logIn() {
      let $this = this;
      this.is_loading = true;

      const credentials = {
        "clientId": 3,
        "password": this.password,
        "username": this.username
      }
      try {
        await this.$auth.loginWith('local', {
          data: credentials
        })
      } catch (e) {
        console.log("fail at login!!!")
        console.log(e)
        this.message=e.Error
      }


    //   this.$axios
    //     .post("user/login", {
    //       username: this.username,
    //       password: this.password
    //     })
    //     .then(function(response) {
    //       if (response.data.result === false) {
    //         $this.errorMessage = response.data.error.msg;
    //         console.log("Error 1: ");
    //         console.log(response.data.error);
    //       } else {
    //         console.log("Logged User:");
    //         console.log($this.$auth.user);
    //         $this.$auth.setUserToken(response.data.token);
    //       }

    //       $this.is_loading = false;
    //     })
    //     .catch(function(response) {
    //       //handle error
    //       console.log("Error 2: ");
    //       console.log(response);
    //       $this.is_loading = false;
    //     });
    }
  },
  watch: {
    // username: function(newVal, oldVal){
    //   if(newVal == ){

    //   }
    // }
  }
};
</script>
