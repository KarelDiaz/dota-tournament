<template>
  <div
    class="
      flex flex-col
      border border-gray-100
      p-3
      space-y-3
      bg-gradient-to-t
      from-gray-100
      text-gray-500
    "
  >
    <div>{{ team.name }}</div>
    <div class="flex space-x-2">
      <span>P :</span>
      <span>
        {{ teamPlays.length }}
      </span>
    </div>
    <div class="flex space-x-2">
      <span>V :</span>
      <span :class="[{ 'text-green-500': teamWonPlays.length > 0 }]">
        {{ teamWonPlays.length }}
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