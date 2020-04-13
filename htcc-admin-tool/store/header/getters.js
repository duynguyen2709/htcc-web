export default {
  getTitle(state, header) {
    if(state.title.has(header)){
      return state.title[header];
    }
    else{
      return 'Không xác định'
    }
  }
}
