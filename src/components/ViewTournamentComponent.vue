<template>
  <div class="flex flex-col space-y-3">
    <div v-if="tournamentCopy">
      <!-- Header -->
      <div>
        <div class="text-4xl">{{ tournamentCopy.name }}</div>
        <div class="text-xs">
          {{ normalizeTournamentTypeName(tournamentCopy.type?.name) }}
        </div>
      </div>
      <!-- Play list -->
      <div class="mt-3">
        <!-- All for All -->
        <div v-if="isAllForAll" class="flex flex-col sm:flex-row sm:flex-wrap">
          <template
            v-for="(itemf, indexf) in tournamentCopy.teams"
            :key="indexf"
          >
            <template
              v-for="(iteml, indexl) in tournamentCopy.teams"
              :key="indexl"
            >
              <tournament-match-component
                v-if="indexf < indexl"
                :team1="itemf"
                :team2="iteml"
                :tournament="tournamentCopy"
                class="h-full mb-3 mr-3"
              ></tournament-match-component>
            </template>
          </template>
        </div>
        <!-- Direct -->
        <div class="flex" v-if="isDirect">
          <template
            v-for="(team, i) in tournamentCopy.teams"
            :key="i"
            class="h-full bg-green-500"
          >
            <tournament-match-component
              v-if="i % 2 === 0"
              :team1="tournamentCopy.teams[i]"
              :team2="tournamentCopy.teams[i + 1]"
              :tournament="tournamentCopy"
              class="h-full mb-3 mr-3"
            ></tournament-match-component>
          </template>
        </div>
      </div>
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
import TournamentMatchComponent from "@/components/TournamentMatchComponent";

export default {
  data() {
    return {
      ALL_FOR_ALL_1,
      ALL_FOR_ALL_3,
      ALL_FOR_ALL_5,
      DIRECT_1,
      DIRECT_3,
      DIRECT_5,
      tournamentCopy: null,
    };
  },
  props: {
    tournament: null,
  },
  components: {
    TournamentMatchComponent,
  },
  computed: {
    isAllForAll() {
      switch (this.tournamentCopy.type?.name) {
        case this.ALL_FOR_ALL_1:
        case this.ALL_FOR_ALL_3:
        case this.ALL_FOR_ALL_5:
          return true;
      }
      return false;
    },
    isDirect() {
      switch (this.tournamentCopy.type?.name) {
        case this.DIRECT_1:
        case this.DIRECT_3:
        case this.DIRECT_5:
          return true;
      }
      return false;
    },
  },
  created() {
    this.tournamentCopy = this.tournament;
  },
  methods: {
    normalizeTournamentTypeName(name) {
      if (!name) return "";
      let out = "";
      for (let i = 0; i < name.length; i++)
        out += name[i] !== "_" ? name[i] : " ";
      return out.toUpperCase();
    },
  },
  watch: {
    tournament(val) {
      this.tournamentCopy = val;
    },
    tournamentCopy(val) {
      val.teams?.sort((a, b) => {
        return a.name > b.name;
      });
    },
  },
};
</script>