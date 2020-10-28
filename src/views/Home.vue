<template>
  <div>
    <div class="d-flex mb-3">
      <v-btn
        outlined
        :disabled="loading"
        color="secondary"
        @click="showDay({ date: new Date() })">
        Today
      </v-btn>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="ml-2"
            icon
            :disabled="loading"
            v-bind="attrs"
            v-on="on"
            @click="$refs.calendar.prev()">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </template>
        <span>
          Previous {{ isMonthlyCalendar ? 'month' : 'day' }}
        </span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="mr-2"
            icon
            :disabled="loading"
            v-bind="attrs"
            v-on="on"
            @click="$refs.calendar.next()">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </template>
        <span>
          Next {{ isMonthlyCalendar ? 'month' : 'day' }}
        </span>
      </v-tooltip>
      <v-progress-circular
        v-if="loading"
        indeterminate>
      </v-progress-circular>
      <h2 v-else>
      {{
        new Date(currentDate)
        | dateFormat(isMonthlyCalendar ? 'MMMM YYYY' : 'D MMMM YYYY')
      }}
      </h2>
      <v-spacer></v-spacer>
      <v-btn
        outlined
        :disabled="loading"
        color="secondary"
        @click="calendarType = isMonthlyCalendar ? 'day' : 'month'">
        Show {{ isMonthlyCalendar ? 'Daily' : 'Monthly' }} calendar
      </v-btn>
    </div>
    <v-sheet v-show="!loading" height="550">
      <v-calendar
        dark
        color="purple"
        ref="calendar"
        locale="en"
        v-model="currentDate"
        :events="events"
        :weekdays="weekdays"
        :type="calendarType"
        @click:date="showDay"
        @click:event="selectArticle"
        @change="getArticles">
        <template v-if="isMonthlyCalendar" v-slot:day="{ date }">
          <div
            v-if="articles[date]"
            class="d-flex justify-center mt-2">
            <v-chip
              light
              :ripple="false"
              :color="colorMap[date]"
              :class="{
                'theme--dark': colorMap[date] === 'purple lighten-1'
              }"
              @click="showDay({ date })">
              {{
                `${articles[date]}
                ${articles[date] > 1 ? 'articles' : 'article'}`
              }}
            </v-chip>
          </div>
        </template>
      </v-calendar>
    </v-sheet>
    <v-dialog
      v-if="selectedArticle"
      v-model="selectedArticle"
      :activator="selectedElement"
      max-width="800px">
      <v-card dark flat>
        <v-card-title>
          {{ selectedArticle.title }}
        </v-card-title>
        <v-img
          class="mt-2 mb-3 mx-3"
          :src="selectedArticle.imageLink">
        </v-img>
        <v-card-subtitle>
          {{ selectedArticle.description }}
        </v-card-subtitle>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text :href="selectedArticle.link">
            Go to article
          </v-btn>
          <v-btn text @click="deselectArticle">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import environment from '../environment';

import StringMap from '../interfaces/string-map';
import Article from '../interfaces/article';
import CalendarEvent from '../interfaces/event';
import CalendarDate from '../interfaces/calendar-date';

@Component({})
export default class Home extends Vue {
  loading = true;

  articles: Article[] | StringMap<number> = [];

  events: CalendarEvent[] = [];

  colorMap: StringMap<string> = {};

  currentDate = new Date();

  selectedArticle: Article | null = null;

  selectedElement: EventTarget | null = null;

  weekdays = [1, 2, 3, 4, 5, 6, 0];

  calendarType = 'month';

  isMonthlyCalendar = this.calendarType === 'month';

  showDay(payload: CalendarDate | { date: Date | string }) {
    this.calendarType = 'day';
    this.currentDate = new Date(payload.date);
  }

  @Watch('calendarType')
  onCalendarTypeChange() {
    this.isMonthlyCalendar = this.calendarType === 'month';
  }

  async getArticles(
    { start, end }: { start: CalendarDate; end: CalendarDate },
  ) {
    this.loading = true;

    const startDate = new Date(start.date)
      .toISOString()
      .substr(0, 10);

    if (this.isMonthlyCalendar) {
      this.events = [];

      const endDate = new Date(end.date)
        .toISOString()
        .substr(0, 10);

      const articleCounts: StringMap<number> = await (
        await fetch(
          `${environment.API_URL}/articles/count?start=${startDate}&end=${endDate}`,
        )
      ).json();

      Object.entries(articleCounts).forEach((entry) => {
        this.colorMap[entry[0]] = entry[1] < 20
          ? `purple lighten-${5 - Math.floor(entry[1] / 5)}`
          : 'purple lighten-1';
      });

      this.articles = articleCounts;
    } else {
      const articles: Article[] = await (
        await fetch(
          `${environment.API_URL}/articles?date=${startDate}`,
        )
      ).json();

      const events = articles.map(
        (article) => {
          const datePublished = new Date(article.datePublished);
          const event = {
            name: article.title,
            color: 'purple',
            timed: true,
            start: datePublished,
          };

          return event;
        },
      );

      this.articles = articles;
      this.events = events;
    }

    this.loading = false;
  }

  selectArticle(
    { nativeEvent, event }: { nativeEvent: Event; event: CalendarEvent },
  ) {
    this.selectedElement = nativeEvent.target;
    this.selectedArticle = (this.articles as Article[])
      .find((article) => article.title === event.name) as Article;

    nativeEvent.stopPropagation();
  }

  deselectArticle() {
    this.selectedElement = null;
    this.selectedArticle = null;
  }
}
</script>
