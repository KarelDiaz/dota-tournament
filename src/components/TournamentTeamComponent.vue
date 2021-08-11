<template>
  <div
    class="
      flex flex-col
      text-center
      border border-gray-100
      p-1
      sm:p-3
      space-y-3
      bg-gradient-to-t
      from-gray-100
      text-gray-500
    "
  >
    <div class="break-all sm:break-normal">{{ team.name }}</div>
    <div class="flex justify-center items-center space-x-2 select-none">
      <span title="Plays" class="cursor-help">
        {{ teamPlays.length }}
      </span>
      <span
        class="text-green-500 font-bold text-xl cursor-help"
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
      teamPlays: [],
      teamWonPlays: [],
    };
  },
  props: {
    team: Object,
    tournament: Object,
    tournamentPlays: Array,
  },
  methods: {
    initTeam() {
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