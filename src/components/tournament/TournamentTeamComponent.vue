<template>
  <div
    :class="[
      'flex flex-col text-center p-1 sm:p-3 space-y-3 bg-gradient-to-t border from-gray-50 to-white text-gray-500 rounded-lg shadow-md',
      {
        'bg-gradient-to-t from-yellow-400 to-yellow-200 border-yellow-400':
          position === 0 && teamWonPlays.length > 0,
      },
      {
        'bg-gradient-to-t from-gray-300 to-gray-100 border-gray-300':
          position === 1 && teamWonPlays.length > 0,
      },
      {
        'bg-gradient-to-t from-yellow-800 to-yellow-600 border-yellow-800':
          position === 2 && teamWonPlays.length > 0,
      },
    ]"
  >
    <!-- Team name and elo -->
    <div
      :class="[
        'break-all sm:break-normal flex flex-col',
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
      <i>
        <small>{{ elo }}</small>
      </i>
    </div>
    <!-- plays,vistories,defeates -->
    <div
      :class="[
        'flex justify-evenly items-center  select-none bg-gradient-to-t from-gray-100 to-white shadow-md rounded-full',
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
</template>

<script>
export default {
  data() {
    return {
      elo: 0,
      teamPlays: [], // partidos
      teamWonPlays: [], // partidos ganados
    };
  },
  props: {
    team: Object,
    tournament: Object,
    tournamentPlays: Array,
    position: Number,
  },
  methods: {
    initTeam() {
      this.elo = 0;
      this.team.players.forEach((p_id) => {
        this.elo += this.$store.state.players.find((pp) => pp.id == p_id).elo;
      });
      this.elo = Math.round(this.elo / this.team.players.length);
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