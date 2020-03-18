<template>
  <material-card color="green" :title="title" :text="text">
    <v-form>
      <v-container py-0>
        <v-layout wrap>
          <!-- <v-flex xs12 md4>
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
              v-model="InlineEmail"
            />
          </v-flex>-->
          <!-- <v-flex xs12 md6>
            <v-text-field v-model="InlineFirstname" label="First Name" class="purple-input" />
          </v-flex>
          <v-flex xs12 md6>
            <v-text-field v-model="InlineLastname" label="Last Name" class="purple-input" />
          </v-flex>-->

          <v-avatar v-if="thisUser.avatar" slot="offset" class="mx-auto d-block" size="130">
            <img :src="thisUser.avatar" />
          </v-avatar>

          <v-flex v-if="thisUsername" xs12 md12>
            <v-text-field
              label="Username"
              class="purple-input"
              :rules="[rules.required]"
              v-model="thisUser.username"
            />
          </v-flex>
          <v-flex v-if="thisPassword" xs12 md12>
            <v-text-field
              label="Password"
              class="purple-input"
              :rules="[rules.required, password]"
              v-model="thisUser.password"
            />
          </v-flex>
          <v-flex xs12 md12>
            <v-text-field
              label="Email"
              class="purple-input"
              :rules="[rules.required, rules.email]"
              v-model="thisUser.email"
            />
          </v-flex>
          <v-flex xs12 md12>
            <v-text-field
              label="Tên đầy đủ"
              class="purple-input"
              :rules="[rules.required]"
              v-model="thisUser.fullName"
            />
          </v-flex>
          <v-flex xs12 md12>
            <v-text-field
              label="Phone"
              class="purple-input"
              :rules="[rules.required, rules.phone]"
              v-model="thisUser.phoneNumber"
            />
          </v-flex>
          <v-flex v-if="thisUser.role" xs12 md6>
          </v-flex>
          <v-flex v-if="thisUser.status" xs12 md6>
            <v-icon
                color="tertiary"
                @click="thisUser.status=!thisUser.status"
              >{{thisUser.status ? 'lock' : 'lock_open'}}</v-icon>
          </v-flex>
          <!-- <v-flex xs12 md4>
            <v-text-field label="City" class="purple-input" />
          </v-flex>
          <v-flex xs12 md4>
            <v-text-field label="Country" class="purple-input" />
          </v-flex>
          <v-flex xs12 md4>
            <v-text-field class="purple-input" label="Postal Code" type="number" />
          </v-flex>-->
          <!-- <v-flex xs12>
            <v-textarea
              class="purple-input"
              label="About Me"
              value="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            />
          </v-flex>-->
          <v-flex xs12 text-xs-right>
            <!-- <v-btn
              class="mx-0 font-weight-light"
              color="success"
              @click="$emit('OnClickEdit', {firstname: InlineFirstname, lastname: InlineLastname})"
            >Update Profile</v-btn>-->
            <v-btn :loading="is_loading_local" class="mx-0 font-weight-light" color="success" @click.prevent="$emit('OnClickEdit', {user: thisUser})">{{btn || OK}}</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </material-card>
</template>

<script>
import materialCard from "~/components/material/AppCard";
export default {
    components:{
        materialCard
    },
    props: {
        // firstname: {
        //     type: String,
        //     required: true
        //     },
        // lastname: {
        //     type: String,
        //     required: true
        //     },
        fullName: {
          type: String,
            required: true
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
            required: true,
            },
        text:{
            type: String,
            required: false
            },
        username:{
            type: Boolean,
            required: false,
            default: false
        },
        password:{
            type: Boolean,
            required: false,
            default: false
        },
        role:{
            type: Number,
            required: false
        },
        status:{
            type: Number,
            required: false
        },
        avatar:{
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
        }
    },
    data(){
        return{
            // InlineFirstname: this.firstname,
            // InlineLastname: this.lastname,
            thisUsername: this.username,
            thisPassword: this.password,

            thisUser:{
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

            is_loading_local: this.loading,

            rules: {
                required: value => !!value || "Không được để trống",
                //counter: value => value.length <= 20 || "Max 20 characters",
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
                    }
            }
        }
    },
    watch: {
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
    },
    methods:{
      
    }
}
</script>