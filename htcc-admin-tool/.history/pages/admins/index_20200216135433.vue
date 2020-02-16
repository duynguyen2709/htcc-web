<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex md12>

        <v-btn color="green" to="/admins/add">Add new admin</v-btn>
        <v-btn color="green" @click="TriggerNoti">Test notification</v-btn>

        <!-- <material-card color="green" flat full-width title="Admins" text="List of sub-admins"> -->
        <material-card flat>
          <v-card-title>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table :headers="headers" :items="items.slice(0, 7)" :search="search">
            <template slot="headerCell" slot-scope="{ header }">
              <span class="subheading font-weight-light text--darken-3" v-text="header.text" />
            </template>
            <template slot="items" slot-scope="{ item }" >
              <tr @click="clickItem(item.id)">
              <td>{{ item.name }}</td>
              <td>{{ item.country }}</td>
              <td>{{ item.city }}</td>
              <td class="text-xs-right">{{ item.salary }}</td>
              </tr>
            </template>
          </v-data-table>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import materialCard from "~/components/material/AppCard";

export default {
  layout: "dashboard",
  components: {
    materialCard
  },
  data: () => ({
    search: "",
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
  methods:{
    ...mapActions({
        setInfo: 'notifications/setInfo'
      }),
    clickItem: function(id){
      this.$router.push({ path: '/admins/edit/' + id });
    },
    TriggerNoti(){
      setInfo({color: 'warning',
                mess: 'test noti',
                status: true})
    }
  }
};
</script>
