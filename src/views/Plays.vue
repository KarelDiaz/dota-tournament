<template>
  <div>
    <div class="options">
      <form @submit.prevent="send">
        <div class="plays">
          <div class="play">
            <span>Nuevo play</span>
            <div class="result-content">
              <div class="result" :class="pr.side" v-for="(pr, index) in prForm" :key="index">
                <span class="item-form">
                  <input v-model="pr.bot" type="checkbox" /> Bot
                </span>
                <select required class="item-form" v-model="pr.player" v-if="!pr.bot">
                  <option :value="p.id" v-for="p in players" :key="p.id">{{p.nick}}</option>
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
                <select class="item-form" v-model="pr.hero" required>
                  <option :value="h.id" v-for="h in heroes" :key="h.id">{{h.displayName}}</option>
                </select>
                <span class="item-form">
                  <input v-model="pr.win" v-if="!pr.bot" type="checkbox" /> Win
                </span>
                <div class="black-shadow" :class="pr.side + (pr.bot?' bot':'')"></div>

                <img
                  v-if="pr.bot"
                  class="hero-img"
                  :src="$store.state.strapi+getHero(pr.hero).picture.url"
                  :alt="getHero(pr.hero).picture.url"
                />
                <video
                  preload
                  autoplay
                  loop
                  v-if="!pr.bot"
                  class="hero-img"
                  :src="$store.state.strapi+getHero(pr.hero).video.url"
                  :alt="getHero(pr.hero).video.url"
                />
              </div>
            </div>
            <button type="submit" class="success">Guardar el play</button>
          </div>
        </div>
      </form>
    </div>

    <div class="plays">
      <div class="play" v-for="play in plays" :key="play.id">
        <span>
          {{play.created_at}}
          <button class="danger" @click="del(play.id)">Eliminar</button>
        </span>

        <div class="result-content">
          <div
            class="result"
            :class="result.side"
            v-for="result in play.player_results"
            :key="result.id"
          >
            <b class="item" v-if="!result.bot">{{getPlayer(result.player).nick}}</b>
            <span class="item elo" v-if="!result.bot">
              {{result.elo}}
              <b class="elo-plus" :class="result.win?'success':'danger'">
                <span v-if="result.win">+</span>
                <span v-if="!result.win">-</span>
                {{Math.abs(result.eloPlus)}}
              </b>
            </span>
            <b class="item" v-if="result.bot">Bot</b>
            <table class="item" v-if="!result.bot">
              <tr>
                <td>K</td>
                <td>D</td>
                <td>A</td>
              </tr>
              <tr>
                <td>
                  <b>{{result.kills}}</b>
                </td>
                <td>
                  <b>{{result.deths}}</b>
                </td>
                <td>
                  <b>{{result.asist}}</b>
                </td>
              </tr>
            </table>
            <span class="item">{{getHero(result.hero).displayName}}</span>
            <div class="black-shadow" :class="result.side + (result.bot?' bot':'')"></div>
            <img
              class="hero-img"
              :src="$store.state.strapi+getHero(result.hero).picture.url"
              :alt="getHero(result.hero).picture.url"
            />
            <video
              preload
              autoplay
              loop
              v-if="false"
              class="hero-img"
              :src="$store.state.strapi+getHero(result.hero).video.url"
              :alt="getHero(result.hero).video.url"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

import PlayerResult from "@/store/model/player_result.js";
import Hero from "@/store/model/hero.js";
import { START_LOADING, END_LOADING } from "@/store/mutations-type";
import Elo from "@/store/elo";
import Player from "@/store/model/player";

