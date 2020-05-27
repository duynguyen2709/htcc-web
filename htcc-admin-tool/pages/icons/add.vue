<template>
  <v-flex xs12>
    <v-btn color="#4caf50" class="white--text ml-4" @click="$router.go(-1)">Quay lại</v-btn>
    <!-- <material-card color="primary" title="Thêm icon">
    <v-form ref="form" v-model="isValid">
      <v-container py-0>
        <v-layout wrap>
            <v-img class="img-logo" src="/vuetifylogo.png" lazy-src="/vuetifylogo.png">
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </v-img>

           
                    
                 

           

        </v-layout>
      </v-container>
    </v-form>
    </material-card>-->

    <material-card color="primary" elevation="12" title="Thêm icon">
      <!-- <v-card> -->
      <v-form ref="form" @submit.prevent>
        <v-card-text>
          <div class="wrapper">
          <v-img  class="img-logo" :src="img" @error="onError"  lazy-src="/vuetifylogo.png">
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-row>
            </template>
          </v-img>

          <div>
          <v-radio-group v-model="radios" @change="changeMode">
            <v-radio label="Upload từ file" value="File"></v-radio>
            <v-radio label="Nhập link trực tiếp" value="URL"></v-radio>
          </v-radio-group>

          <v-file-input
            v-model="file"
            ref="InputAvatar"
            chips
            label="Chọn ảnh đại diện"
            @change="onFileSelected"
            accept="image/png, image/jpeg, image/bmp"
            class="input-file"
            :class="{ 'hidden': radios == 'URL' }"
          ></v-file-input>

          <v-text-field
              label="Link ảnh"
              class="green-input input-file"
              v-model="url"
              @change="onURLChanged"
              :rules="[rules.required]"
              :class="{'hidden': radios == 'File'}"
            />

          <v-text-field
              label="Mã icon"
              class="green-input input-file"
              v-model="iconID"
              :rules="[rules.required]"
            />  
       
          <v-select
            :items="screens"
            v-model="screenID"
            item-text="screenDescription"
            item-value="screenId"
            label="Màn hình"
          ></v-select>
       
          </div>
          </div>
       
        </v-card-text>
        <v-card-actions>
          <v-btn
            :loading="isLoadingBtnSave"
            :disabled="((!file && radios == 'File') || (img != url && radios == 'URL')) || !screenID || (iconID == '')"
            color="green"
            class="mx-auto d-block white--text"
            @click="ConfirmDialog = true"
          >Lưu</v-btn>
        </v-card-actions>
      </v-form>
    </material-card>

    <v-dialog v-model="ConfirmDialog" max-width="290">
                  <v-card>
                    <v-card-title class="green white--text">Thêm icon</v-card-title>

                    <v-card-text
                      class="mt-2"
                    >Bạn có chắc muốn thêm icon này?</v-card-text>

                    <v-card-actions>
                      <v-btn
                        color="green darken-1"
                        text
                        @click="uploadImage"
                        :loading="loadingBtnConfirm"
                      >Đồng ý</v-btn>

                      <v-btn color="red darken-1" text @click="ConfirmDialog = false">Hủy</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
  </v-flex>

  
</template>

<style>
.img-logo {
  max-width: 300px;
  max-height: 300px;
  margin: 0 auto;
}

.input-file {
  
  padding-top: 50px;
  width: 600px;
  margin: 0 auto;
}

.hidden {
  display: none !important;
}

.wrapper {
  display: flex;
  flex-direction: row-reverse;
}
</style>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import materialCard from "~/components/material/AppCard";
import editForm from "~/components/material/AppFormEdit";

