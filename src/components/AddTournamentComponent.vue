<template>
  <div>
    <div
      v-if="$store.state.players.length > 0"
      class="add-tournament-container"
    >
      <div class="tournament">
        Tournament
        <input required type="text" v-model="tournamentTemp.name" />
        <button
          class="success"
          @click="submitTournament()"
          v-if="
            (tournamentTemp.teams.length > 2 && tournamentTemp.name) || true
          "
        >
          Add
        </button>
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
              <button class="danger" @click="delTeam(team)">
                <i class="fa fa-trash"></i>
              </button>
            </div>
          </div>
        </transition-group>

        <div class="team new-team" v-if="newTeamVisibility">
          <div class="header">
            <input
              required
              type="text"
              v-model="teamTemp.name"
              placeholder="Team name ..."
            />
            <i v-if="teamTemp.players.length > 0" class="elo">
              {{ eloMediaTeam(teamTemp) }}
            </i>
          </div>
          <div class="add-player-container">
            <button class="success" @click="addRandomPlayerToTeamTemp">
              random
            </button>
            <select v-model="playerSelected">
              <option v-for="p in players" :key="p" :value="p">
                {{ p.nick }}
              </option>
            </select>
            <button @click="addPlayerToTeamTemp">add</button>
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
              Add team
            </button>
          </div>
        </div>
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
import Team from "@/store/model/team";

export default {
  data() {
    return {
      players: [],
      playerSelected: {},
      teamTemp: new Team(),
      tournamentTemp: new Tournament(),
    };
  },
  computed: {
    ...mapState({
      strapi: (state) => state.strapi,
    }),
    newTeamVisibility() {
      return this.teamTemp.players.length > 0 || this.players.length > 0;
    },
  },
  created() {
    this.players = this.$store.state.players; // clone the players from store
  },
  methods: {
    ...mapMutations([ADD_TOURNAMENT]),
    async submitTournament() {
      var arr = [];
      await this.tournamentTemp.teams.forEach((t) => {
        axios.post(this.strapi + "/teams", t).then(({ data }) => {
          arr.push(data);
        });
      });
      this.tournamentTemp.teams = arr.copyWithin(-1);
      await axios
        .post(this.strapi + "/tournaments", this.tournamentTemp)
        .then(({ data }) => {
          this.addTournament(data);
          this.tournamentTemp = new Tournament();
          this.teamTemp = new Team();
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
  },
};
</script>

<style lang="scss" scoped>
@import "@/theme/theme.scss";

.add-tournament-container {
  border: 1px solid rgba(0, 225, 255, 0.5);
  background: rgba(0, 247, 255, 0.3);
  padding: map-get($map: $spacings, $key: 3);

  .tournament {
  }

  .team-header {
    margin-top: map-get($map: $spacings, $key: 3);
  }
  .teams-container {
    display: flex;
    margin-top: map-get($map: $spacings, $key: 3);

    .team {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: map-get($map: $spacings, $key: 2);
      border: 1px solid rgba(0, 225, 255, 0.5);
      background: rgba(0, 247, 255, 0.3);
      min-width: 100px;
      margin-right: map-get($map: $spacings, $key: 3);
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
      .add-player-container {
        margin-top: map-get($map: $spacings, $key: 2);
        height: 100%;
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
}
</style>