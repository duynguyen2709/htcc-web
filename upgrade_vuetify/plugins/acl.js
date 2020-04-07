
import Vue from 'vue'

Vue.prototype.$ROLE = {
    ADMIN: "0",
    SUBADMIN: "1"
}

Vue.prototype.$onlyVisibleTo = function (roles) {

    if (this.$auth.loggedIn && this.$auth.user) {
        let role = this.$auth.user.role + "";
        if(Array.isArray(roles)){
            console.log(roles)
            let i = roles.indexOf(role);
            console.log("i: " + i)
            console.log("role: " + role)
            if (i >= 0) {
                return true;
            }
        }else if(roles == role){
            return true;
        }
    }
    return false;
}