export default {
  SET_INFO(state, info) {
    state.color = info.color;
    state.mess = info.mess;
    state.status = info.status
  },
  SET_STATUS(state, stt){
    state.status = stt
  }
}
