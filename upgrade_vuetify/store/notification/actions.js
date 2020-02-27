export default {
  async setInfo({commit}, info) {
    commit('SET_INFO', info);
  },
  async setStatus({commit}, stt){
    commit('SET_STATUS', stt);
  }
}
