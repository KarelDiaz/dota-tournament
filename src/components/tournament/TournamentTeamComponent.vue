<template>
  <div
    :class="[
      'flex relative justify-center min-w-max cursor-pointer text-center text-gray-500 rounded-lg shadow-md',
    ]"
    @click="open = !open"
  >
    <!-- Team content -->
    <div
      :class="[
        'flex z-10 flex-col bg-gradient-to-t justify-between p-2 space-y-3 rounded-lg sm:p-3 border',
        {
          ' from-yellow-400 to-yellow-200 border-yellow-400':
            position === 0 && teamWonPlays.length > 0,
        },
        {
          'from-gray-300 to-gray-100 border-gray-300':
            position === 1 && teamWonPlays.length > 0,
        },
        {
          'from-yellow-800 to-yellow-600 border-yellow-800':
            position === 2 && teamWonPlays.length > 0,
        },
        { 'from-gray-50 to-white ': teamWonPlays.length === 0 },
      ]"
    >
      <!-- Team name and mmr -->
      <div
        :class="[
          'flex flex-col',
          {
            'text-yellow-900': position === 0 && teamWonPlays.length > 0,
          },
          {
            'text-gray-500': position === 1 && teamWonPlays.length > 0,
          },
          {
            'text-gray-900': position === 2 && teamWonPlays.length > 0,
          },
        ]"
      >
        <span>{{ team.name }}</span>
        <span class="text-sm italic opacity-70">{{ mmr }}</span>
      </div>
      <!-- plays,vistories,defeates -->
      <div
        :class="[
          'flex justify-evenly items-center select-none bg-gradient-to-t from-gray-200  to-white shadow-md rounded-full',
          { border: position > 2 || teamWonPlays.length === 0 },
        ]"
      >
        <span title="Plays" class="cursor-help">
          {{ teamPlays.length }}
        </span>
        <span
          :class="[
            'font-bold text-xl cursor-help',
            { 'text-yellow-400': teamWonPlays.length > 0 },
          ]"
          title="Plays won"
        >
          {{ teamWonPlays.length }}
        </span>
        <span class="text-red-500 cursor-help" title="Plays lost">
          {{ teamPlays.length - teamWonPlays.length }}
        </span>
      </div>
    </div>
    <!-- Players -->
    <div
      :class="[
        'flex transform opacity-80 bg-gradient-to-t scale-x-105 -translate-x-1 flex-col overflow-hidden justify-evenly items-start transition-all duration-500 border border-l-0 rounded-r-lg',
        { 'p-2 ': open },
        {
          ' text-yellow-900 from-yellow-300  to-yellow-100 border-yellow-300':
            position === 0 && teamWonPlays.length > 0,
        },
        {
          'text-gray-500 from-gray-200   to-gray-50 border-gray-200':
            position === 1 && teamWonPlays.length > 0,
        },
        {
          'text-gray-900 from-yellow-700  to-yellow-500 border-yellow-700':
            position === 2 && teamWonPlays.length > 0,
        },
        { 'from-gray-100 to-gray-50 ': teamWonPlays.length === 0 },
      ]"
      :style="[{ width: open ? '200px' : '0px' }]"
    >
      <div
        class="flex items-center pl-3 space-x-1"
        v-for="id in team.players"
        :key="id + tournament.id"
      >
        <rank-component :mmr="getPlayer(id).mmr" />
        <span>{{ getPlayer(id).nick }}</span>
        <span class="text-xs italic opacity-70">
          {{ getPlayer(id).mmr }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { GET_PLAYER, GET_RANK } from "@/store/type/getters";

import RankComponent from "@/components/RankComponent.vue";

export default {
  components: { RankComponent },
  data() {
    return {
      mmr: 0,
      teamPlays: [], // partidos
      teamWonPlays: [], // partidos ganados
      open: false,
    };
  },
  props: {
    team: Object,
    tournament: Object,
    tournamentPlays: Array,
    position: Number,
  },
  computed: {
    ...mapGetters([GET_PLAYER, GET_RANK]),
  },
  methods: {
    initTeam() {
      this.mmr = 0;
      this.team.players.forEach((p_id) => {
        this.mmr += this.$store.state.players.find((pp) => pp.id == p_id).mmr;
      });
      this.mmr = Math.round(this.mmr / this.team.players.length);
      this.teamPlays = this.tournamentPlays.filter((p) => {
        return p.teamGood.id === this.team.id || p.teamBad.id === this.team.id;
      });
      this.teamWonPlays = this.tournamentPlays.filter((p) => {
        return (
          (p.teamGood.id === this.team.id && p.play.side_win === "good") ||
          (p.teamBad.id === this.team.id && p.play.side_win === "bad")
        );
      });
    },
  },
  created() {
    this.initTeam();
  },
  watch: {
    tournamentPlays() {
      this.initTeam();
    },
  },
};
</script>