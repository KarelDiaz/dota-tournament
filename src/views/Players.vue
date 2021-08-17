<template>
  <div class="mt-2">
    <!-- Add and modify player -->
    <form @submit.prevent="send" class="flex justify-center">
      <div class="shadow-lg rounded-lg">
        <input
          class="
            px-2
            py-1
            border border-gray-100
            bg-gradient-to-b
            from-white
            to-gray-100
            focus:ring-green-200
            focus:outline-none
            focus:ring-1
            focus:border-transparent
            rounded-l-lg
          "
          v-model="playerForm.nick"
          required
          type="text"
          placeholder="Escriba el nick"
        />
        <button
          class="
            px-5
            py-1
            text-green-900
            border border-green-400
            hover:border-green-300
            bg-gradient-to-b
            from-green-200
            to-green-400
            hover:from-green-100
            hover:to-green-300
            rounded-r-lg
          "
          type="submit"
        >
          <span v-if="!idMod">
            <i class="fa fa-plus"></i>
          </span>
          <span v-else>
            <i class="fa fa-pencil"></i>
          </span>
        </button>
      </div>
    </form>
    <!-- Player list -->
    <table v-if="players.length > 0" class="pb-3 w-full mt-6">
      <tr>
        <td class="font-bold hidden sm:table-cell"></td>
        <td class="font-bold">Nick</td>
        <td class="font-bold">ELO ↓</td>
        <td class="font-bold">P</td>
        <td class="font-bold hidden sm:table-cell">V</td>
        <td class="font-bold">AVE</td>
        <td class="font-bold">K</td>
        <td class="font-bold hidden sm:table-cell">K/P</td>
        <td class="font-bold">D</td>
        <td class="font-bold hidden sm:table-cell">D/P</td>
        <td class="font-bold">A</td>
        <td class="font-bold hidden sm:table-cell">A/P</td>
      </tr>
      <tr
        class="h-30"
        v-for="(p, i) in players
          .filter((p) => p.nick != 'bot')
          .sort((a, b) => b.elo - a.elo)"
        :key="p.nick"
        @click="setPlayerInfo(p)"
      >
        <td class="hidden sm:table-cell max-w-md">
          <span
            :class="[
              'px-3 py-1 h-full',
              {
                'from-yellow-100 to-yellow-400 border border-yellow-400 text-yellow-600':
                  i == 0,
              },
              {
                'from-gray-100 to-gray-400 border border-gray-400 text-gray-600':
                  i == 1,
              },
              {
                'from-yellow-400 to-yellow-700 border border-yellow-700 text-yellow-900':
                  i == 2,
              },
              {
                'bg-gradient-to-bl rounded-full font-extrabold shadow-md':
                  i <= 2,
              },
            ]"
          >
            {{ i + 1 }}
          </span>
        </td>
        <td class="pr-6">
          <button
            @click="preMod(p.id)"
            class="
              flex
              p-4
              items-center
              w-full
              h-full
              rounded-lg
              justify-start
              border border-transparent
              nick
              bg-gradient-to-b
              hover:shadow-lg
              hover:border-green-200
              hover:from-green-50
              hover:to-green-200
            "
          >
            <i class="fa fa-pencil mr-3"></i>
            <span>
              {{ p.nick }}
            </span>
          </button>
        </td>
        <td>{{ p.elo || 0 }}</td>
        <td>{{ p.p || 0 }}</td>
        <td class="hidden sm:table-cell">{{ p.v || 0 }}</td>
        <td>{{ p.p > 0 ? Math.round((p.v / p.p) * 1000) : 0 }}</td>
        <td>{{ p.k || 0 }}</td>
        <td class="hidden sm:table-cell">{{ Math.round(p.k / p.p) || 0 }}</td>
        <td>{{ p.d || 0 }}</td>
        <td class="hidden sm:table-cell">{{ Math.round(p.d / p.p) || 0 }}</td>
        <td>{{ p.a || 0 }}</td>
        <td class="hidden sm:table-cell">{{ Math.round(p.a / p.p) || 0 }}</td>
      </tr>
    </table>
    <!-- Empty players -->
    <div v-else class="no-players">
      <h1>No hay players disponibles</h1>
    </div>
    <!-- History player -->
    <transition name="slide-top">
      <div class="info-container" v-if="playerInfo.id">
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
              <i>{{ moment(pr.createdAt).format("MMMM D, YYYY, HH:mm") }}</i>
              <i>
                <span>{{ pr.elo }}</span>
                <span :class="[pr.eloPlus > 0 ? 'good' : 'bad', 'val']">
                  <span v-if="pr.eloPlus > 0">+</span>
                  <span v-else>-</span>
                  {{ Math.abs(pr.eloPlus) }}
                </span>
              </i>
              <b class="result">{{ pr.elo + pr.eloPlus }}</b>
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
    <!-- Play info -->
    <PlayComponent v-if="playInfo.id" :play="playInfo"></PlayComponent>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapMutations } from "vuex";

import moment from "moment";

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
      moment,
      playerForm: new Player(),
      textFilter: "",
      idMod: null,
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
      if (this.idMod) {
        // edit a player
        axios
          .put(this.strapi + "/players/" + this.idMod, this.playerForm)
          .then(() => {
            this.filter();
            this.playerForm = new Player();
            this.initPlayers();
          });
      } else {
        // add a player
        if (
          this.players.filter(
            (p) => p.nick.toLowerCase() == this.playerForm.nick.toLowerCase()
          ).length === 0
        ) {
          axios.post(this.strapi + "/players", this.playerForm).then(() => {
            this.playerForm = new Player();
            this.filter();
            this.initPlayers();
          });
        } else {
          alert("El usuario ya existe");
        }
      }
      this.idMod = null;
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
        background-color: transparentize($color: rgb(14, 0, 65), $amount: 0.5);
      }

      &:hover {
        background-color: transparentize($color: black, $amount: 0.5);
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
        transform: translate(10px, -165px);
        font-size: small;

        .val {
          padding-left: 5px;
          &.bad {
            color: brown;
          }

          &.good {
            color: greenyellow;
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
            background-color: red;
            clip-path: polygon(40% 30%, 0% 100%, 60% 60%, 100% 0%);
          }
          &.good {
            background-color: green;
            clip-path: polygon(0% 0%, 20% 60%, 100% 100%, 60% 20%);
          }
        }
      }

      &-val {
        transition: clip-path 0.2s;
        &.bad {
          background-color: brown;
          clip-path: polygon(80% 0%, 0% 100%, 20% 100%, 100% 0%);
        }

        &.good {
          transition: clip-path 0.3s;
          background-color: greenyellow;
          clip-path: polygon(0% 0%, 80% 100%, 100% 100%, 20% 0%);
        }
      }
    }
  }
}

.nick {
  i {
    //display: ;
    opacity: 0.1;
  }
  &:hover {
    i {
      opacity: 1;
    }
  }
}
</style>
