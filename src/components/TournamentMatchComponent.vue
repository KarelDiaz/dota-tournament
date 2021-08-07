<template>
  <div>
    <div class="flex flex-col justify-center" @click="modal = true">
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
        class="absolute h-5 bg-green-200 animate-pulse transform translate-y-6"
      ></div>
      <!-- Match -->
      <div
        :class="[
          'flex flex-col justify-between items-center p-3 w-full h-full sm:w-40 text-center border',
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
            <span v-show="hover">of {{ matchesToWin }}</span>
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
            <span v-show="hover">of {{ matchesToWin }}</span>
          </span>
          <span>
            {{ team2.name }}
          </span>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div
        v-if="modal"
        class="
          backdrop-filter backdrop-blur-sm backdrop-hue-rotate-60
          fixed
          w-full
          h-full
          top-0
          right-0
          z-50
          p-3
          pt-16
          flex
          justify-center
          bg-gray-400 bg-opacity-50
        "
      >
        <button
          class="
            absolute
            top-0
            m-4
            px-3
            sm:w-40
            text-red-900
            border border-red-400
            hover:border-red-300
            bg-gradient-to-b
            from-red-200
            to-red-400
            hover:from-red-100
            hover:to-red-300
          "
          @click="modal = false"
        >
          Cancelar
        </button>
        <add-play-component class="my-auto w-full"></add-play-component>
      </div>
    </transition>
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
import AddPlayComponent from "@/components/AddPlayComponent.vue";

export default {
  components: { AddPlayComponent },
  data() {
    return {
      ALL_FOR_ALL_1,
      ALL_FOR_ALL_3,
      ALL_FOR_ALL_5,
      DIRECT_1,
      DIRECT_3,
      DIRECT_5,
      hover: false,
      modal: false,
      m1: 0,
      m2: 0,
    };
  },
  props: {
    team1: {},
    team2: {},
    tournament: {},
  },
  created() {
    let win = Math.random();
    let temp = Math.random();
    if (win < 0.5) {
      if (temp < 0.5) {
        this.m1 = this.matchesToWin;
        this.m2 = Math.round(Math.random() * (this.matchesToWin - 1));
      } else {
        this.m2 = this.matchesToWin;
        this.m1 = Math.round(Math.random() * (this.matchesToWin - 1));
      }
    } else {
      this.m1 = Math.round(Math.random() * (this.matchesToWin - 1));
      this.m2 = Math.round(Math.random() * (this.matchesToWin - 1));
    }
  },
  computed: {
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
      return this.matchesWonTeam1 / this.matchesToWin;
    },
    matchesWonTeam2Percent() {
      return this.matchesWonTeam2 / this.matchesToWin;
    },
    isMatchWon() {
      return (
        this.matchesWonTeam1Percent >= 1 || this.matchesWonTeam2Percent >= 1
      );
    },
  },
};
</script>
