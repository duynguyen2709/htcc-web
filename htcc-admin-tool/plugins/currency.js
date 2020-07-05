// import Vue from 'vue'
// import fx from 'money'

// Vue.prototype.$convertVND = function (money) {

//  return fx(money).to("VND");

// }

import Vue from 'vue'
const numeral = require('numeral');
//const money = 100000;

Vue.prototype.$convertVND = function (money) {
  return numeral(money).format('0,0')
}
