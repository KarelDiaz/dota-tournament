<template>
  <div class="border border-gray-400 border-dashed p-3">
    <div v-if="$store.state.players.length > 0">
      <div class="text-xl">
        <span class="font-extrabold">Tournament</span>
      </div>
      <!--Torunament name and type-->
      <div class="py-3 flex flex-col sm:flex-row">
        <div class="flex">
          <button
            class="
              px-5
              text-gray-900
              border border-gray-400
              hover:border-gray-300
              bg-gradient-to-b
              from-gray-200
              to-gray-400
              hover:from-gray-100
              hover:to-gray-300
            "
            title="Generar el nombre del torneo de forma aleatoria"
            @click="
              tournamentTemp.name =
                'Tournament ' + ($store.state.tournaments.length + 1)
            "
          >
            <i class="fa fa-plus"></i>
          </button>
          <input
            class="
              px-2
              w-full
              border border-gray-200
              bg-gradient-to-b
              from-gray-50
              to-gray-200
            "
            required
            type="text"
            v-model="tournamentTemp.name"
            placeholder="Name"
          />
        </div>
        <select
          class="
            px-3
            py-1
            mt-3
            sm:mt-0
            sm:ml-3
            border border-gray-200
            bg-gradient-to-b
            from-gray-50
            to-gray-200
            focus:border-blue-300
          "
          v-model="tournamentTemp.type"
          placeholder="Type"
        >
          <option v-for="t in tournamentTypes" :key="t.id" :value="t">
            {{ normalizeTournamentTypeName(t.name) }}
          </option>
        </select>
      </div>
      <!--Teams-->
      <div class="flex flex-col sm:flex-row flex-wrap">
        <!--Teams in-->
        <transition-group name="slide-right">
          <div
            v-for="team in tournamentTemp.teams"
            :key="team"
            class="
              flex flex-col
              space-y-3
              border
              p-3
              mr-3
              mb-3
              bg-gradient-to-t
              from-gray-200
              to-gray-50
            "
          >
            <div class="flex flex-col">
              {{ team.name }}
              <i class="text-xs">{{ eloMediaTeam(team) }}</i>
            </div>
            <div class="flex flex-col h-full">
              <span v-for="p in team.players" :key="p">
                {{ p.nick }}
                <i class="text-xs">{{ p.elo }}</i>
              </span>
            </div>
            <button
              class="
                px-4
                bg-gradient-to-b
                border border-red-400
                hover:border-red-300
                text-red-900
                from-red-200
                to-red-400
                hover:from-red-100
                hover:to-red-300
              "
              @click="delTeam(team)"
            >
              <i class="fa fa-trash"></i>
            </button>
          </div>
        </transition-group>
        <!--New team-->
        <div
          class="
            flex flex-col
            border border-dashed border-gray-400
            p-3
            mb-3
            mr-3
            space-y-3
          "
          v-if="newTeamVisibility"
        >
          <!--Team name and type-->
          <div>
            <div class="mb-1 font-bold">Team</div>
            <div class="flex mb-1">
              <button
                class="
                  px-5
                  text-gray-900
                  border border-gray-400
                  hover:border-gray-300
                  bg-gradient-to-b
                  from-gray-200
                  to-gray-400
                  hover:from-gray-100
                  hover:to-gray-300
                "
                @click="
                  teamTemp.name = 'Team ' + (tournamentTemp.teams.length + 1)
                "
              >
                <i class="fa fa-plus"></i>
              </button>
              <input
                class="
                  px-2
                  w-full
                  border border-gray-200
                  bg-gradient-to-b
                  from-gray-50
                  to-gray-200
                "
                required
                type="text"
                v-model="teamTemp.name"
                placeholder="Team name"
              />
            </div>
            <div class="text-xs" v-if="teamTemp.players.length > 0">
              Team ELO:
              <i>
                {{ eloMediaTeam(teamTemp) }}
              </i>
            </div>
          </div>
          <!--Players-->
          <div>
            <div>
              <b> Players </b>
              <i v-if="teamTemp.players.length >= 5" class="text-green-500">
                Full
              </i>
            </div>
            <div
              v-if="teamTemp.players.length < 5 && players.length > 0"
              class="flex mt-1"
            >
              <button
                class="
                  px-5
                  text-gray-900
                  border border-gray-400
                  hover:border-gray-300
                  bg-gradient-to-b
                  from-gray-200
                  to-gray-400
                  hover:from-gray-100
                  hover:to-gray-300
                "
                @click="addRandomPlayerToTeamTemp"
              >
                <i class="fa fa-plus"></i>
              </button>
              <select
                class="
                  px-2
                  py-1
                  w-full
                  border border-gray-200
                  bg-gradient-to-b
                  from-gray-50
                  to-gray-200
                "
                v-model="playerSelected"
              >
                <option v-for="p in players" :key="p" :value="p">
                  {{ p.nick }}
                </option>
              </select>
              <button
                v-if="playerSelected"
                class="
                  px-5
                  text-green-900
                  border border-green-400
                  hover:border-green-300
                  bg-gradient-to-b
                  from-green-200
                  to-green-400
                  hover:from-green-100
                  hover:to-green-300
                "
                @click="addPlayerToTeamTemp"
              >
                <i class="fa fa-plus"></i>
              </button>
            </div>
            <div class="flex flex-col space-y-1 mt-1">
              <transition-group name="slide-top">
                <span
                  class="player"
                  v-for="p in teamTemp.players"
                  :key="p"
                  @click="cancelPlayerToTeamTemp(p)"
                >
                  {{ p.nick }}
                  <span class="elo text-xs mr-3 italic">{{ p.elo }}</span>
                  <i class="fa fa-arrow-up"></i>
                </span>
              </transition-group>
            </div>
          </div>
          <!--Button add team-->
          <div>
            <button
              class="
                px-4
                w-full
                bg-gradient-to-b
                border border-green-400
                hover:border-green-300
                text-green-900
                from-green-200
                to-green-400
                hover:from-green-100
                hover:to-green-300
              "
              @click="addTeamTempToTournamentTemp"
              v-if="teamTemp.players.length > 0 && teamTemp.name"
            >
              <i class="fa fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
      <!--Errors-->
      <div v-if="!addTournamentOk">
        <small>
          <span v-if="!tournamentTemp.name">
            El torneo necesita un nombre.
          </span>
          <span v-if="tournamentTemp.teams.length <= 2">
            La cantidad minima de teams necesarios es de tres.
          </span>
          <span v-if="isTournamentDirect">
            La cantidad de teams debe tener potencia de dos: por ejemplo 4, 8 o
            16.
          </span>
        </small>
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
        <button
          class="
            mt-3
            w-full
            text-green-900
            border border-green-400
            hover:border-green-300
            bg-gradient-to-b
            from-green-200
            to-green-400
            hover:from-green-100
            hover:to-green-300
          "
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

