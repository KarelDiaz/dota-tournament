<template>
  <div class="flex flex-col p-2 space-y-2 sm:p-3 sm:space-y-3">
    <!-- Add and modify player -->
    <form @submit.prevent="send" class="flex justify-center">
      <div class="rounded-lg shadow-lg">
        <input
          class="px-2 py-1 border border-gray-100 rounded-l-lg bg-gradient-to-b from-white to-gray-100 focus:ring-green-200 focus:outline-none focus:ring-1 focus:border-transparent"
          v-model="playerForm.nick"
          required
          type="text"
          maxlength="15"
          placeholder="Escriba el nick"
        />
        <button
          class="px-5 py-1 text-green-900 border border-green-400 rounded-r-lg hover:border-green-300 bg-gradient-to-b from-green-200 to-green-400 hover:from-green-100 hover:to-green-300"
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
    <!-- Empty players -->
    <div v-if="players.length === 0" class="p-10 text-center text-gray-400">
      <span><i>Sin doteros no hay dota </i> 😜</span>
    </div>
    <!-- Player list -->
    <table v-if="players.length > 0" class="w-full">
      <tr>
        <td class="hidden font-bold sm:table-cell"></td>
        <td></td>
        <td></td>
        <td class="font-bold">MMR ↓</td>
        <td class="font-bold">P</td>
        <td class="hidden font-bold sm:table-cell">V</td>
        <td class="hidden font-bold sm:table-cell">AVE</td>
        <td class="font-bold">K</td>
        <td class="hidden font-bold sm:table-cell">K/P</td>
        <td class="font-bold">D</td>
        <td class="hidden font-bold sm:table-cell">D/P</td>
        <td class="font-bold">A</td>
        <td class="hidden font-bold sm:table-cell">A/P</td>
      </tr>
      <tr
        :class="[
          'cursor-pointer h-30',
          { 'hover:bg-gray-100': p.id !== playerInfo.id },
          { 'bg-blue-100 cursor-auto': p.id === playerInfo.id },
        ]"
        v-for="(p, i) in players
          .filter((p) => p.nick != 'bot')
          .sort((a, b) => b.mmr - a.mmr)"
        :key="p.nick"
        @click="setPlayerInfo(p)"
      >
        <!-- Position -->
        <td class="hidden sm:table-cell">
          <div
            :class="[
              'w-7 h-7 mx-auto flex justify-center items-center',
              {
                'from-yellow-100 to-yellow-400 border border-yellow-400 text-yellow-600':
                  i == 0,
              },
              {
                'from-gray-100 to-gray-400 border border-gray-400 text-gray-600':
                  i == 1,
              },
              {
                'from-yellow-300 to-yellow-600 border border-yellow-600 text-yellow-900':
                  i == 2,
              },
              {
                'bg-gradient-to-bl rounded-full font-extrabold shadow-md':
                  i <= 2,
              },
            ]"
          >
            {{ i + 1 }}
          </div>
        </td>
        <!-- Nick -->
        <td class="sm:p-3 sm:pr-6">
          <span
            @click="preMod(p.id)"
            class="h-full p-2 border border-transparent rounded-lg nick bg-gradient-to-b hover:shadow-lg hover:text-green-800 hover:border-green-200 hover:from-green-50 hover:to-green-200"
          >
            {{ p.nick }}
          </span>
        </td>
        <!-- Rank -->
        <td>
          <rank-component :mmr="p.mmr" :size="8"/>
        </td>
        <!-- MMR -->
        <td>{{ p.mmr || 0 }}</td>
        <!-- Plays -->
        <td>{{ p.p || 0 }}</td>
        <!-- Victories -->
        <td class="hidden sm:table-cell">{{ p.v || 0 }}</td>
        <!-- Average -->
        <td class="hidden sm:table-cell">
          {{ p.p > 0 ? Math.round((p.v / p.p) * 1000) : 0 }}
        </td>
        <!-- Kills -->
        <td>{{ p.k || 0 }}</td>
        <!-- Kills per play -->
        <td class="hidden sm:table-cell">{{ Math.round(p.k / p.p) || 0 }}</td>
        <!-- Death -->
        <td>{{ p.d || 0 }}</td>
        <!-- Daeth per play -->
        <td class="hidden sm:table-cell">{{ Math.round(p.d / p.p) || 0 }}</td>
        <!-- Asist -->
        <td>{{ p.a || 0 }}</td>
        <!-- Asist per play -->
        <td class="hidden sm:table-cell">{{ Math.round(p.a / p.p) || 0 }}</td>
      </tr>
    </table>
    <!-- New history player -->
    <transition name="slide-top">
      <player-history-component
        :player="playerInfo"
        v-if="playerInfo.id"
        @result:select="setResultInfo($event)"
      ></player-history-component>
    </transition>
    <!-- Play info -->
    <div v-if="playInfo.id">
      <play-component :play="playInfo"></play-component>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapMutations, mapGetters } from "vuex";

import moment from "moment";

import {
  START_LOADING,
  END_LOADING,
  INIT_PLAYERS,
  SET_PLAYER_INFO,
  SET_RESULT_INFO,
} from "@/store/type/mutations";
import { GET_RANK } from "@/store/type/getters";
import Player from "@/store/model/player";
import Rank from "@/store/model/rank";

import PlayComponent from "@/components/play/PlayComponent";
import PlayerHistoryComponent from "@/components/player/PlayerHistoryComponent";
import RankComponent from "@/components/RankComponent";

export default {
  name: "Players",
  data() {
    return {
      moment,
      Rank,
      playerForm: new Player(),
      textFilter: "",
      idMod: null,
    };
  },
  computed: {
    ...mapGetters([GET_RANK]),
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
    PlayerHistoryComponent,
    RankComponent
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
            let mmr = player.mmr;

            //search text into data
            if (name.indexOf(text) >= 0) return true;
            if (nick.indexOf(text) >= 0) return true;
            if (mmr == text) return true;

            return false; //discard player if no match
          })
          .sort((a, b) => {
            if (a.mmr == b.mmr) {
              return a.fullName > b.fullName;
            }
            return a.mmr < b.mmr;
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
          data.mmr,
          data.active
        );
      });
    },
  },
};
</script>
