export default {
  SET_USERNAME(state, username) {
    state.username = username;
  },
  SET_USER(state, NewUser){
    state.avatar = NewUser.avatar;
    state.email = NewUser.email;
    state.fullName = NewUser.fullName;
    state.phoneNumber = NewUser.phoneNumber;
    state.username = NewUser.username;
  },
  SET_PASSWORD(state, NewPassword){
    state.password = NewPassword;
  }
}
