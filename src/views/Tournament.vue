<template>
  <div class="tournament-container">
    <div class="actives">
      <div class="header">
        <b class="text">Tournaments</b>
        <button
          :class="['add-tournament', { success: !tAdd }, { danger: tAdd }]"
          @click="tAdd = !tAdd"
        >
          <i class="fa fa-plus" v-if="!tAdd"></i>
          <i class="fa fa-trash" v-else></i>
        </button>
      </div>
      <div class="list" v-if="tournaments.length > 0">
        <button
          :class="['item', { success: tournamentSelected == t }]"
          v-for="t in tournaments"
          :key="t.id"
          @click="tournamentSelected = t"
        >
          <b>{{ t.name }}</b>
          <hr />
          Teams {{ t.teams.length }}
          <hr />
          <i>{{ moment(t.createdAt).format("MMMM D, YYYY, HH:mm") }}</i>
        </button>
      </div>
      <div class="list" v-if="tournaments.length == 0">No hay torneos</div>
    </div>
    <div class="t-content">
      <transition name="fade">
        <add-tournament-component
          @tournament:add="tAdd = false"
          class="add-t"
          v-if="tAdd"
        ></add-tournament-component>
      </transition>
      <view-tournament-component :tournament="tournamentSelected">
      </view-tournament-component>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
import AddTournamentComponent from "@/components/AddTournamentComponent";
import ViewTournamentComponent from "@/components/ViewTournamentComponent";

export default {
  data() {
    return {
      moment: moment,
      tAdd: false,
      tournamentSelected: {},
    };
  },
  computed: {
    ...mapState({
      tournaments: (state) => state.tournaments,
    }),
  },
  components: {
    AddTournamentComponent,
    ViewTournamentComponent,
  },
};
</script>

<style scoped lang="scss">
@import "@/theme/theme.scss";

.tournament-container {
  display: flex;

  .header {
    display: flex;
    justify-content: space-between;
    padding: map-get($map: $spacings, $key: 2);

    .text {
      font-size: 1.1rem;
    }
  }

  .actives {
    display: flex;
    flex-direction: column;
    min-width: 200px;
    max-width: 200px;

    .list {
      display: flex;
      flex-direction: column;
      padding: map-get($map: $spacings, $key: 2);

      .item {
        margin-top: map-get($map: $spacings, $key: 2);
      }
    }
  }

  .t-content {
    padding-right: map-get($map: $spacings, $key: 2);
  }
}
</style>