<template>
  <div>
    <form @submit.prevent="send">
      <!-- Header controls -->
      <div class="flex justify-center space-x-3 pb-3">
        <label
          :class="[
            'w-full text-center border bg-gradient-to-b',
            {
              'cursor-pointer text-gray-900 border-gray-300 hover:border-gray-200 from-gray-100 to-gray-300 hover:from-gray-50 hover:to-gray-200':
                playForm.side_win !== 'good',
            },
            {
              'cursor-default text-yellow-900 border-yellow-400 from-yellow-200 to-yellow-400':
                playForm.side_win === 'good',
            },
          ]"
        >
          <input
            v-model="playForm.side_win"
            type="radio"
            name="radio"
            value="good"
            hidden
          />
          Good
        </label>
        <div>
          <button
            class="
              w-40
              text-green-900
              border border-green-400
              hover:border-green-300
              bg-gradient-to-b
              from-green-200
              to-green-400
              hover:from-green-100
              hover:to-green-300
            "
            type="submit"
          >
            Save
          </button>
        </div>

        <label
          :class="[
            'w-full text-center border bg-gradient-to-b',
            {
              'cursor-pointer text-gray-900 border-gray-300 hover:border-gray-200 from-gray-100 to-gray-300 hover:from-gray-50 hover:to-gray-200':
                playForm.side_win !== 'bad',
            },
            {
              'cursor-default text-yellow-900 border-yellow-400 from-yellow-200 to-yellow-400':
                playForm.side_win === 'bad',
            },
          ]"
        >
          <input
            v-model="playForm.side_win"
            type="radio"
            name="radio"
            value="bad"
            hidden
          />
          Bad
        </label>
      </div>
      <!-- Players -->
      <div class="flex border border-t-0 border-b-0">
        <!-- Player list -->
        <div
          class="w-1/10 h-40 flex flex-col"
          v-for="(pr, index) in playForm.player_results"
          :key="index"
        >
          <!-- Player or Bot button -->
          <label
            :class="[
              'cursor-pointer bg-gradient-to-bl border text-center',
              {
                'border-gray-300 hover:border-gray-200 from-gray-100 to-gray-300 hover:from-gray-50 hover:to-gray-200':
                  pr.bot,
              },
              {
                'border-blue-300 hover:border-blue-200 from-blue-100 to-blue-300 hover:from-blue-50 hover:to-blue-200':
                  !pr.bot,
              },
            ]"
          >
            <span v-if="pr.bot">Bot</span>
            <span v-if="!pr.bot">Player</span>
            <input v-model="pr.bot" type="checkbox" hidden />
          </label>
          <!-- Side -->
          <div class="flex">
            <div
              v-if="pr.side === 'good'"
              class="h-1 w-full bg-gradient-to-b from-green-200 to-green-400"
            ></div>
            <div
              v-if="pr.side === 'bad'"
              class="h-1 w-full bg-gradient-to-b from-red-200 to-red-400"
            ></div>
          </div>
          <!-- Player form -->
          <div
            class="flex flex-col p-1 justify-between h-full bg-center bg-cover"
            :style="[
              {
                'background-image':
                  'url(' +
                  $store.state.local +
                  (pr.bot
                    ? '/npc/bot.png'
                    : `/npc/${getHero(pr.hero).name}.png`) +
                  ')',
              },
            ]"
          >
            <!-- Player -->
            <select
              class="
                w-full
                py-1
                border border-gray-200 border-opacity-50
                bg-gray-50 bg-opacity-50
              "
              required
              v-model="pr.player"
              v-if="!pr.bot"
            >
              <option :value="p.id" v-for="p in players" :key="p.id">
                {{ p.nick }}
              </option>
            </select>
            <!-- KDA -->
            <div class="flex" v-if="!pr.bot">
              <!-- K -->
              <div
                class="
                  flex flex-col
                  text-center
                  border border-r-0 border-gray-200 border-opacity-50
                  bg-gray-50 bg-opacity-50
                "
              >
                <span class="text-xs">K</span>
                <input
                  class="w-full text-center bg-white bg-opacity-0"
                  v-model="pr.kills"
                  v-if="!pr.bot"
                  type="text"
                  placeholder="Kills"
                />
              </div>
              <!-- D -->
              <div
                class="
                  flex flex-col
                  text-center
                  border border-r-0 border-gray-200 border-opacity-50
                  bg-gray-50 bg-opacity-50
                "
              >
                <span class="text-xs">D</span>
                <input
                  class="w-full text-center bg-white bg-opacity-0"
                  v-model="pr.deths"
                  v-if="!pr.bot"
                  type="text"
                  placeholder="Deths"
                />
              </div>
              <!-- A -->
              <div
                class="
                  flex flex-col
                  text-center
                  border border-gray-200 border-opacity-50
                  bg-gray-50 bg-opacity-50
                "
              >
                <span class="text-xs">A</span>
                <input
                  class="w-full text-center bg-white bg-opacity-0"
                  v-model="pr.asist"
                  v-if="!pr.bot"
                  type="text"
                  placeholder="Asist"
                />
              </div>
            </div>
            <!-- Hero -->
            <select
              class="
                w-full
                py-1
                border border-gray-200 border-opacity-50
                bg-gray-50 bg-opacity-50
              "
              v-if="!pr.bot"
              v-model="pr.hero"
              required
            >
              <option :value="h.id" v-for="h in heroes" :key="h.id">
                {{ h.displayName }}
              </option>
            </select>
          </div>
          <!-- win -->
          <div class="flex">
            <div
              v-if="pr.win"
              class="h-1 w-full bg-gradient-to-b from-yellow-200 to-yellow-400"
            ></div>
            <div
              v-if="!pr.win"
              class="h-1 w-full bg-gradient-to-b from-gray-200 to-gray-400"
            ></div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapMutations } from "vuex";

