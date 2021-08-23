<template>
  <div class="flex flex-col" v-if="player.id">
    <!-- Header -->
    <div class="grid grid-cols-2 sm:grid-cols-3">
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
      <div
        class="flex items-center justify-center p-2 text-lg font-extrabold text-center text-gray-700 border border-b-0 rounded-t-lg bg-gradient-to-t from-gray-100 to-white"
      >
        {{ player.nick }}
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
          <i>{{ maxElo }}</i>
          <i>{{ maxElo }}</i>
        </div>
        <!-- 1400 -->
        <div
          class="border-t border-gray-400 rounded-lg"
          :style="[
            {
              transform: `translateY(-${
                Math.abs(1400 - minElo) * proportion
              }px)`,
            },
          ]"
          v-if="playerResults.length > 0"
        ></div>
        <!-- Min -->
        <div
          class="absolute bottom-0 flex justify-between w-full px-2"
          v-if="playerResults.length > 0"
        >
          <i>{{ minElo }}</i>
          <i>{{ minElo }}</i>
        </div>
      </div>
      <!-- Graph -->
      <div class="absolute top-0 w-full h-full">
        <!-- Graph -->
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
              ]"
              :style="[
                {
                  transform: `translateY(-${
                    Math.abs(
                      pr.elo - minElo + (pr.eloPlus < 0 ? pr.eloPlus : 0)
                    ) * proportion
                  }px)`,
                },
                { minWidth: Math.abs(pr.eloPlus) * proportion + 'px' },
                { minHeight: Math.abs(pr.eloPlus) * proportion + 'px' },
              ]"
            ></div>
          </div>
          <!-- Empty player results -->
          <div
            class="flex items-center justify-center w-full italic text-gray-500"
            v-if="playerResults.length === 0"
          >
            No hay plays
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
export default {
  data() {
    return {
      playerResults: [],
      playerResultSelected: {},
      maxElo: 1400,
      minElo: 1400,
      proportion: 2,
    };
  },
  props: {
    player: Object,
  },
  computed: {
    height() {
      if (this.playerResults.length === 0) return 50;
      if (this.playerResults.length === 1)
        return (
          this.maxElo - this.minElo + Math.abs(this.playerResults[0].eloPlus)
        );
      return this.maxElo - this.minElo;
    },
  },
  methods: {
    checkElo() {
      let margin = 10;
      this.maxElo = 1400;
      this.minElo = 1400;
      this.playerResults.forEach((pr) => {
        this.maxElo = Math.max(pr.elo + pr.eloPlus, this.maxElo);
        this.minElo = Math.min(pr.elo + pr.eloPlus, this.minElo);
      });
      if (this.maxElo === 1400) this.maxElo += margin;
      if (this.minElo === 1400) this.minElo -= margin;
    },
    getResults() {
      Axios.get(this.$store.state.strapi + "/player-results?_limit=-1").then(
        ({ data }) => {
          this.playerResults = data.filter(
            (p) => p.player?.id === this.player.id
          );
          this.checkElo();
        }
      );
    },
  },
  created() {
    this.getResults();
  },
  watch: {
    playerResultSelected(val) {
      this.$emit("result:select", val);
    },
    player() {
      this.getResults();
    },
  },
};
</script>

<style lang="scss" scoped>
.win {
  clip-path: polygon(20% 100%, 0 100%, 0% 80%, 80% 0, 100% 0, 100% 20%);
  filter: drop-shadow(5px 5px 5px black);
}
.lost {
  clip-path: polygon(0 20%, 0 0, 20% 0, 100% 80%, 100% 100%, 80% 100%);
}
</style>