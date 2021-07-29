<template>
  <div class="team">
    <div class="header">
      {{ team.name }}
      <i class="elo">{{ eloMediaTeam(team) }}</i>
    </div>
    <div class="player-container">
      <span class="player" v-for="p in team.players" :key="p">
        {{ player(p).nick }}
        <i class="elo">{{ player(p).elo }}</i>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    team: {},
  },
  methods: {
    eloMediaTeam(team) {
      if (team.players.length == 0) return 0;
      let s = 0;
      team.players.forEach((p) => {
        s += this.player(p).elo;
      });
      return parseInt(s / team.players.length);
    },
    player(id) {
      return this.$store.state.players.find((p) => p.id == id);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/theme/theme.scss";
.team {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: map-get($map: $spacings, $key: 2);
  margin-top: map-get($map: $spacings, $key: 3);
  border: 1px solid rgba(0, 225, 255, 0.5);
  background: rgba(0, 247, 255, 0.3);
  min-width: 100px;

  &:last-of-type {
    margin-right: 0;
  }
  .elo {
    font-size: 0.7rem;
  }
  .header {
    display: flex;
    flex-direction: column;
  }
  .player-container {
    display: flex;
    flex-direction: column;
    margin-top: map-get($map: $spacings, $key: 3);

    .player {
      padding: map-get($map: $spacings, $key: 1);
    }
  }
}
</style>