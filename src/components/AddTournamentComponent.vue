<template>
  <div>
    <div
      v-if="$store.state.players.length > 0"
      class="add-tournament-container"
    >
      <div class="title">New <b>Tournament</b></div>
      <div class="tournament">
        <button
          class="success"
          @click="
            tournamentTemp.name =
              'Tournament ' + ($store.state.tournaments.length + 1)
          "
        >
          R <i class="fa fa-plus"></i>
        </button>
        <input
          required
          type="text"
          v-model="tournamentTemp.name"
          placeholder="Name"
        />
        <select v-model="tournamentTemp.type" placeholder="Type">
          <option v-for="t in tournamentTypes" :key="t.id" :value="t">
            {{ normalizeTounamentTypeName(t.name) }}
          </option>
        </select>
      </div>
      <div class="teams-container">
        <transition-group name="slide-right">
          <div class="team" v-for="team in tournamentTemp.teams" :key="team">
            <div class="header">
              {{ team.name }}
              <i class="elo">{{ eloMediaTeam(team) }}</i>
            </div>
            <div class="player-container">
              <span class="player" v-for="p in team.players" :key="p">
                {{ p.nick }}
                <i class="elo">{{ p.elo }}</i>
              </span>
            </div>
            <div class="footer">
              <button class="" @click="delTeam(team)">
                <i class="fa fa-trash"></i>
              </button>
            </div>
          </div>
        </transition-group>

        <div class="team new-team" v-if="newTeamVisibility">
          <div class="header">
            <div>
              <button
                class="success"
                @click="
                  teamTemp.name = 'Team ' + (tournamentTemp.teams.length + 1)
                "
              >
                R <i class="fa fa-plus"></i>
              </button>
              <input
                required
                type="text"
                v-model="teamTemp.name"
                placeholder="Team name"
              />
            </div>
            <small class="elo">
              Team ELO:
              <i v-if="teamTemp.players.length > 0" class="elo">
                {{ eloMediaTeam(teamTemp) }}
              </i>
            </small>
          </div>
          <div class="add-player-container">
            <small class="header">Players</small>
            <div class="options">
              <button class="success" @click="addRandomPlayerToTeamTemp">
                R <i class="fa fa-plus"></i>
              </button>
              <select v-model="playerSelected" class="add-player-players">
                <option v-for="p in players" :key="p" :value="p">
                  {{ p.nick }}
                </option>
              </select>
              <button @click="addPlayerToTeamTemp">
                <i class="fa fa-plus"></i>
              </button>
            </div>
            <div class="player-container">
              <transition-group name="slide-top">
                <span
                  class="player"
                  v-for="p in teamTemp.players"
                  :key="p"
                  @click="cancelPlayerToTeamTemp(p)"
                >
                  {{ p.nick }}
                  <i class="elo">{{ p.elo }}</i>
                  <i class="fa fa-arrow-up"></i>
                </span>
              </transition-group>
            </div>
          </div>
          <div class="footer">
            <button
              class="success"
              @click="addTeamTempToTournamentTemp"
              v-if="teamTemp.players.length > 0 && teamTemp.name"
            >
              <i class="fa fa-plus"></i>
            </button>
          </div>
        </div>
      </div>

      <div v-if="!addTournamentOk" class="errors-tourn">
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

      <div v-if="addTournamentOk" class="teams-add-button">
        <small v-if="tournamentTemp.type && tournamentTemp.name" class="info">
          <!--Info-->
          <div>
            <span>
              El torneo <b>{{ tournamentTemp.name.toUpperCase() }}</b>
              se efectuara en el formato de
              <b>
                {{ normalizeTounamentTypeName(tournamentTemp.type.name) }}
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
        <button class="btn success" @click="submitTournament()">
          <i class="fa fa-plus"></i>
        </button>
      </div>
    </div>
    <div v-else class="add-tournament-container">
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
      playerSelected: {},
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
                this.$emit("tournament:add", data);
                this.addTournament(data);
                this.tournamentTemp = new Tournament();
                this.teamTemp = new Team();
              });
          }
        });
      });
    },
    eloMediaTeam(team) {
      if (team.players.length == 0) return 0;
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
      this.playerSelected = {};
    },
    addRandomPlayerToTeamTemp() {
      if (this.players.length == 0) return;
      let n = this.players.length;
      let pTemp = this.players[parseInt(n * Math.random())];
      this.teamTemp.players.push(pTemp);
      this.teamTemp.players.sort((a, b) => a.nick > b.nick);
      this.players = this.players.filter((p) => p != pTemp);
      this.playerSelected = {};
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
    normalizeTounamentTypeName(name) {
      let out = "";
      for (let i = 0; i < name.length; i++)
        out += name[i] !== "_" ? name[i] : " ";
      return out.toUpperCase();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/theme/theme.scss";

.add-tournament-container {
  border: 1px solid rgba(0, 225, 255, 0.5);
  background: rgba(0, 247, 255, 0.3);
  padding: map-get($map: $spacings, $key: 3);

  .title {
    margin-bottom: map-get($map: $spacings, $key: 3);
  }

  .team-header {
    margin-top: map-get($map: $spacings, $key: 3);
  }
  .teams-container {
    display: flex;
    flex-wrap: wrap;

    .team {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: map-get($map: $spacings, $key: 2);
      margin-top: map-get($map: $spacings, $key: 3);
      border: 1px solid rgba(0, 225, 255, 0.5);
      background: rgba(0, 247, 255, 0.3);
      min-width: 100px;
      margin-right: map-get($map: $spacings, $key: 3);
      &:last-of-type {
        margin-right: 0;
      }
      .elo {
        font-size: 0.7rem;
      }
      .header {
        display: flex;
        flex-direction: column;
      }
      .player-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        margin-top: map-get($map: $spacings, $key: 3);

        .player {
          padding: map-get($map: $spacings, $key: 1);
        }
      }

      .footer {
        margin-top: map-get($map: $spacings, $key: 3);

        button {
          width: 100%;
        }
      }
    }

    .new-team {
      background: rgba(0, 247, 255, 0.1);

      .header {
        .elo {
          margin-top: map-get($map: $spacings, $key: 1);
        }
      }
      .add-player-container {
        margin-top: map-get($map: $spacings, $key: 3);
        height: 100%;

        .header {
          margin-bottom: map-get($map: $spacings, $key: 1);

          .elo {
            margin-top: map-get($map: $spacings, $key: 1);
          }
        }
      }
      .player {
        cursor: pointer;
        .fa {
          padding-left: map-get($map: $spacings, $key: 2);
          color: transparentize($color: white, $amount: 0.5);
          opacity: 0;
          animation: atent 0.3s infinite alternate;
          animation-play-state: paused;

          @keyframes atent {
            0% {
              transform: translateY(-5px);
            }
            100% {
              transform: translateY(5px);
            }
          }
        }

        &:hover {
          background: transparentize($color: white, $amount: 0.9);
          i {
            opacity: 1;
            animation-play-state: running;
          }
        }
      }
    }
  }

  .errors-tourn {
    margin-top: map-get($map: $spacings, $key: 3);
    color: map-get($map: $color, $key: win);
  }

  .teams-add-button {
    margin-top: map-get($map: $spacings, $key: 3);
    .btn {
      margin-top: map-get($map: $spacings, $key: 3);
      width: 100%;
    }
  }
}
</style>