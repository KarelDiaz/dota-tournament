<template>
  <div class="p-3 border border-gray-400 border-dashed rounded-lg">
    <div class="flex flex-col space-y-3" v-if="$store.state.players.length > 0">
      <!--Torunament name and type-->
      <div
        class="flex flex-col space-x-0 space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3"
      >
        <!-- Name -->
        <label-component class="relative" title-top="Nombre del torneo">
          <!-- Random name "Tournament n+1" -->
          <button
            class="absolute w-8 h-8 text-gray-900 border rounded-full shadow-lg -right-2 bg-gradient-to-b from-gray-50 to-gray-200 hover:from-white"
            title="Generar el nombre del torneo de forma aleatoria"
            @click="
              tournamentTemp.name =
                'Tournament ' + ($store.state.tournaments.length + 1)
            "
          >
            <i class="fa fa-random"></i>
          </button>
          <!-- Name -->
          <input
            :class="[
              'p-3 text-xl font-extrabold border rounded-lg shadow-lg bg-gradient-to-b from-white to-gray-100',
              {
                'from-green-50 to-green-200 border-green-200 ':
                  tournamentTemp.name,
              },
            ]"
            required
            type="text"
            v-model="tournamentTemp.name"
            placeholder="Name"
          />
        </label-component>
        <!-- Type -->
        <transition name="slide-left">
          <label-component
            v-if="tournamentTemp.name !== null"
            title-top="Tipo de torneo"
          >
            <select
              class="w-full p-4 border rounded-lg shadow-lg sm:w-auto bg-gradient-to-b from-white to-gray-100"
              v-model="tournamentTemp.type"
              placeholder="Tipo"
            >
              <option v-for="t in tournamentTypes" :key="t.id" :value="t">
                {{ normalizeTournamentTypeName(t.name) }}
              </option>
            </select>
          </label-component>
        </transition>
      </div>
      <!--Teams-->
      <transition name="slide-top">
        <div
          class="flex flex-col flex-wrap sm:flex-row"
          v-if="tournamentTemp.name !== null && tournamentTemp.type"
        >
          <!--Teams added -->
          <transition-group name="slide-right">
            <div v-for="team in tournamentTemp.teams" :key="team">
              <div
                class="relative flex flex-col p-3 mb-3 mr-3 space-y-3 text-green-800 border border-green-300 rounded-lg shadow-lg bg-gradient-to-t from-green-300 to-green-100"
              >
                <!-- Name and elo -->
                <div class="flex flex-col">
                  <span class="text-lg font-bold">{{ team.name }}</span>
                  <i class="text-xs text-green-500">{{ eloMediaTeam(team) }}</i>
                </div>
                <!-- Players -->
                <div class="flex flex-col">
                  <span
                    v-for="p in team.players"
                    :key="p"
                    class="flex items-end justify-between space-x-2"
                  >
                    <span>{{ p.nick }}</span>
                    <span class="text-xs italic text-green-500">{{
                      p.elo
                    }}</span>
                  </span>
                </div>
                <!-- Remove team -->
                <button
                  class="absolute w-8 h-8 text-gray-600 border rounded-full shadow-md -top-5 -right-2 bg-gradient-to-b from-gray-50 to-gray-200 hover:from-white"
                  @click="delTeam(team)"
                >
                  <i class="fa fa-trash"></i>
                </button>
              </div>
            </div>
          </transition-group>
          <!--New team-->
          <transition name="fade">
            <div
              class="relative flex flex-col p-3 mb-3 mr-3 space-y-3 border border-gray-400 border-dashed rounded-lg "
              v-if="newTeamVisibility"
            >
              <button
                class="absolute w-8 h-8 text-gray-600 border rounded-full shadow-md -top-2 -right-2 bg-gradient-to-b from-gray-50 to-gray-200 hover:from-white"
                @click="fillRandomTeamTemp()"
              >
                <i class="fa fa-random"></i>
              </button>
              <!--Team name and elo-->
              <div>
                <!-- Name input -->
                <label-component
                  title-top="Nombre del equipo"
                  :title-bottom="`Team ELO:${
                    eloMediaTeam(teamTemp) === 0
                      ? ' No hay players'
                      : eloMediaTeam(teamTemp)
                  }`"
                >
                  <div class="flex mb-1 rounded-lg shadow-lg">
                    <button
                      class="px-5 py-1 text-gray-900 border border-gray-300 rounded-l-lg bg-gradient-to-b from-gray-100 to-gray-300 hover:from-gray-50 hover:to-gray-200"
                      @click="addRandomNameToTeamTemp()"
                    >
                      <i class="fa fa-random"></i>
                    </button>
                    <input
                      class="w-full px-2 border rounded-r-lg bg-gradient-to-b from-white to-gray-100"
                      maxlength="30"
                      required
                      type="text"
                      v-model="teamTemp.name"
                      placeholder="Team name"
                    />
                  </div>
                </label-component>
              </div>
              <!--Players-->
              <label-component
                :title-top="`Players ${
                  teamTemp.players.length >= 5 ? 'is full' : ''
                }`"
              >
                <!-- Player select -->
                <transition name="fade">
                  <div
                    v-if="teamTemp.players.length < 5 && players.length > 0"
                    :class="[
                      'flex mt-1 rounded-lg shadow-lg',
                      { 'mb-4': teamTemp.players.length > 0 },
                    ]"
                  >
                    <!-- Player random -->
                    <button
                      class="px-5 py-1 text-gray-900 border border-gray-300 rounded-l-lg bg-gradient-to-b from-gray-100 to-gray-300 hover:from-gray-50 hover:to-gray-200"
                      @click="addRandomPlayerToTeamTemp"
                    >
                      <i class="transform rotate-90 fa fa-random"></i>
                    </button>
                    <!-- Player select -->
                    <select
                      :class="[
                        'px-2 w-full border bg-gradient-to-b from-white to-gray-100',
                        { 'rounded-r-lg': !playerSelected },
                      ]"
                      v-model="playerSelected"
                    >
                      <option v-for="p in players" :key="p" :value="p">
                        {{ p.nick }}
                      </option>
                    </select>
                    <!-- Add player selected -->
                    <button
                      v-if="playerSelected"
                      class="px-5 text-green-900 border border-green-400 rounded-r-lg hover:border-green-300 bg-gradient-to-b from-green-200 to-green-400 hover:from-green-100 hover:to-green-300"
                      @click="addPlayerToTeamTemp"
                    >
                      <i class="fa fa-plus"></i>
                    </button>
                  </div>
                </transition>
                <!-- Player list -->
                <div class="flex flex-col space-y-1">
                  <transition-group name="slide-top">
                    <span
                      class="relative flex items-center justify-between px-4 py-1 space-x-2 border border-dashed rounded-full bg-gradient-to-t from-gray-50 to-white player bg-opacity-20"
                      v-for="p in teamTemp.players"
                      :key="p"
                      @click="cancelPlayerToTeamTemp(p)"
                    >
                      <i
                        class="absolute text-gray-500 left-1 fa fa-arrow-up"
                      ></i>
                      <span>{{ p.nick }}</span>
                      <span class="mr-3 text-xs italic text-gray-500 elo">
                        {{ p.elo }}
                      </span>
                    </span>
                  </transition-group>
                </div>
              </label-component>
              <!--Button add team-->
              <div>
                <button
                  class="w-full px-4 text-green-900 border border-green-400 rounded-lg shadow-lg bg-gradient-to-b hover:border-green-300 from-green-200 to-green-400 hover:from-green-100 hover:to-green-300"
                  @click="addTeamTempToTournamentTemp"
                  v-if="teamTemp.players.length > 0 && teamTemp.name"
                >
                  <i class="fa fa-plus"></i>
                </button>
              </div>
            </div>
          </transition>
        </div>
      </transition>
      <!--Errors-->
      <div v-if="!addTournamentOk" class="flex flex-col text-xs text-red-500">
        <i v-for="error in errors" :key="error">
          {{ error }}
        </i>
      </div>
      <!--Info and add button-->
      <div v-if="addTournamentOk">
        <!--Info-->
        <small v-if="tournamentTemp.type && tournamentTemp.name" class="info">
          <div>
            <span>
              El torneo <b>{{ tournamentTemp.name.toUpperCase() }}</b>
              se efectuara en el formato de
              <b>
                {{ normalizeTournamentTypeName(tournamentTemp.type.name) }}
              </b>
              .
            </span>
            <br />
            <span v-if="tournamentTemp.type.name == ALL_FOR_ALL_1">
              Sera un todos contra todos de un partido definitorio por
              encuentro.
            </span>
            <span v-if="tournamentTemp.type.name == ALL_FOR_ALL_3">
              Sera un todos contra todos de tres partidos ganar dos por
              encuentro.
            </span>
            <span v-if="tournamentTemp.type.name === ALL_FOR_ALL_5">
              Sera un todos contra todos de cinco partidos ganar tres por
              encuentro.
            </span>
            <span v-if="tournamentTemp.type.name === DIRECT_1">
              Sera un encuentro por directo de un solo partido definitorio.
            </span>
            <span v-if="tournamentTemp.type.name === DIRECT_3">
              Sera un encuentro por directo de tres partidos ganar dos.
            </span>
            <span v-if="tournamentTemp.type.name === DIRECT_5">
              Sera un encuentro por directo de cinco partidos ganar tres.
            </span>
            <br />
            <span>
              El torneo cuenta con
              <b>{{ tournamentTemp.teams.length }}</b> teams.
              <span v-if="tournamentTemp.type.name == ALL_FOR_ALL_1">
                Efectuandoce
                <b>
                  {{
                    (tournamentTemp.teams.length *
                      (tournamentTemp.teams.length - 1)) /
                    2
                  }}
                </b>
                encuentros y
                <b>
                  {{
                    (tournamentTemp.teams.length *
                      (tournamentTemp.teams.length - 1)) /
                    2
                  }}
                </b>
                partidos.
              </span>
              <span v-if="tournamentTemp.type.name == ALL_FOR_ALL_3">
                Efectuandoce
                <b>
                  {{
                    (tournamentTemp.teams.length *
                      (tournamentTemp.teams.length - 1)) /
                    2
                  }}
                </b>
                encuentros y
                <b>
                  {{
                    ((tournamentTemp.teams.length *
                      (tournamentTemp.teams.length - 1)) /
                      2) *
                    3
                  }}
                </b>
                partidos como maximo.
              </span>
              <span v-if="tournamentTemp.type.name === ALL_FOR_ALL_5">
                Efectuandoce
                <b>
                  {{
                    (tournamentTemp.teams.length *
                      (tournamentTemp.teams.length - 1)) /
                    2
                  }}
                </b>
                encuentros y
                <b>
                  {{
                    ((tournamentTemp.teams.length *
                      (tournamentTemp.teams.length - 1)) /
                      2) *
                    5
                  }}
                </b>
                partidos como maximo.
              </span>
              <span v-if="tournamentTemp.type.name === DIRECT_1">
                Efectuandoce
                <b>
                  {{
                    (tournamentTemp.teams.length *
                      (tournamentTemp.teams.length - 1)) /
                    2
                  }}
                </b>
                encuentros y
                <b>
                  {{
                    ((tournamentTemp.teams.length *
                      (tournamentTemp.teams.length - 1)) /
                      2) *
                    5
                  }}
                </b>
                partidos como maximo.
              </span>
              <span v-if="tournamentTemp.type.name === DIRECT_3">
                Sera un encuentro por directo de tres partidos ganar dos.
              </span>
              <span v-if="tournamentTemp.type.name === DIRECT_5">
                Sera un encuentro por directo de cinco partidos ganar tres.
              </span>
            </span>
          </div>
        </small>
        <!-- Add button -->
        <button
          class="w-full mt-3 text-green-900 border border-green-400 rounded-lg shadow-lg hover:border-green-300 bg-gradient-to-b from-green-200 to-green-400 hover:from-green-100 hover:to-green-300"
          @click="submitTournament()"
        >
          <i class="fa fa-plus"></i>
        </button>
      </div>
    </div>
    <!--No players error -->
    <div v-else>
      <h3>Es necesario agregar players para poder iniciar un torneo</h3>
      <p>Pude agragar players <a href="/">aqui</a>.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapMutations } from "vuex";

import { ADD_TOURNAMENT, INIT_TOURNAMENTS } from "@/store/mutations-type";
import Tournament from "@/store/model/tournament";
import {
  ALL_FOR_ALL_1,
  ALL_FOR_ALL_3,
  ALL_FOR_ALL_5,
  DIRECT_1,
  DIRECT_3,
  DIRECT_5,
} from "@/store/tournament-type";
import Team from "@/store/model/team";
import LabelComponent from "@/components/LabelComponent.vue";

export default {
  data() {
    return {
      ALL_FOR_ALL_1,
      ALL_FOR_ALL_3,
      ALL_FOR_ALL_5,
      DIRECT_1,
      DIRECT_3,
      DIRECT_5,
      players: [],
      playerSelected: null,
      teamTemp: new Team(),
      tournamentTemp: null,
      errors: [],
    };
  },
  created() {
    this.players = this.$store.state.players; // clone the players from store
    this.tournamentTemp = new Tournament();
  },
  components: {
    LabelComponent,
  },
  computed: {
    ...mapState({
      strapi: (state) => state.strapi,
      tournamentTypes: (state) => state.tournamentTypes,
    }),
    newTeamVisibility() {
      return this.teamTemp.players.length > 0 || this.players.length > 0;
    },
    isTournamentDirect() {
      switch (this.tournamentTemp.type.name) {
        case DIRECT_1:
        case DIRECT_3:
        case DIRECT_5:
          return true;
      }
      return false;
    },
    directTeamsLengPow2() {
      let lengTeams = this.tournamentTemp.teams.length;
      if (lengTeams === 0) return false;
      if (this.isTournamentDirect) {
        // teams langth should be pow 2
        while (lengTeams % 2 == 0) {
          lengTeams /= 2;
        }
        if (lengTeams !== 1) return false;
      }
      return true;
    },
    addTournamentOk() {
      return (
        this.tournamentTemp.teams.length > 2 &&
        this.tournamentTemp.name &&
        this.tournamentTemp.type &&
        this.directTeamsLengPow2
      );
    },
  },
  methods: {
    ...mapMutations([ADD_TOURNAMENT,INIT_TOURNAMENTS]),
    submitTournament() {
      var arr = [];
      this.tournamentTemp.teams.forEach((t) => {
        axios.post(this.strapi + "/teams", t).then(({ data }) => {
          arr.push(data.id);
          if (arr.length === this.tournamentTemp.teams.length) {
            this.tournamentTemp.teams = arr;
            axios
              .post(this.strapi + "/tournaments", this.tournamentTemp)
              .then(({ data }) => {
                this.initTournaments();
                this.$emit("tournament-add", data);
                this.tournamentTemp = new Tournament();
                this.teamTemp = new Team();
                this.players = this.$store.state.players;
              });
          }
        });
      });
    },
    eloMediaTeam(team) {
      if (!team.players || team.players.length == 0) return 0;
      let s = 0;
      team.players.forEach((p) => {
        s += p.elo;
      });
      return parseInt(s / team.players.length);
    },
    addRandomNameToTeamTemp() {
      this.teamTemp.name = "Team " + (this.tournamentTemp.teams.length + 1);
    },
    addPlayerToTeamTemp() {
      if (!this.playerSelected.nick) return;
      this.teamTemp.players.push(this.playerSelected);
      this.teamTemp.players.sort((a, b) => b.elo - a.elo);
      this.players = this.players.filter((p) => p != this.playerSelected);
      this.playerSelected = null;
    },
    addRandomPlayerToTeamTemp() {
      if (this.players.length == 0 || this.teamTemp.players.length == 5) return;
      let n = this.players.length;
      let pTemp = this.players[parseInt(n * Math.random())];
      this.teamTemp.players.push(pTemp);
      this.teamTemp.players.sort((a, b) => b.elo - a.elo);
      this.players = this.players.filter((p) => p != pTemp);
      this.playerSelected = null;
    },
    fillRandomTeamTemp() {
      this.addRandomNameToTeamTemp();
      for (let i = 0; i < 5; i++) {
        this.addRandomPlayerToTeamTemp();
      }
    },
    cancelPlayerToTeamTemp(player) {
      this.players.push(player);
      this.players.sort((a, b) => a.nick.localeCompare(b.nick));
      this.teamTemp.players = this.teamTemp.players.filter((p) => p != player);
    },
    addTeamTempToTournamentTemp() {
      this.tournamentTemp.teams.push(this.teamTemp);
      this.teamTemp = new Team();
    },
    delTeam(team) {
      this.players = this.players.concat(team.players);
      this.players.sort((a, b) => a.nick.localeCompare(b.nick));
      this.tournamentTemp.teams = this.tournamentTemp.teams.filter(
        (t) => t != team
      );
    },
    normalizeTournamentTypeName(name) {
      let out = "";
      for (let i = 0; i < name.length; i++)
        out += name[i] !== "_" ? name[i] : " ";
      return out.toUpperCase();
    },
  },
  watch: {
    "tournamentTemp.name"(val) {
      let text = "El torneo necesita un nombre.";
      if (!val) this.errors.push(text);
      else this.errors = this.errors.filter((e) => e !== text);
    },
    "tournamentTemp.type"(val) {
      let textDirect =
        "La cantidad de teams debe tener potencia de dos: por ejemplo 4, 8 o 16.";
      let textAllForAll =
        "La cantidad minima de equipos necesarios es de tres.";
      let ntemp = this.tournamentTemp.teams.length;
      this.errors = this.errors.filter(
        (e) => e !== textAllForAll && e !== textDirect
      );

      switch (val?.name) {
        case ALL_FOR_ALL_1:
        case ALL_FOR_ALL_3:
        case ALL_FOR_ALL_5:
          if (this.tournamentTemp.teams.length < 3)
            this.errors.push(textAllForAll);
          return;
        case DIRECT_1:
        case DIRECT_3:
        case DIRECT_5:
          while (ntemp % 2 === 0 && ntemp > 1) ntemp /= 2;
          if (ntemp !== 1) this.errors.push(textDirect);
          return;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.player {
  @apply cursor-pointer;
  &:hover {
    i {
      opacity: 1;
      animation-play-state: running;
    }
  }

  i {
    opacity: 0;
    animation: atent 0.3s infinite alternate;
    animation-play-state: paused;

    @keyframes atent {
      0% {
        transform: translateY(5px);
      }
      100% {
        transform: translateY(-5px);
      }
    }
  }
}
</style>