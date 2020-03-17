<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex md12>
        <v-btn color="green white--text" to="/admins/add">Thêm một admin</v-btn>
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
              :items="items"
              :search="search"
              hide-default-footer
              :page.sync="page"
              :items-per-page="itemsPerPage"
              @page-count="pageCount = $event"
            >
              <!-- <template slot="headers" slot-scope="{ header }"> -->
              <template v-slot:header="{ props: { headers } }">
                <thead>
                  <span class="subheading font-weight-light text--darken-3" v-text="headers.text" />
                </thead>
              </template>
              <!-- <template slot="items" slot-scope="{ item }"> -->
              <template v-slot:body="{ items }">
                <tbody>
                  <tr v-for="item in items" :key="item.id">
                    <td><v-avatar><img :src="item.avatar" /></v-avatar></td>
                    <td>{{ item.fullName }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.phoneNumber }}</td>
                    <td class="text-xs-right">{{ item.role }}</td>
                    <td class="text-xs-right">
                      <!-- <v-btn color="success" @click="dialog=true">Chỉnh sửa</v-btn> -->
                      <v-dialog v-model="item.dialog" width="700">
                        <template v-slot:activator="{ on }">
                          <!-- <v-btn color="success" v-on="on">Chỉnh sửa</v-btn> -->
                          <v-icon color="tertiary" v-on="on">edit</v-icon>
                        </template>
                        <edit-form
                          title="Chỉnh sửa thông tin admin"
                          :fullName="item.fullName"
                          :phoneNumber="item.phoneNumber"
                          :email="item.email"
                          @OnClickEdit="updateProfile($event, item)"
                        ></edit-form>
                      </v-dialog>
                    </td>
                    <td>
                      <v-icon
                        color="tertiary"
                        @click="item.status=!item.status"
                      >{{item.status ? 'lock' : 'lock_open'}}</v-icon>
                    </td>
                  </tr>
                </tbody>
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
    itemsPerPage: 5,
    dialog: false,
    btnLock: true,
    search: "",
    headers: [
      {
        text: "Ảnh đại diện"
      },
      {
        sortable: false,
        text: "Tên đầy đủ",
        value: "fullName"
      },
      {
        sortable: false,
        text: "Email",
        value: "email"
      },
      {
        sortable: false,
        text: "Số điện thoại",
        value: "phoneNumber"
      },
      {
        sortable: false,
        text: "Vai trò",
        value: "role",
      }
    ],

    // items: [
    //   {
    //     name: "Dakota Rice",
    //     country: "Niger",
    //     city: "Oud-Tunrhout",
    //     salary: "$35,738",
    //     id: 0,
    //     status: true,
    //     dialog: false
    //   },
    //   {
    //     name: "Minerva Hooper",
    //     country: "Curaçao",
    //     city: "Sinaai-Waas",
    //     salary: "$23,738",
    //     id: 1,
    //     status: false,
    //     dialog: false
    //   },
    //   {
    //     name: "Sage Rodriguez",
    //     country: "Netherlands",
    //     city: "Overland Park",
    //     salary: "$56,142",
    //     id: 2,
    //     status: true,
    //     dialog: false
    //   },
    //   {
    //     name: "Philip Chanley",
    //     country: "Korea, South",
    //     city: "Gloucester",
    //     salary: "$38,735",
    //     id: 3,
    //     status: true,
    //     dialog: false
    //   },
    //   {
    //     name: "Doris Greene",
    //     country: "Malawi",
    //     city: "Feldkirchen in Kārnten",
    //     salary: "$63,542",
    //     id: 4,
    //     status: true,
    //     dialog: false
    //   },
    //   {
    //     name: "Mason Porter",
    //     country: "Chile",
    //     city: "Gloucester",
    //     salary: "$78,615",
    //     id: 5,
    //     status: true,
    //     dialog: false
    //   }
    // ],
    items: [],
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
      this.setInfo({
        color: "success",
        mess: "Cập nhập thành công",
        status: true
      });
    },
    updateProfile(e, user) {
      // let ChoosenItem = this.items.find(item => item.id === id);
      // ChoosenItem.dialog = false;

      let url = "/api/admin/users/" + user.username
      console.log("url: " + url);
      this.$axios
        .put(url, {
          avatar: this.user.avatar,
          email: e.user.email,
          fullName: e.user.fullName,
          password: this.user.password,
          phoneNumber: e.user.phoneNumber,
          role: this.user.role,
          status: this.user.status,
          username: this.user.username,
        })
        .then(res => {
          if(res.data.returnCode == 0){
            this.TriggerNoti(res.data.returnMessage);
          }
          else{
          //this.is_loading = false;
          this.TriggerNoti("Cập nhập thông tin thành công");
          window.location.reload(true);
          console.log("Response");
          console.log(res);
          //$this.goBack();
          }
        })
        .catch(function(error) {
          //handle error
          //this.is_loading = false;
          console.log("Error:");
          console.log(error);
        });
    },
   async getListAdmins(){
     let $this=this
      await $this.$axios.get("/api/admin/users")
        .then(function(response) {
          if(response.data.returnCode == 1){
         // console.log("this admins: " +  JSON.stringify(response.data.data))
          $this.items = response.data.data;
           console.log("this admins: " +  JSON.stringify($this.items))
         
          }
          else{
            console.log("this error message: " +  response.data.returnMessage)
          }
        })
        .catch(function(error) {
          console.log("Error get list admin:");
          console.log(error);
        });
    }
  },
  created: async function() {
    // if (this.$route.params.id) {
    //   let i;
    //   for (i = 0; i < this.items.length; i++) {
    //     if (this.items[i].idCom == this.$route.params.id) {
    //       this.ChoosenItems.push(this.items[i]);
    //       break;
    //     }
    //   }
    // }
    // else{
    //   this.ChoosenItems = this.items
    // }

    this.getListAdmins()
  }
};
</script>
