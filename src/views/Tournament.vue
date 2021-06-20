<template>
  <div class="t-container">
    <div class="t-actives">
      <span>T Activos</span>
      <button @click="tAdd = !tAdd">
        <span v-if="!tAdd">Start Trounament</span>
        <span v-else>Cancel Trounament</span>
      </button>
      <div class="t-list" v-if="tournaments.length > 0">
        <div class="t-itme" v-for="t in tournaments" :key="t.id">
          {{ t.name }}
        </div>
      </div>
      <div v-if="tournaments.length == 0">No hay torneos</div>
    </div>
    <add-tournament-component v-if="tAdd"></add-tournament-component>
  </div>
</template>

<script>
import { mapState } from "vuex";
import AddTournamentComponent from "@/components/AddTournamentComponent";

export default {
  data() {
    return {
      tAdd: false,
    };
  },
  computed: {
    ...mapState({
      tournaments: (state) => state.tournaments,
    }),
  },
  components: {
    AddTournamentComponent,
  },
};
</script>

<style scoped lang="scss">
.t-container {
  display: flex;

  .t-actives {
    display: flex;
    flex-direction: column;

    .t-list {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>