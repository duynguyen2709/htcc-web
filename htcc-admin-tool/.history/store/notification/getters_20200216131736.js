export default {
  getUser(state) {
    return state;
  },

  getFullname(state) {
    return state.firstname + ' ' + state.lastname;
  },
  getUsername(state){
    return state.username;
  },
  getPassword(state){
    return state.password;
  }
}
