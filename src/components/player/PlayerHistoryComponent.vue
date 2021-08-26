<template>
  <div class="flex flex-col" v-if="player.id">
    <!-- Header -->
    <div class="grid grid-cols-3">
      <!-- Zoom -->
      <div class="flex items-center p-2 space-x-2">
        <button
          :class="[
            'flex text-xs items-center justify-center bg-gradient-to-t text-gray-700 from-gray-100 to-white border rounded-full shadow-sm',
            `w-${4 + i} h-${4 + i}`,
            {
              'text-blue-900 from-blue-400 to-blue-200 border-blue-200':
                i === proportion,
            },
            { 'hidden sm:flex': i > 3 },
          ]"
          v-for="i in 5"
          :key="'zoom' + i"
          @click="proportion = i"
        >
          {{ i }}
        </button>
      </div>
      <!-- Nick -->
      <div
        class="flex items-center justify-center p-2 text-lg font-extrabold text-center text-gray-700 border border-b-0 rounded-t-lg bg-gradient-to-t from-gray-100 to-white"
      >
        {{ player.nick }} - {{ player.mmr }}
      </div>
      <!-- Rank -->
      <div
        class="flex flex-col items-end justify-center space-x-0 sm:flex-row sm:items-center sm:justify-end sm:space-x-3"
      >
        <div class="flex justify-center w-full sm:justify-end">
          <img class="h-8" :src="`rank/${rankSelected?.name}.png`" />
        </div>
        <select class="capitalize" v-model="rankSelected">
          <option v-for="rank in ranks" :key="rank.id" :value="rank">
            {{ rank.name }}
          </option>
        </select>
      </div>
    </div>
    <!-- Graph and lines -->
    <div class="relative overflow-auto">
      <!-- Number lines -->
      <div
        class="sticky left-0 flex flex-col justify-end w-full h-full text-xs text-gray-500 border border-gray-300 rounded-lg rounded-tr-none shadow-lg sm:rounded-tr-lg bg-gradient-to-t from-gray-200 to-gray-50"
        :style="[{ minHeight: `${height * proportion}px` }]"
      >
        <!-- Max -->
        <div
          class="absolute top-0 flex justify-between w-full px-2"
          v-if="playerResults.length > 0"
        >
          <i>{{ maxMMR }}</i>
          <i>{{ maxMMR }}</i>
        </div>
        <!-- 1400 -->
        <div
          class="border-t border-gray-400 rounded-lg"
          :style="[
            {
              transform: `translateY(-${
                Math.abs(lastResult.mmr + lastResult.mmrPlus) * proportion
              }px)`,
            },
          ]"
          v-if="
            maxMMR - minMMR > 0 &&
            maxMMR !== lastResult.mmr + lastResult.mmrPlus
          "
        ></div>
      </div>
      <!-- Graph -->
      <div class="absolute top-0 w-full h-full">
        <!-- Graph content -->
        <div
          class="flex h-full"
          :style="[{ minHeight: `${height * proportion}px` }]"
        >
          <!-- Column -->
          <div
            :class="[
              'flex items-end h-full bg-gradient-to-t',
              {
                'hover:bg-white hover:bg-opacity-30 cursor-pointer':
                  pr.id !== playerResultSelected.id,
              },
              {
                'bg-white bg-opacity-50 shadow-lg':
                  pr.id === playerResultSelected.id,
              },
            ]"
            v-for="pr in playerResults"
            :key="pr.id"
            @click="playerResultSelected = pr"
          >
            <!-- Dash -->
            <div
              :class="[
                'h-1 opacity-70',
                {
                  'bg-gradient-to-tr from-green-300 to-green-500 win': pr.win,
                },
                {
                  'bg-gradient-to-br from-red-300 to-red-500 lost': !pr.win,
                },
                {
                  none: pr.mmrPlus === 0,
                },
              ]"
              :style="[
                {
                  transform: `translateY(-${
                    Math.abs(
                      pr.mmr - minMMR + (pr.mmrPlus < 0 ? pr.mmrPlus : 0)
                    ) * proportion
                  }px)`,
                },
                {
                  minWidth:
                    Math.abs(pr.mmrPlus !== 0 ? pr.mmrPlus : 25) * proportion +
                    'px',
                },
                {
                  minHeight:
                    Math.abs(pr.mmrPlus !== 0 ? pr.mmrPlus : 25) * proportion +
                    'px',
                },
              ]"
            ></div>
          </div>
          <!-- Empty player results -->
          <div
            class="flex items-center justify-center w-full h-24 text-gray-500"
            v-if="playerResults.length === 0"
          >
            <div><i>No hay informacion que mostrar </i> 😒</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Axios from "axios";

export default {
  data() {
    return {
      playerResultsAll: [],
      playerResults: [],
      playerResultSelected: {},
      rankSelected: {},
      maxMMR: 0,
      minMMR: Number.MAX_SAFE_INTEGER,
      proportion: 2,
    };
  },
  props: {
    player: Object,
  },
  computed: {
    ...mapState({
      ranks: (state) => state.ranks,
    }),
    lastResult() {
      return this.playerResults[this.playerResults.length - 1];
    },
    height() {
      if (this.playerResults.length === 0) return 50;
      if (this.maxMMR - this.minMMR <= 0) return 10;
      return this.maxMMR - this.minMMR;
    },
  },
  methods: {
    maxRank() {
      let max = 0;
      this.playerResultsAll.forEach((pr) => {
        max = Math.max(pr.mmr + pr.mmrPlus, max);
      });
      this.ranks = this.$store.state.ranks.filter((r) => max >= r.min);
      if (!this.ranks.find((r) => r === this.rankSelected))
        this.rankSelected = this.ranks[this.ranks.length - 1];
    },
    getResults() {
      Axios.get(this.$store.state.strapi + "/player-results?_limit=-1").then(
        ({ data }) => {
          this.playerResultsAll = data.filter(
            (p) => p.player?.id === this.player.id
          );
          // check rank
          this.playerResults = this.playerResultsAll.filter(
            (pr) =>
              this.rankSelected.min <= pr.mmr && pr.mmr <= this.rankSelected.max
          );
          // check mmr
          this.maxMMR = 0;
          this.minMMR = Number.MAX_SAFE_INTEGER;
          this.playerResults.forEach((pr) => {
            this.maxMMR = Math.max(pr.mmr + pr.mmrPlus, this.maxMMR);
            this.minMMR = Math.min(pr.mmr + pr.mmrPlus, this.minMMR);
          });
        }
      );
    },
  },
  mounted() {
    this.rankSelected = this.ranks[0];
    this.getResults();
  },
  watch: {
    playerResultSelected(val) {
      this.$emit("result:select", val);
    },
    player() {
      this.getResults();
    },
    rankSelected() {
      this.getResults();
    },
  },
};
</script>

<style lang="scss" scoped>
.win {
  clip-path: polygon(20% 100%, 0 100%, 0% 80%, 80% 0, 100% 0, 100% 20%);
}
.lost {
  clip-path: polygon(0 20%, 0 0, 20% 0, 100% 80%, 100% 100%, 80% 100%);
}
.none {
  clip-path: polygon(0 80%, 0 100%, 100% 100%, 100% 80%);
}
</style>