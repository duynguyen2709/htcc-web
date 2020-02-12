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
                    v-model="firstname"
                    label="First Name"
                    class="purple-input"
                  />
                </v-flex>
                <v-flex xs12 md6>
                  <v-text-field
                    v-model="lastname"
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
        text: "Country",
        value: "country"
      },
      {
        sortable: false,
        text: "City",
        value: "city"
      },
      {
        sortable: false,
        text: "Salary",
        value: "salary",
        align: "right"
      }
    ],
    items: [
      {
        name: "Dakota Rice",
        country: "Niger",
        city: "Oud-Tunrhout",
        salary: "$35,738",
        id: 0
      },
      {
        name: "Minerva Hooper",
        country: "Curaçao",
        city: "Sinaai-Waas",
        salary: "$23,738",
        id: 1
      },
      {
        name: "Sage Rodriguez",
        country: "Netherlands",
        city: "Overland Park",
        salary: "$56,142",
        id: 2
      },
      {
        name: "Philip Chanley",
        country: "Korea, South",
        city: "Gloucester",
        salary: "$38,735",
        id: 3
      },
      {
        name: "Doris Greene",
        country: "Malawi",
        city: "Feldkirchen in Kārnten",
        salary: "$63,542",
        id: 4
      },
      {
        name: "Mason Porter",
        country: "Chile",
        city: "Gloucester",
        salary: "$78,615",
        id: 5
      }
    ]
  }),
  created: function(){
      let i;
      for(i = 0; i < this.items.length; i++){
          if(items[i].id == this.$route.param){}
      }
  }
};
</script>
