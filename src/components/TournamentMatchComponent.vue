<template>
  <div>
    <!-- Match button -->
    <div @click="modal = !isMatchWon" class="flex flex-col justify-center">
      <!-- Percent bar of team 1 to win -->
      <div
        v-if="!isMatchWon"
        :style="[
          {
            width: `${matchesWonTeam1Percent * 10}rem`,
          },
        ]"
        class="
          z-0
          absolute
          h-5
          bg-green-200
          animate-pulse
          transform
          -translate-y-6
          transition-all
        "
      ></div>
      <!-- Percent bar of team 2 to win -->
      <div
        v-if="!isMatchWon"
        :style="[
          {
            width: `${matchesWonTeam2Percent * 10}rem`,
          },
        ]"
        class="
          absolute
          h-5
          bg-green-200
          animate-pulse
          transform
          translate-y-6
          transition-all
        "
      ></div>
      <!-- Match -->
      <div
        :class="[
          'flex flex-col justify-between items-center p-2 sm:p-3 h-full w-40 text-center border',
          {
            'bg-gradient-to-t from-green-300 to-green-100 border-green-300':
              isMatchWon,
          },
          {
            'cursor-pointer text-gray-500 border border-gray-500 border-dashed hover:text-blue-500 hover:border-blue-500':
              !isMatchWon,
          },
        ]"
        @mouseover="hover = true"
        @mouseleave="hover = false"
      >
        <!-- Team 1 -->
        <div
          :class="[
            'flex flex-col',
            { 'font-extrabold text-lg': matchesWonTeam1Percent >= 1 },
          ]"
        >
          <span>
            {{ team1.name }}
          </span>
          <span v-if="matchesToWin > 1">
            {{ matchesWonTeam1 }}
            <span class="hidden sm:inline-block" v-show="hover">
              of {{ matchesToWin }}
            </span>
            <span class="inline-block sm:hidden">of {{ matchesToWin }}</span>
          </span>
        </div>
        <!-- Vs -->
        <i>
          <b v-if="isMatchWon && hover">Finished</b>
          <i v-else>vs</i>
        </i>
        <!-- Team 2 -->
        <div
          :class="[
            'flex flex-col',
            { 'font-extrabold text-lg': matchesWonTeam2Percent >= 1 },
          ]"
        >
          <span v-if="matchesToWin > 1">
            {{ matchesWonTeam2 }}
            <span class="hidden sm:inline-block" v-show="hover">
              of {{ matchesToWin }}
            </span>
            <span class="inline-block sm:hidden">of {{ matchesToWin }}</span>
          </span>
          <span>
            {{ team2.name }}
          </span>
        </div>
      </div>
    </div>
    <!-- Add play modal -->
    <transition name="fade">
      <div
        v-if="modal"
        class="
          fixed
          w-full
          h-full
          top-0
          right-0
          z-50
          p-3
          sm:p-6
          flex flex-col
          bg-blue-900 bg-opacity-30
        "
      >
        <!-- Header -->
        <div
          class="
            flex
            justify-between
            p-3
            shadow-sm
            bg-white
            text-center
            border-b-0
          "
        >
          <span class="text-green-600 sm:text-xl font-bold"
            >Add match play</span
          >
          <!-- Close -->
          <button
            class="
              px-3
              text-blue-900
              border border-blue-300
              hover:border-blue-200
              bg-gradient-to-b
              from-blue-100
              to-blue-300
              hover:from-blue-50
              hover:to-blue-200
            "
            @click="modal = false"
          >
            <i class="fa fa-close"></i>
          </button>
        </div>
        <!-- Content -->
        <div class="relative flex flex-col p-3 bg-white overflow-auto">
          <!-- Background -->
          <div class="hidden sm:flex absolute top-0 bottom-0 left-0 right-0">
            <div
              class="
                bg-gradient-to-r
                from-green-200
                border border-green-500 border-r-0
                h-full
                w-full
              "
            ></div>
            <div
              class="
                bg-gradient-to-l
                from-red-200
                border border-red-500 border-l-0
                h-full
                w-full
              "
            ></div>
          </div>
          <!-- Form content -->
          <div class="flex flex-col space-y-3 z-10">
            <!-- Select bad and good -->
            <div class="flex space-x-3">
              <!-- good -->
              <b class="flex justify-center w-full px-2 py-1 text-green-800">
                {{ teamGood.name }}
              </b>
              <!-- Swap teams -->
              <button
                class="
                  swap
                  flex
                  justify-center
                  sm:w-40
                  sm:px-3
                  text-2xl
                  my-auto
                "
                @click="swapTeams()"
                title="Swap teams"
              >
                <i
                  class="arrow-left fa fa-long-arrow-left text-red-500 p-1"
                ></i>
                <i
                  class="arrow-right fa fa-long-arrow-right text-green-500 p-1"
                ></i>
              </button>
              <!-- bad -->
              <b class="flex justify-center w-full px-2 py-1 text-red-800">
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