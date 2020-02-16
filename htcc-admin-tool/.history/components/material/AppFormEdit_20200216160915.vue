<template>
  <material-card color="green" :title="title" :text="text">
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
              v-model="InlineEmail"
            />
          </v-flex>
          <v-flex xs12 md6>
            <v-text-field v-model="InlineFirstname" label="First Name" class="purple-input" />
          </v-flex>
          <v-flex xs12 md6>
            <v-text-field v-model="InlineLastname" label="Last Name" class="purple-input" />
          </v-flex>
          <v-flex xs12 md12>
            <v-text-field
              label="Phone"
              class="purple-input"
              :rules="[rules.required, rules.phone]"
              v-model="InlinePhone"
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
  </material-card>
</template>

<script>
export default {
    props: {
        firstname: {
            type: String,
            required: true
            },
        lastname: {
            type: String,
            required: true
            },
        phone: {
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
            required: true
            }
    },
    data(){
        return{
            InlineFirstname: this.firstname,
            InlineLastname: this.lastname,
            InlinePhone: this.phone,
            InlineEmail: this.email,

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
        firstname: function(newVal, oldVal){
            this.InsideValue = newVal
            },
        lastname: function(newVal, oldVal){
            this.InsideValue = newVal
            },
        phone: function(newVal, oldVal){
            this.InsideValue = newVal
            },
        email: function(newVal, oldVal){
            this.InsideValue = newVal
            }
  }
}
</script>