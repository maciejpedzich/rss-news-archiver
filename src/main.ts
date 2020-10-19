import Vue from 'vue';

import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format';
import vuetify from './plugins/vuetify';

import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

Vue.use(VueFilterDateFormat);

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
