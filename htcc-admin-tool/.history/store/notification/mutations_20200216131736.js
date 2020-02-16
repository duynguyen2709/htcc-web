export default {
  SET_USERNAME(state, username) {
    state.username = username;
  },
  SET_USER(state, NewUser){
    state.firstname = NewUser.firstname;
    state.lastname = NewUser.lastname;
  },
  SET_PASSWORD(state, NewPassword){
    state.password = NewPassword;
  }
}
