<template>
  <div class="w-full h-full">
    <!-- Tournament -->
    <div
      v-if="tournamentCopy"
      class="flex flex-col p-2 pb-0 space-y-2 sm:p-3 sm:space-y-3"
    >
      <!-- Header -->
      <label-component
        :title-top="moment(tournamentCopy.createdAt).format('MMMM D, YYYY')"
        :title-bottom="normalizeTournamentTypeName(tournamentCopy.type?.name)"
      >
        <div class="text-4xl">{{ tournamentCopy.name }}</div>
      </label-component>
      <!-- Teams and Matches -->
      <div class="flex flex-col space-y-2 sm:space-y-3">
        <!-- Teams -->
        <label-component title-top="Teams">
          <div
            class="flex p-2 space-x-2 overflow-x-auto border rounded-lg shadow-lg sm:p-3 bg-gradient-to-t from-gray-100 to-gray-50"
          >
            <tournament-team-component
              class="min-w-24"
              v-for="(team, i) in tournamentTeamsOrder"
              :position="i"
              :key="team.id + tournamentCopy.id"
              :team="team"
              :tournament="tournamentCopy"
              :tournamentPlays="tournamentPlays"
            >
            </tournament-team-component>
          </div>
        </label-component>
        <!-- Matches -->
        <label-component title-top="Mathes" class="w-full">
          <!-- Tournament types -->
          <!-- All for All -->
          <div class="flex flex-wrap w-full justify-evenly" v-if="isAllForAll">
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
                  class="mb-2 sm:mb-3"
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
        </label-component>
      </div>
    </div>
    <!-- Empty tournaments -->
    <div
      v-else
      class="flex justify-center w-full p-10 space-x-3 text-center text-gray-400 sm:justify-start"
    >
      <span class="flex">
        <b class="hidden sm:flex">👈</b>
        <b>😒</b>
        <b class="flex sm:hidden">👆</b>
      </span>
      <i>Seleccione un torneo no seas vago</i>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
import { mapState } from "vuex";

import moment from "moment";

import {
  ALL_FOR_ALL_1,
  ALL_FOR_ALL_3,
  ALL_FOR_ALL_5,
  DIRECT_1,
  DIRECT_3,
  DIRECT_5,
} from "@/store/type/tournament";

import TournamentMatchComponent from "@/components/tournament/TournamentMatchComponent";
import TournamentTeamComponent from "@/components/tournament/TournamentTeamComponent";
import LabelComponent from "@/components/LabelComponent";

export default {
  data() {
    return {
      moment: moment,
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
    tournament: Object,
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
    LabelComponent,
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
  mounted() {
    if (this.tournament.name) {
      this.tournamentCopy = this.tournament;
      this.initPlays();
    }
  },
  watch: {
    async tournament(val) {
      this.tournamentCopy = val;
      this.initPlays();
    },
    tournamentCopy(val) {
      val?.teams?.sort((a, b) => {
        return a.name.localeCompare(b.name);
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
            return a.name.localeCompare(b.name);
          }
          return la - lb;
        }
        return vb - va;
      });
      this.tournamentCopy.teams.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    },
  },
};
</script>
