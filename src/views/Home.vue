<template>
  <div>
    <div class="d-flex mb-3">
      <v-btn
        icon
        @click="$refs.calendar.prev()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <h2 class="px-2">
        {{
          new Date(today)
          | dateFormat(type === 'month' ? 'MMMM YYYY' : 'D MMMM YYYY')
        }}
      </h2>
      <v-btn
        icon
        @click="$refs.calendar.next()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        outlined
        color="secondary"
        @click="type = type === 'month' ? 'day' : 'month'">
        Switch to {{ type === 'month' ? 'Daily' : 'Monthly' }}
      </v-btn>
    </div>
    <v-sheet height="550">
      <v-calendar
        dark
        color="purple"
        ref="calendar"
        v-model="today"
        :weekdays="weekdays"
        :type="type">
      </v-calendar>
    </v-sheet>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Home extends Vue {
  today = new Date().toISOString().substr(0, 10);

  weekdays = [1, 2, 3, 4, 5, 6, 0];

  type = 'month';
}
</script>
