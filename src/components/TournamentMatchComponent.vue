<template>
  <div>
    <!-- Match button -->
    <div
      @click="modal = !isMatchWon"
      class="flex flex-col justify-center h-full"
    >
      <!-- Percent bar of team 1 to win -->
      <div
        v-if="!isMatchWon"
        :style="[
          {
            width: `${matchesWonTeam1Percent * 10}rem`,
          },
        ]"
        class="absolute z-0 h-6 transition-all duration-1000 transform -translate-y-6 border border-l-0 border-green-500 border-dashed rounded-r-full bg-gradient-to-r from-green-100 to-green-300 opacity-40"
      ></div>
      <!-- Percent bar of team 2 to win -->
      <div
        v-if="!isMatchWon"
        :style="[
          {
            width: `${matchesWonTeam2Percent * 10}rem`,
          },
        ]"
        class="absolute z-0 h-6 transition-all duration-1000 transform translate-y-6 border border-l-0 border-green-500 border-dashed rounded-r-full bg-gradient-to-r from-green-100 to-green-300 opacity-40"
      ></div>
      <!-- Match -->
      <div
        :class="[
          'grid grid-cols-1 grid-rows-3 justify-between items-center p-2 sm:p-3 h-full w-40 text-center border rounded-lg',
          {
            'bg-gradient-to-t from-green-300 to-green-100 border-green-300 text-green-800 shadow-xl':
              isMatchWon,
          },
          {
            'cursor-pointer text-gray-500 border-gray-500 border-dashed hover:text-blue-500 hover:border-blue-500':
              !isMatchWon,
          },
        ]"
        @mouseover="hover = true"
        @mouseleave="hover = false"
      >
        <!-- Team 1 -->
        <div
          :class="[{ 'font-extrabold text-lg': matchesWonTeam1Percent >= 1 }]"
        >
          {{ team1.name }}
        </div>
        <!-- Vs -->
        <i class="flex flex-col">
          <span v-if="matchesToWin > 1">
            {{ matchesWonTeam1 }}
            <span class="hidden sm:inline-block" v-show="hover">
              of {{ matchesToWin }}
            </span>
            <span class="inline-block sm:hidden">of {{ matchesToWin }}</span>
          </span>
          <b v-if="isMatchWon && hover">Finished</b>
          <i v-else>vs</i>
          <span v-if="matchesToWin > 1">
            {{ matchesWonTeam2 }}
            <span class="hidden sm:inline-block" v-show="hover">
              of {{ matchesToWin }}
            </span>
            <span class="inline-block sm:hidden">of {{ matchesToWin }}</span>
          </span>
        </i>
        <!-- Team 2 -->
        <div
          :class="[{ 'font-extrabold text-lg': matchesWonTeam2Percent >= 1 }]"
        >
          {{ team2.name }}
        </div>
      </div>
    </div>
    <!-- Add play modal -->
    <!-- Back -->
    <transition name="fade">
      <div
        @click="modal = false"
        v-if="modal"
        class="fixed top-0 left-0 z-30 w-screen h-screen bg-gray-900 bg-opacity-30"
      ></div>
    </transition>
    <!-- Modal -->
    <transition name="slide-top">
      <div
        v-if="modal"
        class="fixed z-50 top-3 right-3 left-3 bottom-3 sm:bottom-auto sm:top-6 sm:right-6 sm:left-6"
      >
        <!-- Close -->
        <button
          class="absolute z-50 text-gray-700 transition-all border border-gray-300 rounded-full shadow-md w-9 h-9 -top-5 -right-5 hover:border-gray-200 bg-gradient-to-b from-gray-50 to-gray-200 hover:from-white hover:to-gray-100"
          @click="modal = false"
        >
          <i class="fa fa-close"></i>
        </button>
        <!-- Modal content -->
        <div class="z-40 flex flex-col w-full h-full p-3 overflow-auto bg-white rounded-lg shadow-xl sm:p-6">
          <!-- Form content -->
          <div class="z-10 flex flex-col space-y-3">
            <!-- Select bad and good -->
            <div class="flex space-x-3">
              <!-- good -->
              <b class="flex justify-center w-full px-2 text-green-600">
                {{ teamGood.name }}
              </b>
              <!-- Swap teams -->
              <button
                class="flex justify-center my-auto text-2xl swap sm:w-40 sm:px-3"
                @click="swapTeams()"
                title="Swap teams"
              >
                <i
                  class="p-1 text-red-500 arrow-left fa fa-long-arrow-left"
                ></i>
                <i
                  class="p-1 text-green-500 arrow-right fa fa-long-arrow-right"
                ></i>
              </button>
              <!-- bad -->
              <b class="flex justify-center w-full px-2 text-red-600">
                {{ teamBad.name }}
              </b>
            </div>
            <!-- Add play form -->
            <add-play-component
              v-if="teamGood && teamBad"
              :team-good="teamGood"
              :team-bad="teamBad"
              @added="newPlay($event)"
              class="w-full"
            ></add-play-component>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

