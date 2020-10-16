<template>
  <div>
    <div class="options">
      <input type="text" placeholder="Filtrar" v-model="textFilter" @keyUp="filter" />

      <form class="hide-xs add-player" @submit.prevent="send">
        <input
          class="name"
          v-model="playerForm.fullName"
          required
          type="text"
          placeholder="Escriba el nombre"
        />
        <input
          class="nick"
          v-model="playerForm.nick"
          required
          type="text"
          placeholder="Escriba el nick"
        />
        <button class="success" type="submit">
          <span v-if="idMod == -1">Agregar</span>
          <span v-else>Editar</span>
        </button>
      </form>
    </div>

    <table class="players">
      <tr>
        <th></th>
        <th>Nick</th>
        <th>ELO ↓</th>
        <th>P</th>
        <th class="hide-xs">V</th>
        <th>Ave.</th>
        <th>K</th>
        <th class="hide-xs">K/P</th>
        <th>D</th>
        <th class="hide-xs">D/P</th>
        <th>A</th>
        <th class="hide-xs">A/P</th>
        <th class="hide-xs"></th>
      </tr>
      <tr
        class="players-item"
        v-for="(p, i) in players"
        :key="p.nick"
        :style="p.nick == 'bot' ? 'display:none' : ''"
        @click="idPlayerInfo=p.id"
      >
        <td style="text-align:center">{{ i + 1 }}</td>
        <td>{{ p.nick }}</td>
        <td>{{ p.elo }}</td>
        <td>{{ getPlays(p.id).length }}</td>
        <td class="hide-xs">{{ getPlaysWin(p.id).length }}</td>
        <td>
          {{
          getPlays(p.id).length > 0
          ? Math.round(
          (getPlaysWin(p.id).length / getPlays(p.id).length) * 1000
          )
          : 0
          }}
        </td>
        <td>{{ getK(p.id) }}</td>
        <td class="hide-xs">{{ Math.round(getK(p.id) / getPlays(p.id).length) }}</td>
        <td>{{ getD(p.id) }}</td>
        <td class="hide-xs">{{ Math.round(getD(p.id) / getPlays(p.id).length) }}</td>
        <td>{{ getA(p.id) }}</td>
        <td class="hide-xs">{{ Math.round(getA(p.id) / getPlays(p.id).length) }}</td>
        <td class="hide-xs">
          <button v-if="false" class="danger" @click="del(p.id)">Eliminar</button>
          <button @click="preMod(p.id)">Edit</button>
          <button v-if="false" @click="idPlayerInfo=p.id">Info</button>
        </td>
      </tr>
    </table>

    <div class="info-container">
      <span class="info-name">{{playerInfo.nick}}</span>
      <div class="info">
        <div class="line-1400"></div>
        <div class="line-1500">1500</div>
        <div class="line-1300">1300</div>
        <div class="info-item" v-for="pr in playerResultsInfo" :key="pr.id">
          <div
            class="info-item-val"
            :class="pr.eloPlus>0?'good':'bad'"
            :style="['min-height:'+Math.abs(pr.eloPlus)+'px','transform:translateY('+(( pr.elo - 1400 + pr.eloPlus/2) * - 1 ) +'px)']"
          >
            <span>{{pr.eloPlus}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import Player from "@/store/model/player";

export default {
  name: "Players",
  data() {
    return {
      plays: [],
      players: [],
      playerResults: [],
      playerForm: new Player(),
      textFilter: "",
      idMod: -1,
      idPlayerInfo: "",
      playerInfo: "",
      playerResultsInfo: []
    };
  },
  methods: {
    filter() {
      axios.get(this.$store.state.strapi + "/players").then(({ data }) => {
        this.players = data
          .filter(player => {
            // normalize texts
            let text = this.textFilter.toLowerCase();
            let name = player.fullName.toLowerCase();
            let nick = player.nick.toLowerCase();
            let elo = player.elo;

            //search text into data
            if (name.indexOf(text) >= 0) return true;
            if (nick.indexOf(text) >= 0) return true;
            if (elo == text) return true;

            return false; //discard player if no match
          })
          .sort((a, b) => {
            if (a.elo == b.elo) {
              return a.fullName > b.fullName;
            }
            return a.elo < b.elo;
          });
      });
    },

    send() {
      if (this.idMod >= 0) {
        axios
          .put(
            this.$store.state.strapi + "/players/" + this.idMod,
            this.playerForm
          )
          .then(() => {
            this.filter();
            this.playerForm = new Player();
          });
      } else {
        axios
          .post(this.$store.state.strapi + "/players", this.playerForm)
          .then(() => {
            this.playerForm = new Player();
            this.filter();
          });
      }
      this.idMod = -1;
    },

    preMod(id) {
      axios
        .get(this.$store.state.strapi + "/players/" + id)
        .then(({ data }) => {
          this.idMod = id;
          this.playerForm = new Player(
            data.fullName,
            data.nick,
            data.elo,
            data.active
          );
        });
    },

    del(id) {
      if (confirm("Estas seguro de eliminar el player"))
        axios.delete(this.$store.state.strapi + "/players/" + id).then(() => {
          this.players = this.players.filter(p => p.id != id);
        });
    },

    initPlays() {
      axios
        .get(this.$store.state.strapi + "/plays?_limit=-1")
        .then(({ data }) => (this.plays = data));
    },

    initPlayerResults() {
      axios
        .get(this.$store.state.strapi + "/player-results?_limit=-1")
        .then(({ data }) => {
          this.playerResults = data.filter(p => !p.bot);
        });
    },

    getPlays(idPlayer) {
      return this.plays.filter(p => {
        return p.player_results.find(pr => pr.player == idPlayer);
      });
    },

    getPlaysWin(idPlayer) {
      return this.plays.filter(p => {
        return p.player_results.find(pr => {
          return pr.player == idPlayer && pr.side == p.side_win;
        });
      });
    },

    getK(idPlayer) {
      let out = 0;
      this.plays.forEach(p => {
        const pr = p.player_results.find(pr => pr.player == idPlayer);
        out += pr ? pr.kills : 0;
      });
      return out;
    },

    getD(idPlayer) {
      let out = 0;
      this.plays.forEach(p => {
        const pr = p.player_results.find(pr => pr.player == idPlayer);
        out += pr ? pr.deths : 0;
      });
      return out;
    },

    getA(idPlayer) {
      let out = 0;
      this.plays.forEach(p => {
        const pr = p.player_results.find(pr => pr.player == idPlayer);
        out += pr ? pr.asist : 0;
      });
      return out;
    }
  },
  created() {
    this.filter();
    this.initPlays();
    this.initPlayerResults();
  },
  watch: {
    idPlayerInfo(id) {
      this.playerResultsInfo = this.playerResults
        .filter(p => p.player.id == id)
        .reverse();

      this.playerInfo = this.players.find(p => p.id == id);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/theme/theme.scss";
.options {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 0 5px;

  .add-player {
    display: flex;

    .name {
      border-right: none;
    }
  }
}

.players {
  width: 100%;
  text-align: left;

  &-item {
    &:nth-child(odd) {
      background-color: map-get($map: $bg, $key: 2);
    }

    &:hover {
      background-color: rgb(63, 56, 88);
    }
  }
}
.info-container {
  display: flex;
  flex-direction: column;
  padding: 10px 0;

  .info-name {
    display: flex;
    justify-content: center;
  }

  .info {
    display: flex;
    flex-direction: row;
    width: 100vw;
    overflow-x: auto;
    height: 350px;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    margin-top: 10px;

    .line-1400 {
      position: absolute;
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      width: 100vw;
    }
    .line-1500 {
      position: absolute;
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      width: 100vw;
      transform: translateY(-100px);
    }

    .line-1300 {
      position: absolute;
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      width: 100vw;
      transform: translateY(100px);
    }

    &-item {
      width: 25px;

      &-val {
        z-index: 1;

        &:hover {
          span {
            display: initial;
            cursor: default;
          }
        }

        &.bad {
          background-color: map-get($map: $color, $key: bad-plus);
        }

        &.good {
          background-color: map-get($map: $color, $key: good-plus);
        }
        span {
          display: none;
          position: absolute;
          transform: translateY(-20px);
          color: lightslategray;
        }
      }
    }
  }
}
</style>
