<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex md12>
        <v-btn color="green" to="/admins/add">Add new admin</v-btn>
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
          <div>
          <v-data-table 
            :headers="headers" 
            :items="ChoosenItems.slice(0, 7)" 
            :search="search" 
            hide-default-footer
            :page.sync="page"
            items-per-page="5"
            @page-count="pageCount = $event">
            <template slot="headerCell" slot-scope="{ header }">
              <span class="subheading font-weight-light text--darken-3" v-text="header.text" />
            </template>
            <template slot="items" slot-scope="{ item }">
              <tr>
                <td>{{ item.name }}</td>
                <td>{{ item.country }}</td>
                <td>{{ item.city }}</td>
                <td class="text-xs-right">{{ item.salary }}</td>
                <td class="text-xs-right">
                  <!-- <v-btn color="success" @click="dialog=true">Chỉnh sửa</v-btn> -->
                  <v-dialog v-model="item.dialog" width="700">
                    <template v-slot:activator="{ on }">
                      <v-btn color="success" v-on="on">Chỉnh sửa</v-btn>
                    </template>
                        <edit-form
                          title="Edit profile sub-admin"
                          :firstname="item.name"
                          :lastname="item.name"
                          :phone="item.country"
                          :email="item.city"
                          @OnClickEdit="updateProfile($event, item.id)"
                        ></edit-form>
                  </v-dialog>
                </td>
                <td>
                  <v-btn
                    color="error"
                    @click="item.status=!item.status"
                  >{{item.status ? 'Khóa' : 'Mở khóa'}}</v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
           <v-pagination v-model="page" :length="pageCount"></v-pagination>
          </div>
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
        id: 0,
        idCom: 0,
        status: true,
        dialog: false
      },
      {
        name: "Minerva Hooper",
        country: "Curaçao",
        city: "Sinaai-Waas",
        salary: "$23,738",
        id: 1,
        idCom: 1,
        status: false,
        dialog: false
      },
      {
        name: "Sage Rodriguez",
        country: "Netherlands",
        city: "Overland Park",
        salary: "$56,142",
        id: 2,
        idCom: 1,
        status: true,
        dialog: false
      },
      {
        name: "Philip Chanley",
        country: "Korea, South",
        city: "Gloucester",
        salary: "$38,735",
        id: 3,
        idCom: 2,
        status: true,
        dialog: false
      },
      {
        name: "Doris Greene",
        country: "Malawi",
        city: "Feldkirchen in Kārnten",
        salary: "$63,542",
        id: 4,
        idCom: 2,
        status: true,
        dialog: false
      },
      {
        name: "Mason Porter",
        country: "Chile",
        city: "Gloucester",
        salary: "$78,615",
        id: 5,
        idCom: 3,
        status: true,
        dialog: false
      }
    ],
    ChoosenItems:[]
  }),
  methods: {
    ...mapActions({
      setInfo: "notification/setInfo"
    }),
    clickItem: function(id) {
      this.$router.push({ path: "/admins/edit/" + id });
    },
    TriggerNoti() {
      this.setInfo({ color: "success", mess: "Cập nhập thành công", status: true });
    },
    updateProfile(e, id){
      let ChoosenItem = this.items.find(item => item.id===id)
      ChoosenItem.dialog=false
       this.TriggerNoti()
    }
  },
  created:  async function(){
      let i;
      for(i = 0; i < this.items.length; i++){
          if(this.items[i].idCom == this.$route.params.id){
            this.ChoosenItems.push(this.items[i]);
            break;
          }
      }
  }
};
</script>