import {
  ALL_FOR_ALL_1,
  ALL_FOR_ALL_3,
  ALL_FOR_ALL_5,
  DIRECT_1,
  DIRECT_3,
  DIRECT_5,
} from "@/store/tournament-type";
import AddPlayComponent from "@/components/AddPlayComponent";
import TournamentPlay from "@/store/model/tournament_play";

export default {
  data() {
    return {
      ALL_FOR_ALL_1,
      ALL_FOR_ALL_3,
      ALL_FOR_ALL_5,
      DIRECT_1,
      DIRECT_3,
      DIRECT_5,
      teamGood: {},
      teamBad: {},
      modal: false,
      hover: false,
      m1: 0,
      m2: 0,
    };
  },
  props: {
    team1: Object,
    team2: Object,
    tournament: Object,
    tournamentPlays: Array,
  },
  components: {
    AddPlayComponent,
  },
  computed: {
    ...mapState({
      strapi: (state) => state.strapi,
    }),
    matchesWonTeam1() {
      return this.m1;
    },
    matchesWonTeam2() {
      return this.m2;
    },
    matchesToWin() {
      switch (this.tournament?.type?.name) {
        case this.ALL_FOR_ALL_1:
        case this.DIRECT_1:
          return 1;
        case this.ALL_FOR_ALL_3:
        case this.DIRECT_3:
          return 2;
        case this.ALL_FOR_ALL_5:
        case this.DIRECT_5:
          return 3;
      }
      return 0;
    },
    matchesWonTeam1Percent() {
      return parseFloat(this.matchesWonTeam1) / parseFloat(this.matchesToWin);
    },
    matchesWonTeam2Percent() {
      return parseFloat(this.matchesWonTeam2) / parseFloat(this.matchesToWin);
    },
    isMatchWon() {
      return (
        this.matchesWonTeam1Percent >= 1 || this.matchesWonTeam2Percent >= 1
      );
    },
  },
  methods: {
    initMatch() {
      this.teamGood = this.team1;
      this.teamBad = this.team2;
      this.m1 = this.tournamentPlays.filter((p) => {
        let side_good =
          p.teamGood.id == this.team1.id && p.play.side_win == "good";
        let side_bad =
          p.teamBad.id == this.team1.id && p.play.side_win == "bad";

        if (side_good) {
          return p.teamBad.id === this.team2.id;
        }
        if (side_bad) {
          return p.teamGood.id === this.team2.id;
        }
        return false;
      }).length;
      this.m2 = this.tournamentPlays.filter((p) => {
        let side_good =
          p.teamGood.id == this.team2.id && p.play.side_win == "good";
        let side_bad =
          p.teamBad.id == this.team2.id && p.play.side_win == "bad";

        if (side_good) {
          return p.teamBad.id === this.team1.id;
        }
        if (side_bad) {
          return p.teamGood.id === this.team1.id;
        }
        return false;
      }).length;
    },
    swapTeams() {
      let temp = this.teamGood;
      this.teamGood = this.teamBad;
      this.teamBad = temp;
    },
    openModal(itemf, iteml, won) {
      if (won) return;
      this.modal = true;
      this.teamGood = itemf;
      this.teamBad = iteml;
    },
    newPlay(play) {
      let tournamentPlayTemp = new TournamentPlay(
        this.tournament,
        play,
        this.teamGood,
        this.teamBad
      );

      axios
        .post(this.strapi + "/tournament-plays", tournamentPlayTemp)
        .then(({ data }) => {
          this.modal = false;
          this.$emit("added", data);
        });
    },
  },
  watch: {
    tournamentPlays() {
      this.initMatch();
    },
  },
  created() {
    this.initMatch();
  },
};
</script>


<style lang="scss" scoped>
.swap {
  &:hover {
    .arrow-left,
    .arrow-right {
      animation-play-state: running;
    }
  }

  .arrow-left {
    animation: atentl 0.3s infinite alternate;
    animation-play-state: paused;
  }
  .arrow-right {
    animation: atentr 0.3s infinite alternate;
    animation-play-state: paused;
  }
  @keyframes atentl {
    0% {
      transform: translateX(10px) translateY(-5px);
    }
    100% {
      transform: translateX(5px) translateY(-5px);
    }
  }
  @keyframes atentr {
    0% {
      transform: translateX(-10px) translateY(5px);
    }
    100% {
      transform: translateX(-5px) translateY(5px);
    }
  }
}
</style>