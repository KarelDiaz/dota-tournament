<template>
  <div
    class="flex flex-col border border-t-0 border-b-0"
    @mouseover="date = true"
    @mouseleave="date = false"
  >
    <transition name="scale-y-top">
      <div
        v-show="date"
        class="bg-gradient-to-b from-gray-100 text-center text-gray-400"
      >
        {{ moment(play.createdAt).format("MMMM D, YYYY, HH:mm") }}
      </div>
    </transition>
    <div class="flex flex-wrap">
      <div
        v-for="result in playCopy.player_results"
        class="w-1/5 sm:w-1/10 flex flex-col"
        :key="result.id"
      >
        <!-- Side -->
        <div class="flex">
          <div
            v-if="result.side === 'good'"
            class="h-2 w-full bg-gradient-to-b from-green-200 to-green-400"
          ></div>
          <div
            v-if="result.side === 'bad'"
            class="h-2 w-full bg-gradient-to-b from-red-200 to-red-400"
          ></div>
        </div>
        <!-- Result -->
        <div
          class="
            h-40
            flex flex-col
            justify-between
            bg-center bg-cover
            text-white text-xs
            sm:text-base
            shadow-inner
            p-1
          "
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
            <b class="item truncate" v-if="!result.bot">
              {{ getPlayer(result.player).nick }}
            </b>
            <span
              class="flex flex-col space-x-1 sm:flex-row italic text-xs"
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
          <span class="item truncate pb-2" v-if="!result.bot">
            {{ getHero(result.hero).displayName }}
          </span>
        </div>
        <!-- Win -->
        <div class="flex">
          <div
            v-if="result.win"
            class="h-2 w-full bg-gradient-to-b from-yellow-200 to-yellow-400"
          ></div>
          <div
            v-if="!result.win"
            class="h-2 w-full bg-gradient-to-b from-gray-200 to-gray-400"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

import Player from "@/store/model/player";
//import Play from "@/store/model/play";
import Hero from "@/store/model/hero";

export default {
  name: "PlayComponent",
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
    playCopy(val) {
      val.player_results.sort((a, b) => {
        if (a.side == b.side) return a.bot;
        return a.side < b.side;
      });
    },
  },
};
</script>
