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
        @click="idPlayerInfo = p.id"
      >
        <td style="text-align:center">{{ i + 1 }}</td>
        <td class="nick">{{ p.nick }}</td>
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
          <button v-if="false" @click="idPlayerInfo = p.id">Info</button>
        </td>
      </tr>
    </table>

    <div class="info-container" v-if="idPlayerInfo">
      <b class="info-name">{{ playerInfo.nick }}</b>
      <div class="info">
        <div class="line p1500">
          <span class="text">1500</span>
        </div>

        <div class="line p1400">
          <span class="text">1400</span>
        </div>

        <div class="line p1300">
          <span class="text">1300</span>
        </div>

        <div class="line" :style="'transform: translateY(' + (1400 - playerInfo.elo) + 'px)'">
          <span class="text">{{ playerInfo.elo }}</span>
        </div>

        <div
          class="info-item"
          v-for="pr in playerResultsInfo"
          :key="pr.id"
          :style="'width:' + 98 / playerResultsInfo.length + 'vw'"
          @click="idPlayerResultInfo = pr.id"
        >
          <div
            :class="['info-hover', {waching:pr.id==idPlayerResultInfo}]"
            :style="'width:' + 98 / playerResultsInfo.length + 'vw'"
          ></div>
          <span class="info-text">
            <b class="result">{{ pr.elo + pr.eloPlus }}</b>
            <i>
              <span>{{ pr.elo }}</span>
              <span :class="[pr.eloPlus > 0 ? 'good' : 'bad', 'val']">
                <span v-if="pr.eloPlus > 0">+</span>
                <span v-else>-</span>
                {{ Math.abs(pr.eloPlus) }}
              </span>
            </i>
          </span>
          <div
            class="info-item-val"
            :class="pr.eloPlus > 0 ? 'good' : 'bad'"
            :style="[
              'min-height:' + Math.abs(pr.eloPlus) + 'px',
              'transform:translateY(' +
                (pr.elo - 1400 + pr.eloPlus / 2) * -1 +
                'px)'
            ]"
          ></div>
        </div>
      </div>
    </div>

    <PlayComponent v-if="playInfo" :playIn="playInfo"></PlayComponent>
  </div>
</template>

<script>
import axios from "axios";
import PlayComponent from "@/components/PlayComponent";
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
      playerResultsInfo: [],
      idPlayerResultInfo: "",
      playInfo: null
    };
  },
  components: {
    PlayComponent
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
      this.idPlayerResultInfo = "";
      this.playerResultsInfo = this.playerResults
        .filter(p => p.player.id == id)
        .reverse();

      this.playerInfo = this.players.find(p => p.id == id);
    },
    idPlayerResultInfo(val) {
      this.playInfo = this.plays.find(p =>
        p.player_results.find(pr => pr.id == val)
      );
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
    &:nth-child(even) {
      background-color: map-get($map: $bg, $key: 2);
    }

    &:hover {
      background-color: map-get($map: $bg, $key: 3);
    }
  }

  .nick{
    text-transform: capitalize;
  }
}

.info-container {
  $width-info: 25px;
  display: flex;
  flex-direction: column;
  margin: 1.5vw;

  .info-name {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    font-size: large;
    text-transform: uppercase;
  }

  .info {
    display: flex;
    flex-direction: row;
    width: 97vw;
    overflow-x: auto;
    height: 400px;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.3);

    .line {
      position: absolute;
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      width: 97vw;
      display: flex;
      flex-direction: column;
      justify-content: center;

      &.p1500 {
        transform: translateY(-100px);
      }

      &.p1300 {
        transform: translateY(100px);
      }

      .text {
        position: absolute;
        padding-left: 5px;
      }
    }

    .info-hover {
      position: absolute;
      height: 400px;
      cursor: pointer;
      &.waching {
        background-color: transparentize(
          $color: map-get($map: $bg, $key: 3),
          $amount: 0.5
        );
      }

      &:hover {
        background-color: transparentize(
          $color: map-get($map: $bg, $key: 2),
          $amount: 0.5
        );
      }
    }

    &-item {
      display: flex;
      flex-direction: column;
      align-content: center;
      justify-content: center;

      .info-text {
        cursor: default;
        display: none;
        position: absolute;
        transform: translateY(-165px);
        font-size: small;

        .val {
          padding-left: 5px;
          &.bad {
            color: map-get($map: $color, $key: bad-plus);
          }

          &.good {
            color: map-get($map: $color, $key: good-plus);
          }
        }

        .result {
          font-size: initial;
        }
      }
      &:hover {
        .info-text {
          display: flex;
          flex-direction: column;
        }
        .info-item-val {
          &.bad {
            background-color: map-get($map: $color, $key: bad);
            clip-path: polygon(40% 30%, 0% 100%, 60% 60%, 100% 0%);
          }

          &.good {
            background-color: map-get($map: $color, $key: good);
            clip-path: polygon(0% 0%, 20% 60%, 100% 100%, 60% 20%);
          }
        }
      }

      &-val {
        transition: clip-path 0.2s;
        &.bad {
          background-color: map-get($map: $color, $key: bad-plus);
          clip-path: polygon(80% 0%, 0% 100%, 20% 100%, 100% 0%);
        }

        &.good {
          transition: clip-path 0.3s;
          background-color: map-get($map: $color, $key: good-plus);
          clip-path: polygon(0% 0%, 80% 100%, 100% 100%, 20% 0%);
        }
      }
    }
  }
}
</style>
