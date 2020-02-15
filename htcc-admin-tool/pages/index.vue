<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        

        <v-flex xs12 sm8 md4>

          <v-alert type="error"  v-model="isFalse">
            {{message}}
          </v-alert>

          <material-card
            color="success"
            elevation="12"
            title="Connexion"
          >
            <v-card-text>
              <v-form>
                <v-text-field type="text" v-model="username" prepend-icon="person" name="username" label="Login" placeholder=""></v-text-field>
                <v-text-field v-model="password" prepend-icon="lock" name="password" label="Password" placeholder=""
                  :append-icon="ShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="ShowPassword = !ShowPassword"
                  :type="ShowPassword ? 'text' : 'password'"
                  ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-layout justify-center align-center>
                <v-btn color="success" @click.prevent="authenticate">Login</v-btn>
              </v-layout>
            </v-card-actions>
          </material-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import materialCard  from '~/components/material/AppCard'

  export default {
    components: {
      materialCard
    },
    data() {
      return {
        isFalse: null,
        message: '',
        username:'',
        password:'',
        ShowPassword: false
      }
    },
    computed: {
      ...mapGetters({
      TrueUsername: "user/getUsername",
      TruePassword: "user/getPassword"
    }),
      isDisabled() {
        if(this.username !== this.TrueUsername){
          this.message = 'Không tồn tại người dùng này';
          return false;
          }
        else if(this.password !== this.TruePassword){
          this.message = 'Sai mật khẩu';
          return false;
          }
        return true;
      }
    },
    methods: {
      ...mapActions({
        setUsername: 'user/setUsername'
      }),

      async authenticate() {
        if (this.isDisabled) {
          //await this.setUsername(this.defaultUserPassword);
          this.$router.push({ path: 'dashboard' });
        }
        else{
          this.isFalse = true;
        }
      },
      logIn() {
      let $this = this;
      //this.is_loading = true;

      this.$axios
        .post("user/login", {
          username: this.username,
          password: this.password
        })
        .then(function(response) {
          if (response.data.result === false) {
            $this.errorMessage = response.data.error.msg;
            console.log("Error 1: ");
            console.log(response.data.error);
          } else {
            console.log("Logged User:");
            console.log($this.$auth.user);
            $this.$auth.setUserToken(response.data.token);
          }

          $this.is_loading = false;
        })
        .catch(function(response) {
          //handle error
          console.log("Error 2: ");
          console.log(response);
          $this.is_loading = false;
        });
    }
    }
  }
</script>