import { ADD_TOURNAMENT } from "@/store/mutations-type";
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
      tournamentTemp: new Tournament(),
    };
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
  created() {
    this.players = this.$store.state.players; // clone the players from store
  },
  methods: {
    ...mapMutations([ADD_TOURNAMENT]),
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
                this.$emit("tournament-add", data);
                this.addTournament(data);
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
    addPlayerToTeamTemp() {
      if (!this.playerSelected.nick) return;
      this.teamTemp.players.push(this.playerSelected);
      this.teamTemp.players.sort((a, b) => a.nick > b.nick);
      this.players = this.players.filter((p) => p != this.playerSelected);
      this.playerSelected = null;
    },
    addRandomPlayerToTeamTemp() {
      if (this.players.length == 0) return;
      let n = this.players.length;
      let pTemp = this.players[parseInt(n * Math.random())];
      this.teamTemp.players.push(pTemp);
      this.teamTemp.players.sort((a, b) => a.nick > b.nick);
      this.players = this.players.filter((p) => p != pTemp);
      this.playerSelected = null;
    },
    cancelPlayerToTeamTemp(player) {
      this.players.push(player);
      this.players.sort((a, b) => a.nick > b.nick);
      this.teamTemp.players = this.teamTemp.players.filter((p) => p != player);
    },
    addTeamTempToTournamentTemp() {
      this.tournamentTemp.teams.push(this.teamTemp);
      this.teamTemp = new Team();
    },
    delTeam(team) {
      this.players = this.players.concat(team.players);
      this.players.sort((a, b) => a.nick > b.nick);
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