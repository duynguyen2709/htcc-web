<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex md12>
        <v-btn color="green" to="/admins/add">Add new company</v-btn>
        <!-- <material-card color="green" flat full-width title="Admins" text="List of sub-admins"> -->
        <!-- <material-card flat> -->
          <material-card text> 
          <v-card-title>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table 
            :headers="headers" 
            :items="items.slice(0, 7)" 
            :search="search" 
            hide-default-footer
            :page.sync="page"
            :items-per-page= "itemsPerPage"
            @page-count="pageCount = $event">
            <template v-slot:header="{ props: { headers } }">
              <thead>
              <span class="subheading font-weight-light text--darken-3" v-text="headers.text" />
              </thead>
            </template>
            <template v-slot:body="{ items }">
              <tbody>  
              <tr v-for="item in items" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.id }}</td>
                <td class="text-xs-right">
                   <v-tooltip right>
                    <template v-slot:activator="{ on }">
                      <v-icon color="tertiary" v-on="on" @click="clickItem(item)" >view_list</v-icon>
                    </template>
                    <span class="white--text">Xem danh sách người quản lí</span>
                  </v-tooltip>
                </td>
              </tr>
              </tbody>
            </template>
          </v-data-table>
          <v-pagination v-model="page" :length="pageCount"></v-pagination>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import materialCard from "~/components/material/AppCard";
import editForm from "~/components/material/AppFormEdit";

export default {
  layout: "dashboard",
  components: {
    materialCard,
    
    editForm
  },
  data: () => ({
    page: 1,
    pageCount: 0,
    itemsPerPage: 5,
    dialog: false,
    btnLock: true,
    search: "",
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
        id: 1
      },
      {
        name: "Com 2",
        id: 2
      },
      {
        name: "Com 3",
        id: 3
      },
      {
        name: "Com 4",
        id: 4
      },
      {
        name: "Com 5",
        id: 5
      },
      {
        name: "Com 6",
        id: 6
      },
      {
        name: "Com 7",
        id: 7
      }
    ]
  }),
  methods: {
    ...mapActions({
      setInfo: "notification/setInfo"
    }),
    clickItem: function(id) {
      this.$router.push({ path: "/companies/edit/" + id });
    },
    TriggerNoti() {
      this.setInfo({ color: "success", mess: "Cập nhập thành công", status: true });
    },
    updateProfile(e, id){
      let ChoosenItem = this.items.find(item => item.id===id)
      ChoosenItem.dialog=false
       this.TriggerNoti()
    },
    clickItem: function(e) {
      this.$router.push({
        path: '/admins/' + e.id
      })
    },
  }
};
</script>
