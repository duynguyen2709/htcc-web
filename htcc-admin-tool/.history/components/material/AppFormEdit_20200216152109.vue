<template>
  <material-card color="green" title="Edit Profile" text="Complete your profile">
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
            <v-text-field v-model="InlineUser.firstname" label="First Name" class="purple-input" />
          </v-flex>
          <v-flex xs12 md6>
            <v-text-field v-model="InlineUser.lastname" label="Last Name" class="purple-input" />
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
    },
    data(){
        return{
            InlineFirstname: this.firstname,
            InlineLastname: this.lastname,
            InlinePhone: this.phone,
            InlineEmail: this.email
        }
    }
}
</script>