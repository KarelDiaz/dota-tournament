<template>
  <div>
    <!-- Tournament -->
    <div v-if="tournamentCopy" class="flex flex-col space-y-3">
      <!-- Header -->
      <div>
        <div class="text-4xl">{{ tournamentCopy.name }}</div>
        <div class="text-xs">
          {{ normalizeTournamentTypeName(tournamentCopy.type?.name) }}
        </div>
      </div>
      <!-- Teams and Matches -->
      <div class="flex">
        <!-- Teams -->
        <div class="flex flex-col min-w-min sm:w-52">
          <transition-group name="slide-left">
            <tournament-team-component
              class="mr-3 mb-3"
              v-for="team in tournamentTeamsOrder"
              :key="team.id + tournamentCopy.id"
              :team="team"
              :tournament="tournamentCopy"
              :tournamentPlays="tournamentPlays"
            >
            </tournament-team-component>
          </transition-group>
        </div>
        <!-- Matches -->
        <div>
          <!-- Tournament types -->
          <!-- All for All -->
          <div class="flex flex-wrap" v-if="isAllForAll">
            <template v-for="(itemf, indexf) in tournamentCopy.teams">
              <template v-for="(iteml, indexl) in tournamentCopy.teams">
                <tournament-match-component
                  @click-match="openModal(itemf, iteml, $event)"
                  @added="initPlays()"
                  v-if="indexf < indexl"
                  :key="itemf.id + iteml.id + tournamentCopy.id"
                  :team1="itemf"
                  :team2="iteml"
                  :tournament="tournamentCopy"
                  :tournamentPlays="tournamentPlays"
                  class="h-full mb-3 mr-3"
                ></tournament-match-component>
              </template>
            </template>
          </div>
          <!-- Direct -->
          <div class="flex" v-if="isDirect">
            <template
              v-for="(team, i) in tournamentCopy.teams"
              class="h-full bg-green-500"
            >
              <tournament-match-component
                @click-match="openModal(itemf, iteml, $event)"
                @added="initPlays()"
                :key="
                  tournamentCopy.teams[i].id +
                  tournamentCopy.teams[i + 1].id +
                  tournamentCopy.id
                "
                v-if="i % 2 === 0"
                :team1="tournamentCopy.teams[i]"
                :team2="tournamentCopy.teams[i + 1]"
                :tournament="tournamentCopy"
                :tournamentPlays="tournamentPlays"
                class="h-full mb-3 mr-3"
              ></tournament-match-component>
            </template>
          </div>
        </div>
      </div>
    </div>
    <!-- Empty tournaments -->
    <div v-else>
      <h1>No hay tourneo seleccionado</h1>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
import { mapState } from "vuex";

import {
  ALL_FOR_ALL_1,
  ALL_FOR_ALL_3,
  ALL_FOR_ALL_5,
  DIRECT_1,
  DIRECT_3,
  DIRECT_5,
} from "@/store/tournament-type";
import TournamentMatchComponent from "@/components/TournamentMatchComponent";
import TournamentTeamComponent from "@/components/TournamentTeamComponent.vue";

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
      tournamentPlays: [],
      tournamentTeamsOrder: [],
    };
  },
  props: {
    tournament: null,
  },
  computed: {
    ...mapState({
      strapi: (state) => state.strapi,
    }),
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
  components: {
    TournamentMatchComponent,
    TournamentTeamComponent,
  },
  methods: {
    initPlays() {
      Axios.get(this.strapi + "/tournament-plays?_limit=-1").then(
        ({ data }) => {
          this.tournamentPlays = data.filter(
            (p) => p.tournament.id === this.tournament.id
          );
        }
      );
    },
    normalizeTournamentTypeName(name) {
      if (!name) return "";
      let out = "";
      for (let i = 0; i < name.length; i++)
        out += name[i] !== "_" ? name[i] : " ";
      return out.toUpperCase();
    },
  },
  watch: {
    async tournament(val) {
      this.tournamentCopy = val;
      this.initPlays();
    },
    tournamentCopy(val) {
      val.teams?.sort((a, b) => {
        return a.name > b.name;
      });
    },
    tournamentPlays(plays) {
      // clone teams
      this.tournamentTeamsOrder = Array.from(this.tournamentCopy.teams);
      // sort cloned teams
      this.tournamentTeamsOrder.sort((a, b) => {
        // total team a
        let ta = plays.filter((p) => {
          return p.teamGood.id === a.id || p.teamBad.id === a.id;
        }).length;
        // total team b
        let tb = plays.filter((p) => {
          return p.teamGood.id === b.id || p.teamBad.id === b.id;
        }).length;
        // victories team a
        let va = plays.filter((p) => {
          return (
            (p.teamGood.id === a.id && p.play.side_win === "good") ||
            (p.teamBad.id === a.id && p.play.side_win === "bad")
          );
        }).length;
        // victories team b
        let vb = plays.filter((p) => {
          return (
            (p.teamGood.id === b.id && p.play.side_win === "good") ||
            (p.teamBad.id === b.id && p.play.side_win === "bad")
          );
        }).length;
        // lost team a
        let la = ta - va;
        // lost teamb
        let lb = tb - vb;

        // order logic
        // 1th level more victories
        // 2th level less lost
        // 3th level name
        if (va === vb) {
          if (la === lb) {
            return a.name > b.name;
          }
          return la > lb;
        }
        return va < vb;
      });
      this.tournamentCopy.teams.sort((a, b) => {
        return a.name > b.name;
      });
    },
  },
};
</script>
