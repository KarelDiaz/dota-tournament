<template>
  <div class="flex flex-col items-center space-y-2">
    <!-- Actions -->
    <div
      class="flex justify-center space-x-2 sm:space-x-3"
      v-if="window.location.hostname === 'localhost'"
    >
      <button
        @click="
          this.cleanInfo();
          this.clean('player-results');
          this.clean('plays');
        "
        class="btn"
      >
        Eliminar Plays
      </button>
      <button
        @click="
          this.cleanInfo();
          this.clean('teams');
          this.clean('tournament-plays');
          this.clean('tournaments');
        "
        class="btn"
      >
        Eliminar Tournaments
      </button>
      <button
        @click="
          this.cleanInfo();
          this.clean('player-results');
          this.clean('plays');
          this.clean('teams');
          this.clean('tournament-plays');
          this.clean('tournaments');
          this.clean('heroes');
          this.clean('players');
          this.clean('tournament-types');
        "
        class="btn"
      >
        Eliminar todo
      </button>
    </div>
    <!-- Info -->
    <div class="flex flex-col">
      <div
        :class="[
          { 'text-green-700': info.done },
          { 'text-red-700': !info.done },
        ]"
        v-for="info in infos"
        :key="info.text"
      >
        <i class="fa fa-check" v-if="info.done"></i>
        {{ info.text }}
      </div>
    </div>
  </div>
</template>

<script>
class Info {
  text;
  done;
  constructor(text = "", done = false) {
    this.text = text;
    this.done = done;
  }
}

import { mapState } from "vuex";
import Axios from "axios";

export default {
  data() {
    return {
      window: window,
      infos: [],
    };
  },
  computed: {
    ...mapState({
      strapi: (state) => state.strapi,
    }),
  },
  methods: {
    cleanInfo() {
      this.infos = [];
    },
    clean(api) {
      Axios.get(`${this.strapi}/${api}?_limit=-1`).then(({ data }) => {
        this.infos.push(new Info(`${data.length} ${api}`, data.length === 0));
        let n = 0;
        data.forEach((element) => {
          Axios.delete(`${this.strapi}/${api}/${element.id}`).then(() => {
            if (++n == data.length)
              this.infos.find(
                (i) => i.text === `${data.length} ${api}`
              ).done = true;
          });
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.btn {
  @apply bg-gradient-to-t from-red-300 to-red-200 border border-red-300 text-red-800 shadow-lg rounded-lg hover:from-red-200 hover:to-red-100 hover:border-red-200 p-3;
}
</style>