export default {
  layout: "dashboard",
  components: {
    materialCard,
    editForm
  },
  data: () => ({
    ConfirmDialog: false,
    loadingBtnConfirm: false,

    isLoadingBtnSave: false,

    screenID: null,
    iconID: "",

    radios: "File",

    screens: [],

    file: null,
    url: null,
    isImgSuccess: false,
    img: '/vuetifylogo.png',
    imageFile: null,

     rules: {
        required: value => !!value || "Không được để trống"
     },

    username: true,
    password: true,
    fullName: "",
    email: "",
    phoneNumber: "",
    isLoading: false
  }),
  methods: {
    ...mapActions({
      setInfo: "notification/setInfo"
    }),
    TriggerNoti(mess) {
      this.setInfo({
        color: "success",
        mess: mess,
        status: true
      });
    },
    TriggerNotiError(mess) {
      this.setInfo({
        color: "error",
        mess: mess,
        status: true
      });
    },
    async add(e) {
      this.isLoading = true;
      let $this = this;
      await $this.$axios
        .post("/api/admin/users", {
          avatar: e.user.avatar,
          email: e.user.email,
          fullName: e.user.fullName,
          password: e.user.password,
          phoneNumber: e.user.phoneNumber,
          role: 0,
          status: 1,
          username: e.user.username
        })
        .then(res => {
          if (res.data.returnCode != 1) {
            this.TriggerNotiError(res.data.returnMessage);
          } else {
            //this.is_loading = false;
            this.TriggerNoti(res.data.returnMessage);
            //window.location.reload(true);
            console.log("Response");
            console.log(res);
            this.$router.push({
              path: "/admins/"
            });
          }
        })
        .catch(function(error) {
          //handle error
          //this.is_loading = false;
          console.log("Error:");
          console.log(error);
        });

      this.isLoading = false;
    },

    testLogic() {
      console.log((!this.file && this.radios == 'File') || (this.img != this.url && this.radios == 'URL'));
      console.log(!this.screenID)
      console.log(((!this.file && this.radios == 'File') || (this.img != this.url && this.radios == 'URL')) && !this.screenID)
    },

    uploadImage() {
      this.loadingBtnConfirm = true;
      this.isLoadingBtnSave = true;
      let formData = new FormData();
      formData.append("iconId", this.iconID)
      formData.append("iconImage", this.imageFile);
      formData.append("iconURL", this.url);
      formData.append("screenId", this.screenID);
      this.$axios
        .post(
          "/api/admin/icons",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        )
        .then(res => {
          this.isLoadingBtnSave = false;
          this.loadingBtnConfirm = false;
      this.ConfirmDialog = false;
          if(res.data.returnCode != 1){
            this.TriggerNotiError(res.data.returnMessage);

            
          }
          else{
          //this.is_loading = false;
          this.TriggerNoti(res.data.returnMessage);
          //$this.goBack();
          }
        })

      
    //     console.log("error push")
    
    },

    onFileSelected(e) {
      const files = e;

      //console.log(e);

      console.log("files");
      console.log(files);

      // console.log("files[0]");
      // console.log(files[0]);

      if (files != undefined) {
        console.log(files.name);

        let imageName = files.name;
        if (imageName.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files);
        fr.addEventListener("load", () => {
          
          this.img = fr.result;
          this.imageFile = files; // this is an image file that can be sent to server...
        });
      } else {
        this.imageFile = "";
      }
    },

    changeMode() {
      console.log("abc")
      this.img = '/vuetifylogo.png';

      if(this.radios == 'URL'){
        this.url = null
      }else{
        this.file = null;
      }
    },

    onURLChanged() {
      console.log("abac")

      this.img = this.url;
    },

    onError() {
      console.log("On error")
      this.img = '/vuetifylogo.png';
      this.isImgSuccess = false;
    },

    async onLoadScreens() {
      let $this = this;

        await $this.$axios
          .get("/api/admin/icons")
          .then(function (response) {
            if (response.data.returnCode == 1) {
              // console.log("this admins: " +  JSON.stringify(response.data.data))
              $this.screens = response.data.data.screenList;
              console.log("this icons: " + JSON.stringify($this.screens));

            } else {
              console.log("this error message: " + response.data.returnMessage);
            }
          })
          .catch(function (error) {
            console.log("Error get list screens logo:");
            console.log(error);
          });
    }
    
  },
  created: async function () {
    this.onLoadScreens()
  }
};
</script>
