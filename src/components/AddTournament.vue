<template>
  <div class="container">
    <button @click="log()">add t</button>
    <div>
      tournament
      <input required type="text" v-model="tournamentTemp.name" />
    </div>
    <div>
      <h4>teams</h4>
      <div v-for="team in tournamentTemp.teams" :key="team">
        team name: {{ team.name }}
        <ul>
          <li v-for="p in team.players" :key="p">{{ p.nick }}</li>
        </ul>
      </div>

      <div>
        new team
        <input type="text" v-model="teamTemp.name" />
        <div>
          <h5>players</h5>
          <ul>
            <li
              v-for="p in teamTemp.players"
              :key="p"
              @click="cancelPlayerToTeamTemp(p)"
            >
              {{ p.nick }}
            </li>
          </ul>
          <select v-model="playerSelected">
            <option v-for="p in players" :key="p" :value="p">
              {{ p.nick }}
            </option>
          </select>
          <button @click="addPlayerToTeamTemp">add</button>
          <button @click="addRandomPlayerToTeamTemp">random</button>
        </div>
        <button @click="addTeamTempToTournamentTemp">add team</button>
      </div>
    </div>
  </div>
</template>

<script>
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
  created() {
    this.players = this.$store.state.players;
  },
  methods: {
    log() {
      console.log("tournamettemp", this.tournamentTemp);
      console.log("teamtemp", this.teamTemp);
    },
    addPlayerToTeamTemp() {
      if (!this.playerSelected.nick) return;
      this.teamTemp.players.push(this.playerSelected);
      this.players = this.players.filter((p) => p != this.playerSelected);
      this.playerSelected = {};
    },
    addRandomPlayerToTeamTemp() {
      let n = this.players.length;
      let pTemp = this.players[parseInt(n * Math.random())];
      this.teamTemp.players.push(pTemp);
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
  },
};
</script>

<style>
</style>