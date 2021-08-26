<template>
  <div
    class="flex flex-col overflow-hidden border border-t-0 border-b-0 rounded-lg shadow-md "
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <!-- Date -->
    <transition name="scale-y-top">
      <div
        v-show="hover"
        class="text-center text-gray-400 border-t bg-gradient-to-b from-gray-100"
      >
        {{ moment(play.createdAt).format("MMMM D, YYYY, HH:mm") }}
      </div>
    </transition>
    <!-- Players -->
    <div class="flex flex-wrap">
      <template v-for="result in playCopy.player_results" :key="result.id">
        <div class="relative flex flex-col w-1/5 sm:w-1/10">
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
            <!-- Player nick and MMR -->
            <div class="flex flex-col">
              <b class="truncate item" v-if="!result.bot">
                {{ getPlayer(result.player).nick }}
              </b>
              <span
                class="flex flex-col space-x-1 text-xs italic sm:flex-row"
                v-if="!result.bot"
              >
                <span>{{ result.mmr }}</span>
                <b
                  :class="[
                    { 'text-green-400': result.win },
                    { 'text-red-400': !result.win },
                  ]"
                >
                  <span v-if="result.win">+</span>
                  <span v-if="!result.win">-</span>
                  {{ Math.abs(result.mmrPlus) }}
                </b>
              </span>
            </div>
            <!-- Rasult -->
            <div class="flex flex-col justify-center h-full">
              <transition name="fade">
                <table
                  class="w-full my-auto text-center"
                  v-if="!result.bot"
                  v-show="hover"
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
            <span
              :class="[
                'pb-2 truncate item transition-opacity duration-500',
                { 'opacity-0': hover },
              ]"
              v-if="!result.bot"
            >
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
          <!-- Rank -->
          <transition name="fade">
            <div
              v-if="hover && !result.bot"
              class="absolute left-0 right-0 flex justify-center bottom-1"
            >
              <span class="relative flex">
                <img
                  class="h-12"
                  :src="`rank/${getRank(result.mmr).name}.png`"
                />
                <i
                  class="absolute animate-bounce -right-5 bottom-3"
                  v-if="
                    getRank(result.mmr).name !==
                    getRank(result.mmr + result.mmrPlus).name
                  "
                >
                  <i
                    class="text-green-400 fa fa-arrow-up"
                    v-if="result.mmrPlus > 0"
                  ></i>
                  <i
                    class="absolute text-red-400 animate-bounce -right-5 bottom-3 fa fa-arrow-down"
                    v-if="result.mmrPlus < 0"
                  ></i>
                </i>
              </span>
            </div>
          </transition>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";

import { GET_PLAYER, GET_HERO, GET_RANK } from "@/store/type/getters";

import Rank from "@/store/model/rank";

export default {
  data() {
    return {
      moment,
      Rank,
      hover: false,
      playCopy: null,
    };
  },
  props: {
    play: {},
  },
  computed: {
    ...mapGetters([GET_PLAYER, GET_HERO, GET_RANK]),
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
