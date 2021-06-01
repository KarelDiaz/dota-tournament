<template>
  <div>
    <div class="options">
      <form class="hide-xs add-player" @submit.prevent="send">
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
        <th>Puntos ↓</th>
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
        class="item"
        v-for="(p, i) in players
          .filter((p) => p.nick != 'bot')
          .sort((a, b) => a.elo < b.elo)"
        :key="p.nick"
        @click="setPlayerInfo(p)"
      >
        <td :class="['position' + (i + 1)]" style="text-align: center">
          {{ i + 1 }}
        </td>
        <td class="nick">{{ p.nick }}</td>
        <td>{{ p.elo || 0 }}</td>
        <td>{{ p.p || 0 }}</td>
        <td class="hide-xs">{{ p.v || 0 }}</td>
        <td>{{ p.p > 0 ? Math.round((p.v / p.p) * 1000) : 0 }}</td>
        <td>{{ p.k || 0 }}</td>
        <td class="hide-xs">{{ Math.round(p.k / p.p) || 0 }}</td>
        <td>{{ p.d || 0 }}</td>
        <td class="hide-xs">{{ Math.round(p.d / p.p) || 0 }}</td>
        <td>{{ p.a || 0 }}</td>
        <td class="hide-xs">{{ Math.round(p.a / p.p) || 0 }}</td>
        <td class="hide-xs">
          <button v-if="false" class="danger" @click="del(p.id)">
            Eliminar
          </button>
          <button @click="preMod(p.id)">Edit</button>
          <button v-if="false" @click="setPlayerInfo(p)">Info</button>
        </td>
      </tr>
    </table>

    <transition name="slide-top">
      <div class="info-container" v-if="playerInfo">
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

          <div
            class="line"
            :style="'transform: translateY(' + (1400 - playerInfo.elo) + 'px)'"
          >
            <b class="text">{{ playerInfo.elo }}</b>
          </div>

          <div
            class="info-item"
            v-for="pr in playerInfoResults"
            :key="pr.id"
            :style="'width:' + 98 / playerInfoResults.length + 'vw'"
            @click="setResultInfo(pr)"
          >
            <div
              :class="['info-hover', { waching: pr.id == resultInfo.id }]"
              :style="'width:' + 98 / playerInfoResults.length + 'vw'"
            ></div>
            <span class="info-text">
              <b class="result">{{ pr.elo + pr.eloPlus }}</b>
              <span v-if="false">{{ pr.id }}</span>
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
              :class="[pr.eloPlus > 0 ? 'good' : 'bad', { bet: pr.bet }]"
              :style="[
                'min-height:' + Math.abs(pr.eloPlus) + 'px',
                'transform:translateY(' +
                  (pr.elo - 1400 + pr.eloPlus / 2) * -1 +
                  'px)',
              ]"
            ></div>
          </div>
        </div>
      </div>
    </transition>

    <PlayComponent v-if="playInfo" :playIn="playInfo"></PlayComponent>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapMutations } from "vuex";

import PlayComponent from "@/components/PlayComponent";
import Player from "@/store/model/player";
import {
  START_LOADING,
  END_LOADING,
  INIT_PLAYERS,
  SET_PLAYER_INFO,
  SET_RESULT_INFO,
} from "@/store/mutations-type";

export default {
  name: "Players",
  data() {
    return {
      playerForm: new Player(),
      textFilter: "",
      idMod: -1,
    };
  },
  computed: {
    ...mapState({
      strapi: (state) => state.strapi,
      players: (state) => state.players,
      playerInfo: (state) => state.playerInfo,
      playerInfoResults: (state) => state.playerInfoResults,
      resultInfo: (state) => state.resultInfo,
      playInfo: (state) => state.playInfo,
    }),
  },
  components: {
    PlayComponent,
  },
  methods: {
    ...mapMutations([
      START_LOADING,
      END_LOADING,
      INIT_PLAYERS,
      SET_PLAYER_INFO,
      SET_RESULT_INFO,
    ]),

    filter() {
      /*axios.get(this.strapi + "/players").then(({ data }) => {
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
      });*/
    },

    send() {
      if (this.idMod >= 0) {
        axios
          .put(this.strapi + "/players/" + this.idMod, this.playerForm)
          .then(() => {
            this.filter();
            this.playerForm = new Player();
            this.initPlayers();
          });
      } else {
        axios.post(this.strapi + "/players", this.playerForm).then(() => {
          this.playerForm = new Player();
          this.filter();
          this.initPlayers();
        });
      }
      this.idMod = -1;
    },

    preMod(id) {
      axios.get(this.strapi + "/players/" + id).then(({ data }) => {
        this.idMod = id;
        this.playerForm = new Player(
          data.fullName,
          data.nick,
          data.elo,
          data.active
        );
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/theme/theme.scss";

.options {
  display: flex;
  justify-content: right;
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

  .position {
    &1 {
      background-color: map-get($map: $color, $key: gold-player);
      color: map-get($map: $bg, $key: 1);
      font-weight: bold;
    }
    &2 {
      background-color: map-get($map: $color, $key: silver-player);
      color: map-get($map: $bg, $key: 1);
      font-weight: bold;
    }
    &3 {
      background-color: map-get($map: $color, $key: bronce-player);
      color: map-get($map: $bg, $key: 1);
      font-weight: bold;
    }
  }
  .item {
    &:nth-child(even) {
      background-color: map-get($map: $bg, $key: 2);
    }

    &:hover {
      background-color: map-get($map: $bg, $key: 3);
      color: whitesmoke;
    }
  }

  .nick {
    text-transform: capitalize;
  }
}

$width: calc(calc(calc(100vw / 10) - 5px) * 10);
$width-xs: calc(calc(100vw / 10) * 10);

.info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;

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
    width: $width;

    overflow-x: auto;
    height: 400px;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.3);

    @media screen and (max-width: 899px) {
      & {
        width: $width-xs;
      }
    }

    .line {
      position: absolute;
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      width: $width;
      display: flex;
      flex-direction: column;
      justify-content: center;

      @media screen and (max-width: 899px) {
        & {
          width: $width-xs;
        }
      }

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
        transform: translate(20px, -165px);
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
          &.bet {
            background-color: map-get($map: $color, $key: win);
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
        &.bet {
          background-color: map-get($map: $color, $key: win-line);
        }
      }
    }
  }
}
</style>
