<template>
  <div>
    <div class="options">
      <form @submit.prevent="send">
        <div class="plays">
          <div class="play">
            <div class="play-options">
              <label
                :class="[
                  'btn',
                  'side-win',
                  { wining: playForm.side_win == 'good' }
                ]"
              >
                <input v-model="playForm.side_win" type="radio" name="radio" value="good" hidden />
                Good ganó
              </label>
              <div>
                <button type="submit" class="success">Guardar el play</button>
              </div>

              <label
                :class="[
                  'btn',
                  'side-win',
                  { wining: playForm.side_win == 'bad' }
                ]"
              >
                <input v-model="playForm.side_win" type="radio" name="radio" value="bad" hidden />
                Bad ganó
              </label>
            </div>
            <transition name="fade" appear>
              <div class="result-content">
                <div
                  :class="[
                    'result',
                    pr.side,
                    { win: playForm.side_win == pr.side }
                  ]"
                  v-for="(pr, index) in playForm.player_results"
                  :key="index"
                >
                  <span class="item-form">
                    <input v-model="pr.bot" type="checkbox" /> Bot
                  </span>
                  <select required class="item-form" v-model="pr.player" v-if="!pr.bot">
                    <option :value="p.id" v-for="p in $store.state.players" :key="p.id">{{ p.nick }}</option>
                  </select>

                  <div class="item-form kda" v-if="!pr.bot">
                    <span class="item-form">K</span>
                    <span class="item-form">D</span>
                    <span class="item-form">A</span>
                    <input
                      class="item-form"
                      v-model="pr.kills"
                      v-if="!pr.bot"
                      type="text"
                      placeholder="Kills"
                    />
                    <input
                      class="item-form"
                      v-model="pr.deths"
                      v-if="!pr.bot"
                      type="text"
                      placeholder="Deths"
                    />
                    <input
                      class="item-form"
                      v-model="pr.asist"
                      v-if="!pr.bot"
                      type="text"
                      placeholder="Asist"
                    />
                  </div>
                  <select class="item-form" v-if="!pr.bot" v-model="pr.hero" required>
                    <option
                      :value="h.id"
                      v-for="h in $store.state.heroes"
                      :key="h.id"
                    >{{ h.displayName }}</option>
                  </select>
                  <div class="black-shadow" :class="pr.side + (pr.bot ? ' bot' : '')"></div>

                  <img
                    class="hero-img"
                    :src="
                      !pr.bot
                        ? `npc/${getHero(pr.hero).name}.png`
                        : 'npc/bot.png'
                    "
                    :alt="getHero(pr.hero).name"
                  />
                </div>
              </div>
            </transition>
          </div>
        </div>
      </form>
    </div>

    <div class="filters">
      <div>
        <span class="hide-xs">Cantidad de plays a visualizar:</span>
        <select v-model="fCant">
          <option value="-1">Todos</option>
          <option value="10">10</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <div>
        <b>{{ plays.length }}</b> plays
      </div>
      <transition name="slide-right">
        <div class="info-plays-win" v-if="fPlayer">
          <b>
            {{
            plays.filter(p => {
            return p.player_results.find(
            pr => pr.player == fPlayer && pr.side == p.side_win
            );
            }).length
            }}
          </b>
          victorias
        </div>
      </transition>
      <div>
        <span class="hide-xs">Filtrar por usuario:</span>
        <select v-model="fPlayer">
          <option value>Todos</option>
          <option
            :value="p.id"
            v-for="p in $store.state.players"
            :key="p.id"
            :style="p.nick == 'bot' ? 'display:none' : ''"
          >{{ p.nick }}</option>
        </select>
      </div>
    </div>

    <div class="plays">
      <transition-group name="slide-right" tag="p">
        <PlayComponent v-for="play in plays" :key="play.id" :playIn="play"></PlayComponent>
      </transition-group>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import { START_LOADING, END_LOADING } from "@/store/mutations-type";
import Elo from "@/store/model/elo";
import Player from "@/store/model/player";
import Hero from "@/store/model/hero";
import Play from "@/store/model/play";
import PlayComponent from "@/components/PlayComponent";

