<template>
  <div>
    <div class="flex flex-col space-y-3">
      <!-- Tournaments -->
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
          <div
            v-if="isAllForAll"
            class="flex flex-col sm:flex-row sm:flex-wrap"
          >
            <template
              v-for="(itemf, indexf) in tournamentCopy.teams"
              :key="indexf"
            >
              <template
                v-for="(iteml, indexl) in tournamentCopy.teams"
                :key="indexl"
              >
                <tournament-match-component
                  @click="
                    modal = true;
                    teamGood = itemf;
                    teamBad = iteml;
                  "
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
      <!-- Empty tournaments -->
      <div v-else>
        <h1>No hay tourneo seleccionado</h1>
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
            bg-white
            border
            text-center
            border-b-0
          "
        >
          <span>Add match play</span>
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
        <div class="flex flex-col p-3 bg-white border overflow-auto space-y-3">
          <!-- Select bad and good -->
          <div class="flex justify-evenly">
            <!-- good -->
            <b class="px-2 py-1 bg-gradient-to-l from-green-300 text-green-800">
              {{ teamGood.name }}
            </b>
            <!-- Swap teams -->
            <button @click="swapTeams()" class="swap text-2xl flex my-auto">
              <i class="arrow-left fa fa-long-arrow-left text-red-500 p-1"></i>
              <i
                class="arrow-right fa fa-long-arrow-right text-green-500 p-1"
              ></i>
            </button>
            <!-- bad -->
            <b class="px-2 py-1 bg-gradient-to-r from-red-300 text-red-800">
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
import TournamentMatchComponent from "@/components/TournamentMatchComponent";
import AddPlayComponent from "@/components/AddPlayComponent";

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
      teamGood: {},
      teamBad: {},
      modal: false,
    };
  },
  props: {
    tournament: null,
  },
  components: {
    TournamentMatchComponent,
    AddPlayComponent,
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
    swapTeams() {
      console.log(this.teamBad);
      let temp = this.teamGood;
      this.teamGood = this.teamBad;
      this.teamBad = temp;
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