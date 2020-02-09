export default {
  SET_USERNAME(state, username) {
    state.username = username;
  },
  SET_USER(state, NewUser){
    console.log("in mutations");
    state.firstname = NewUser.firstname;
    state.lastname = NewUser.lastname;
  }
}
