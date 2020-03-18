<template>
<v-flex xs12 >
        <edit-form
                          title="Thêm một admin"
                          avatar="https://i.pinimg.com/originals/0d/36/e7/0d36e7a476b06333d9fe9960572b66b9.jpg"
                          :name="fullName"
                          :phone="phoneNumber"
                          :email="email"
                          :username="username"
                          :password="password"
                          btn="Thêm"
                          @OnClickEdit="add($event, username)"
                        ></edit-form>
      </v-flex>
</template>

<script>
import materialCard from "~/components/material/AppCard";
import editForm from "~/components/material/AppFormEdit";

export default {
  layout: "dashboard",
  components: {
    materialCard,
    editForm
  },
  data: () => ({
    username: true,
    password: true,
   fullName: '',
   email: '',
   phoneNumber: ''
  }),
  methods:{
    add: (e, username) => {

    }
  }
};
</script>
