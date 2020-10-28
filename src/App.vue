<template>
<v-app id="inspire">
  <v-navigation-drawer
    v-model="drawer"
    app>
    <v-list dense>
      <router-link to="/" tag="div">
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </router-link>
      <router-link to="/about" tag="div">
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-help</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>About</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </router-link>
    </v-list>
  </v-navigation-drawer>
  <v-app-bar app color="primary">
    <v-toolbar-title>RSS News Archiver</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-app-bar-nav-icon
      v-if="isMobile"
      @click="drawer = !drawer">
    </v-app-bar-nav-icon>
  </v-app-bar>
  <v-main class="mx-4 my-3">
    <router-view></router-view>
  </v-main>
  <v-footer color="primary" inset app>
    <span class="white--text">
      &copy; Maciej Pędzich, 2020
    </span>
  </v-footer>
</v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',

  data() {
    return {
      isMobile: ['xs', 'sm'].includes(this.$vuetify.breakpoint.name),
      drawer: ['md', 'lg', 'xl'].includes(
        this.$vuetify.breakpoint.name,
      ),
    };
  },
});
</script>