export default {
  name: "Plays",
  data() {
    return {
      plays: [],
      players: [],
      heroes: [],
      prForm: []
    };
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
      this.prForm.forEach(pr => {
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

      this.prForm.forEach(pr => {
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
                .post(this.$store.state.strapi + "/plays", {
                  player_results: out
                })
                .then(() => {
                  this.resetForm();
                  this.initPlayers();
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

      // update elo de los q ganana
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
            this.initPlayers();
            this.$store.commit(END_LOADING);
          });
      });
    },

    filter() {
      this.$store.commit(START_LOADING);
      axios.get(this.$store.state.strapi + "/plays").then(({ data }) => {
        this.plays = data.reverse(); //.slice(0, 10);
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

    initPlayers() {
      this.$store.commit(START_LOADING);
      axios.get(this.$store.state.strapi + "/players").then(({ data }) => {
        this.players = data.sort(
          (a, b) => a.fullName.toLowerCase() > b.fullName.toLowerCase()
        );
        this.$store.commit(END_LOADING);
      });
    },

    getPlayer(id) {
      return this.players.find(p => p.id == id);
    },

    initHeroes() {
      axios.get(this.$store.state.strapi + "/heroes").then(({ data }) => {
        this.heroes = data.sort(
          (a, b) => a.displayName.toLowerCase() > b.displayName.toLowerCase()
        );
      });
      for (let i = 101; i <= 118; i++) {
        this.$store.commit(START_LOADING);
        axios
          .get(this.$store.state.strapi + "/heroes/" + i)
          .then(({ data }) => {
            this.heroes.push(data);
            this.heroes = this.heroes.sort(
              (a, b) =>
                a.displayName.toLowerCase() > b.displayName.toLowerCase()
            );
            this.$store.commit(END_LOADING);
          });
      }
    },

    getHero(id) {
      if (this.heroes.length > 0) return this.heroes.find(h => h.id == id);
      else return new Hero();
    },

    resetForm() {
      for (let i = 0; i < 10; i++) {
        if (i < 5) {
          this.prForm[i] = new PlayerResult("good");
        } else {
          this.prForm[i] = new PlayerResult("bad");
        }
      }
    }
  },
  watch: {
    plays(val) {
      val.forEach(elem => {
        elem.created_at = moment(elem.created_at).format(
          "YYYY - M - D // H:mm"
        );
      });
    }
  },
  mounted() {
    this.initPlayers();
    this.initHeroes();
    this.resetForm();
    this.filter();
  }
};
</script>

<style lang="scss" scoped>
$width-hero: calc(calc(100vw / 10) - 5px);
$height-hero: $width-hero;

$width-hero-xs: calc(calc(100vw / 5) - 5px);
$height-hero-xs: $width-hero-xs;

.plays {
  display: flex;
  flex-direction: column;

  .play {
    display: flex;
    flex-direction: column;
    background-color: rgb(240, 240, 240);
    padding-top: 5px;
    margin-bottom: 1rem;

    .result-content {
      display: grid;
      grid-template-rows: auto;
      grid-template-columns: repeat(10, $width-hero);
      align-content: center;
      justify-content: center;
      padding-top: 5px;

      .result {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-content: space-between;
        text-align: left;
        width: $width-hero;
        height: $height-hero;
        font-size: smaller;

        @media screen and (max-width: 899px) {
          & {
            width: $width-hero-xs;
            height: $height-hero-xs;
            font-size: xx-small;
          }
        }

        .item {
          z-index: 2;
          color: white;
          padding: 0 5px;
          text-shadow: 0px 0px 3px black;
          width: calc($width-hero - 10);
          &.elo{
            .elo-plus{
              &.success{
                color: rgb(153, 255, 0);
              }
              &.danger{
                color: rgb(255, 51, 51);
              }
            }
          }
        }
        .item-form {
          z-index: 2;
          background-color: transparent;
          color: white;
          margin: 0 5px;
          width: calc(100% - 15px);
        }
        .kda {
          display: grid;
          grid-template-columns: repeat(3, calc(100% / 3));
        }
        .black-shadow {
          position: absolute;
          width: $width-hero;
          height: $height-hero;
          z-index: 1;
          background-color: transparent;
          border: none;

          @media screen and (max-width: 899px) {
            & {
              width: $width-hero-xs;
              height: $height-hero-xs;
            }
          }

          &.bot {
            background-color: rgba(0, 0, 0, 0.6);
          }
        }
        .hero-img {
          position: absolute;
          width: $width-hero;
          height: $height-hero;

          @media screen and (max-width: 899px) {
            & {
              width: $width-hero-xs;
              height: $height-hero-xs;
            }
          }
        }
      }

      @media screen and (max-width: 899px) {
        & {
          grid-template-columns: repeat(5, $width-hero-xs);
        }
      }
    }

    .good {
      border-top: 5px solid rgb(0, 255, 191);
    }

    .bad {
      border-top: 5px solid rgb(255, 81, 0);
    }
  }
}
</style>
