export default {
  async setUsername({commit}, user) {
    commit('SET_USERNAME', user);
  },
  async setUser({commit}, user){
    commit('SET_USER', user);
  }
}