export default {
  name: "Plays",
  data() {
    return {
      plays: [],
      players: [],
      heroes: [],
      playForm: Play,
      fCant: 10,
      fPlayer: ""
    };
  },
  components: {
    PlayComponent
  },
  methods: {
    send() {
      this.$store.commit(START_LOADING);
      var out = [];

      // players to win or lose
      var playersWin = [];
      var mediaWin = 0;
      var playersLose = [];
      var mediaLose = 0;
      this.playForm.player_results.forEach(pr => {
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

      this.playForm.player_results.forEach(pr => {
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
        axios
          .post(this.$store.state.strapi + "/player-results", pr)
          .then(({ data }) => {
            out.push(data.id);

            if (out.length === 10) {
              axios
                .post(
                  this.$store.state.strapi + "/plays",
                  new Play(out, this.playForm.side_win)
                )
                .then(() => {
                  this.resetForm();
                  this.filter();
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
      win.forEach(id => {
        let ptemp = this.getPlayer(id);
        eloWin += ptemp.elo;
        pWin.push(ptemp);
      });
      eloWin /= win.length;

      // media del ELO q pierden
      let eloLose = 0;
      lose.forEach(id => {
        let ptemp = this.getPlayer(id);
        eloLose += ptemp.elo;
        pLose.push(ptemp);
      });
      eloLose /= lose.length;

      // update elo de los q ganana
      pWin.forEach(player => {
        let elo = new Elo(player.elo, eloLose);
        let playerOut = new Player(
          player.fullName,
          player.nick,
          elo.getEloA(),
          player.active
        );

        this.$store.commit(START_LOADING);
        axios
          .put(`${this.$store.state.strapi}/players/${player.id}`, playerOut)
          .then(() => {
            this.$store.commit(END_LOADING);
          });
      });

      // update elo de los q pierden
      pLose.forEach(player => {
        let elo = new Elo(eloWin, player.elo);
        let playerOut = new Player(
          player.fullName,
          player.nick,
          elo.getEloB(),
          player.active
        );

        this.$store.commit(START_LOADING);
        axios
          .put(`${this.$store.state.strapi}/players/${player.id}`, playerOut)
          .then(() => {
            this.$store.commit(END_LOADING);
          });
      });
    },

    filter() {
      this.$store.commit(START_LOADING);
      axios
        .get(this.$store.state.strapi + "/plays?_limit=-1")
        .then(({ data }) => {
          this.plays = data.reverse();
          if (this.fPlayer != "")
            this.plays = this.plays.filter(p => {
              return p.player_results.find(pr => pr.player == this.fPlayer);
            });
          if (this.fCant != -1) this.plays = this.plays.slice(0, this.fCant);
          this.plays.forEach(play => {
            play.player_results = play.player_results.sort((a, b) => {
              if (a.side == b.side) {
                return a.bot;
              }
              return a.side < b.side;
            });
          });
          this.$store.commit(END_LOADING);
        });
    },

    del(id) {
      if (confirm("Seguro de eliminar el Play?")) {
        this.$store.commit(START_LOADING);
        axios.delete(`${this.$store.state.strapi}/plays/${id}`).then(() => {
          this.filter();
        });
      }
    },
    getPlayer(id) {
      const temp = this.$store.state.players.find(p => p.id == id);
      return temp ? temp : new Player();
    },
    getHero(id) {
      const temp = this.$store.state.heroes.find(p => p.id == id);
      return temp ? temp : new Hero();
    },
    resetForm() {
      this.playForm = new Play();
    }
  },
  watch: {
    fCant() {
      this.filter();
    },
    fPlayer() {
      this.filter();
    },
    playForm(val) {
      val.player_results.forEach(pr => {
        pr.win = val.side_win === pr.side;
      });
    }
  },
  mounted() {
    this.resetForm();
    this.filter();
  }
};
</script>

<style lang="scss" scoped>
@import "@/theme/theme.scss";

$width-hero: calc(calc(100vw / 10) - 5px);
$height-hero: $width-hero;

$width-hero-xs: calc(calc(100vw / 5) - 5px);
$height-hero-xs: $width-hero-xs;

.plays {
  display: flex;
  flex-direction: column;

  @import "@/components/PlayComponent.scss";
}

.filters {
  padding: 0 15px;
  display: flex;
  justify-content: space-between;

  .info-plays-win {
    color: map-get($map: $color, $key: win);
  }
}
</style>
