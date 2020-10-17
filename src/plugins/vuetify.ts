import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: colors.purple.base,
        secondary: colors.green.accent2,
        accent: colors.green.accent2,
        error: colors.red.base,
      },
    },
  },
});
