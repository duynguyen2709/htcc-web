<template>
<v-flex xs12 >
        <edit-form
                          title="Thêm một admin"
                          :name="fullName"
                          :phone="phoneNumber"
                          :email="email"
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
    username: '',
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
