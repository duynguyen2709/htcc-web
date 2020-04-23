<template>
<v-flex xs12 >
        <material-card color="green" title="Add new admin">
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
                  <v-text-field label="Email Address" class="purple-input" />
                </v-flex>
                <v-flex xs12 md6>
                  <v-text-field
                    v-model="currentUser.name"
                    label="First Name"
                    class="purple-input"
                  />
                </v-flex>
                <v-flex xs12 md6>
                  <v-text-field
                    v-model="currentUser.country"
                    label="Last Name"
                    class="purple-input"
                  />
                </v-flex>
                <v-flex xs12 md12>
                  <v-text-field label="Adress" class="purple-input" />
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
                  >Add</v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </material-card>
      </v-flex>
</template>

<script>
import materialCard from "~/components/material/AppCard";

export default {
  layout: "dashboard",
  components: {
    materialCard
  },
  data: () => ({
   firstname: '',
   lastname: '',
   role: '',
   currentUser: '',
   headers: [
      {
        sortable: false,
        text: "Name",
        value: "name"
      },
      {
        sortable: false,
        text: "ID",
        value: "id"
      }
    ],
    items: [
      {
        name: "Com 0",
        id: 0
      },
     {
        name: "Com 1",
        id: 0
      },
      {
        name: "Com 2",
        id: 0
      },
      {
        name: "Com 3",
        id: 0
      },
      {
        name: "Com 4",
        id: 0
      },
      {
        name: "Com 5",
        id: 0
      },
      {
        name: "Com 6",
        id: 0
      },
    ]
  }),
  created: async function(){
      let i;
      for(i = 0; i < this.items.length; i++){
          if(this.items[i].id == this.$route.params.id){
            this.currentUser = this.items[i];
            break;
          }
      }
  }
};
</script>
