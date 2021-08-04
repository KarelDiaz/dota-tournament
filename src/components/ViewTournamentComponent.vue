<template>
  <div class="flex flex-col space-y-3">
    <!-- Header -->
    <div>
      <div class="text-4xl">{{ tournament.name }}</div>
      <div class="text-xs">
        {{ normalizeTournamentTypeName(tournament.type?.name) }}
      </div>
    </div>
    <!-- Play list -->
    <div v-if="tournament">
      <!-- All for All -->
      <div v-if="isAllForAll" class="flex flex-col sm:flex-row sm:flex-wrap">
        <template v-for="(itemf, indexf) in tournament.teams" :key="indexf">
          <template v-for="(iteml, indexl) in tournament.teams" :key="indexl">
            <div
              v-if="indexf < indexl"
              class="
                flex flex-col
                justify-between
                items-center
                p-3
                mb-3
                mr-3
                w-full
                sm:w-40
                text-center
                cursor-pointer
                text-gray-500
                hover:text-blue-500
                border border-gray-500 border-dashed
                hover:border-blue-500
              "
            >
              <span
                :class="{
                  'font-bold': eloMediaTeam(itemf) > eloMediaTeam(iteml),
                }"
              >
                {{ itemf.name }}
              </span>
              <i>vs</i>
              <span
                :class="{
                  'font-bold': eloMediaTeam(itemf) < eloMediaTeam(iteml),
                }"
              >
                {{ iteml.name }}
              </span>
            </div>
          </template>
        </template>
      </div>
      <!-- Direct -->
      <div v-if="isDirect"></div>
    </div>
    <div v-else>
      <h1>No hay tourneo seleccionado</h1>
    </div>
  </div>
</template>

<script>
import {
  ALL_FOR_ALL_1,
  ALL_FOR_ALL_3,
  ALL_FOR_ALL_5,
  DIRECT_1,
  DIRECT_3,
  DIRECT_5,
} from "@/store/tournament-type";

export default {
  data() {
    return {
      ALL_FOR_ALL_1,
      ALL_FOR_ALL_3,
      ALL_FOR_ALL_5,
      DIRECT_1,
      DIRECT_3,
      DIRECT_5,
    };
  },
  props: {
    tournament: null,
  },
  computed: {
    isAllForAll() {
      switch (this.tournament.type?.name) {
        case this.ALL_FOR_ALL_1:
        case this.ALL_FOR_ALL_3:
        case this.ALL_FOR_ALL_5:
          return true;
      }
      return false;
    },
    isDirect() {
      switch (this.tournament.type?.name) {
        case this.DIRECT_1:
        case this.DIRECT_3:
        case this.DIRECT_5:
          return true;
      }
      return false;
    },
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
      return this.$store.state.players.find((p) => p.id === id);
    },
    normalizeTournamentTypeName(name) {
      if (!name) return "";
      let out = "";
      for (let i = 0; i < name.length; i++)
        out += name[i] !== "_" ? name[i] : " ";
      return out.toUpperCase();
    },
  },
};
</script>