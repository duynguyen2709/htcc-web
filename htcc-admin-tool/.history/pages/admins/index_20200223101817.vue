<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex md12>
        <v-btn color="green" to="/admins/add">Add new admin</v-btn>
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
            <template slot="items" slot-scope="{ item }">
              <tr>
                <td>{{ item.name }}</td>
                <td>{{ item.country }}</td>
                <td>{{ item.city }}</td>
                <td class="text-xs-right">{{ item.salary }}</td>
                <td class="text-xs-right">
                  <v-dialog>
                    <template v-slot:activator="{ on }">
                      <v-btn color="success" v-on="on">Chỉnh sửa</v-btn>
                    </template>
                    <edit-form
                      title="Edit profile sub-admin"
                      :firstname="item.name"
                      :lastname="item.name"
                      :phone="item.country"
                      :email="item.city"
                      @OnClickEdit="updateProfile($event)"
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
        status: true
      },
      {
        name: "Minerva Hooper",
        country: "Curaçao",
        city: "Sinaai-Waas",
        salary: "$23,738",
        id: 1,
        status: false
      },
      {
        name: "Sage Rodriguez",
        country: "Netherlands",
        city: "Overland Park",
        salary: "$56,142",
        id: 2,
        status: true
      },
      {
        name: "Philip Chanley",
        country: "Korea, South",
        city: "Gloucester",
        salary: "$38,735",
        id: 3,
        status: true
      },
      {
        name: "Doris Greene",
        country: "Malawi",
        city: "Feldkirchen in Kārnten",
        salary: "$63,542",
        id: 4,
        status: true
      },
      {
        name: "Mason Porter",
        country: "Chile",
        city: "Gloucester",
        salary: "$78,615",
        id: 5,
        status: true
      }
    ]
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
    updateProfile(e){
       this.TriggerNoti()
    }
  }
};
</script>