import { INIT_PLAYERS } from "@/store/mutations-type";
import Elo from "@/store/model/elo";
import Player from "@/store/model/player";
import Hero from "@/store/model/hero";
import Play from "@/store/model/play";

export default {
  name: "Plays",
  data() {
    return {
      plays: [],
      playForm: Play,
    };
  },
  computed: {
    ...mapState({
      strapi: (state) => state.strapi,
      players: (state) => state.players,
      heroes: (state) => state.heroes,
    }),
  },
  methods: {
    ...mapMutations([INIT_PLAYERS]),

    send() {
      var out = [];

      // players to win or lose
      var playersWin = [];
      var mediaWin = 0;
      var playersLose = [];
      var mediaLose = 0;
      this.playForm.player_results.forEach((pr) => {
        pr.win = this.playForm.side_win == pr.side;

        if (!pr.bot) {
          if (pr.win) {
            playersWin.push(pr.player);
            mediaWin += this.getPlayer(pr.player).elo;
          }
          if (!pr.win) {
            playersLose.push(pr.player);
            mediaLose += this.getPlayer(pr.player).elo;
          }
        }
      });

      if (playersWin.length > 0 && playersLose.length > 0) {
        this.elo(playersWin, playersLose);
        mediaWin /= playersWin.length;
        mediaLose /= playersLose.length;
      }

      this.playForm.player_results.forEach((pr) => {
        if (!pr.bot) {
          pr.elo = this.getPlayer(pr.player).elo;
          if (pr.win) {
            let telo = new Elo(pr.elo, mediaLose);
            pr.eloPlus = telo.getPlusA();
          } else {
            let telo = new Elo(mediaWin, pr.elo);
            pr.eloPlus = telo.getPlusB();
          }
        }
        axios.post(this.strapi + "/player-results", pr).then(({ data }) => {
          out.push(data.id);

          if (out.length === 10) {
            axios
              .post(
                this.strapi + "/plays",
                new Play(out, this.playForm.side_win)
              )
              .then(({ data }) => {
                this.$emit("added", data);
                this.resetForm();
                this.initPlayers();
              });
          }
        });
      });
    },

    elo(win, lose) {
      var pWin = [];
      var pLose = [];

      // media del ELO q ganan
      let eloWin = 0;
      win.forEach((id) => {
        let ptemp = this.getPlayer(id);
        eloWin += ptemp.elo;
        pWin.push(ptemp);
      });
      eloWin /= win.length;

      // media del ELO q pierden
      let eloLose = 0;
      lose.forEach((id) => {
        let ptemp = this.getPlayer(id);
        eloLose += ptemp.elo;
        pLose.push(ptemp);
      });
      eloLose /= lose.length;

      // update elo de los q ganana
      pWin.forEach((player) => {
        let elo = new Elo(player.elo, eloLose);
        let playerOut = new Player(
          player.fullName,
          player.nick,
          elo.getEloA(),
          player.active
        );

        axios
          .put(`${this.strapi}/players/${player.id}`, playerOut)
          .then(() => {});
      });

      // update elo de los q pierden
      pLose.forEach((player) => {
        let elo = new Elo(eloWin, player.elo);
        let playerOut = new Player(
          player.fullName,
          player.nick,
          elo.getEloB(),
          player.active
        );

        axios
          .put(`${this.strapi}/players/${player.id}`, playerOut)
          .then(() => {});
      });
    },

    getPlayer(id) {
      const temp = this.players.find((p) => p.id == id);
      return temp ? temp : new Player();
    },

    getHero(id) {
      const temp = this.heroes.find((p) => p.id == id);
      return temp ? temp : new Hero();
    },

    resetForm() {
      this.playForm = new Play();
    },
  },
  watch: {
    "playForm.side_win"() {
      this.playForm.player_results.forEach((pr) => {
        pr.win = this.playForm.side_win === pr.side;
      });
    },
  },
  mounted() {
    this.resetForm();
  },
};
</script>