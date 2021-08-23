<template>
  <div
    class="flex flex-col overflow-hidden border border-t-0 border-b-0 rounded-lg shadow-md "
    @mouseover="date = true"
    @mouseleave="date = false"
  >
    <!-- Date -->
    <transition name="scale-y-top">
      <div
        v-show="date"
        class="text-center text-gray-400 border-t  bg-gradient-to-b from-gray-100"
      >
        {{ moment(play.createdAt).format("MMMM D, YYYY, HH:mm") }}
      </div>
    </transition>
    <!-- Players -->
    <div class="flex flex-wrap">
      <template v-for="result in playCopy.player_results" :key="result.id">
        <div class="flex flex-col w-1/5 sm:w-1/10">
          <!-- Side -->
          <div>
            <div
              v-if="result.side === 'good'"
              class="w-full h-2 bg-gradient-to-b from-green-200 to-green-400"
            ></div>
            <div
              v-if="result.side === 'bad'"
              class="w-full h-2 bg-gradient-to-b from-red-200 to-red-400"
            ></div>
          </div>
          <!-- Result -->
          <div
            :class="[
              'flex flex-col justify-between h-40 p-1 text-xs text-white bg-center bg-cover sm:text-base',
              { 'bg-opacity-10': result.bot },
              { 'bg-green-400': result.side === 'good' },
              { 'bg-red-400': result.side === 'bad' },
            ]"
            :style="[
              {
                'background-image':
                  'url(' +
                  $store.state.local +
                  (result.bot
                    ? '/npc/bot.png'
                    : `/npc/${getHero(result.hero).name}.png`) +
                  ')',
              },
            ]"
          >
            <!-- Player nick and Elo -->
            <div class="flex flex-col">
              <b class="truncate item" v-if="!result.bot">
                {{ getPlayer(result.player).nick }}
              </b>
              <span
                class="flex flex-col space-x-1 text-xs italic sm:flex-row"
                v-if="!result.bot"
              >
                <span>{{ result.elo }}</span>
                <b
                  :class="[
                    { 'text-green-400': result.win },
                    { 'text-red-400': !result.win },
                  ]"
                >
                  <span v-if="result.win">+</span>
                  <span v-if="!result.win">-</span>
                  {{ Math.abs(result.eloPlus) }}
                </b>
              </span>
            </div>
            <!-- Rasult -->
            <div class="flex flex-col justify-center h-full">
              <transition name="fade">
                <table
                  class="w-full my-auto text-center"
                  v-if="!result.bot"
                  v-show="date"
                >
                  <tr>
                    <td>K</td>
                    <td>D</td>
                    <td>A</td>
                  </tr>
                  <tr>
                    <td>
                      <b>{{ result.kills }}</b>
                    </td>
                    <td>
                      <b>{{ result.deths }}</b>
                    </td>
                    <td>
                      <b>{{ result.asist }}</b>
                    </td>
                  </tr>
                </table>
              </transition>
            </div>
            <!-- Hero name -->
            <span class="pb-2 truncate item" v-if="!result.bot">
              {{ getHero(result.hero).displayName }}
            </span>
          </div>
          <!-- Win -->
          <div>
            <div
              v-if="result.win"
              class="w-full h-2 bg-gradient-to-b from-yellow-200 to-yellow-400"
            ></div>
            <div
              v-if="!result.win"
              class="w-full h-2 bg-gradient-to-b from-gray-200 to-gray-400"
            ></div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import moment from "moment";

import Player from "@/store/model/player";
import Hero from "@/store/model/hero";

export default {
  data() {
    return {
      moment,
      date: false,
      playCopy: null,
    };
  },
  props: {
    play: {},
  },
  methods: {
    getPlayer(id) {
      const temp = this.$store.state.players.find((p) => p.id == id);
      return temp ? temp : new Player();
    },
    getHero(id) {
      const temp = this.$store.state.heroes.find((p) => p.id == id);
      return temp ? temp : new Hero();
    },
  },
  created() {
    // the copy is because the watcher doesnt run on props
    this.playCopy = this.play;
  },
  watch: {
    play(val) {
      this.playCopy = val;
    },
    playCopy(val) {
      val.player_results.sort((a, b) => {
        if (a.side == b.side)
          if (a.side === "good") return a.bot ? -1 : 1;
          else return a.bot ? 1 : -1;

        return b.side.localeCompare(a.side);
      });
    },
  },
};
</script>
