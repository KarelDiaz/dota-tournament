<template>
  <div>
    <h1>{{ tournament.name }}</h1>

    <div v-if="tournament.name" class="teams">
      <div v-for="team in tournament.teams" :key="team" class="team">
        <team-component :team="team"></team-component>
      </div>
    </div>
    <div v-else>
      <h1>No hay tourneo seleccionado</h1>
    </div>
  </div>
</template>

<script>
import TeamComponent from "@/components/TeamComponent";
export default {
  components: {
    TeamComponent,
  },
  props: {
    tournament: {},
  },
  methods: {
    eloMediaTeam(team) {
      if (team.players.length == 0) return 0;
      let s = 0;
      team.players.forEach((p) => {
        s += p.elo;
      });
      return parseInt(s / team.players.length);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/theme/theme.scss";
.teams {
  display: flex;
  flex-wrap: wrap;

  .team {
    margin-right: map-get($map: $spacings, $key: 1);
  }
}
</style>