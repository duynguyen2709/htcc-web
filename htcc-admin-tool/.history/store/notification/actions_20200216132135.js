export default {
  async setInfo({commit}, color, mess) {
    commit('SET_INFO', color, mess);
  }
}
