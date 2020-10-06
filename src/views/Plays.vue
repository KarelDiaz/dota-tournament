<template>
  <div>
    <div class="options">
      <form @submit.prevent="send">
        <div class="plays">
          <div class="play">
            <div class="play-options">
              <label :class="['side-win',{wining:playForm.side_win=='good'}]">
                <input v-model="playForm.side_win" type="radio" name="radio" value="good" />
                Good ganó
              </label>
              <div>
                <button type="submit" class="success">Guardar el play</button>
              </div>
              <label :class="['side-win',{wining:playForm.side_win=='bad'}]">
                <input v-model="playForm.side_win" type="radio" name="radio" value="bad" />
                Bad ganó
              </label>
            </div>
            <transition name="fade" appear>
              <div class="result-content">
                <div
                  class="result"
                  :class="pr.side"
                  v-for="(pr, index) in playForm.player_results"
                  :key="index"
                >
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
            </transition>
          </div>
        </div>
      </form>
    </div>

    <div class="plays">
      <transition-group name="slide-fade" tag="p">
        <div class="play" v-for="play in plays" :key="play.id">
          <transition name="fade" appear>
            <div>
              <span class="play-date">
                {{play.created_at}}
                <button class="danger" @click="del(play.id)">Eliminar</button>
              </span>
            </div>
          </transition>

          <div class="result-content">
            <div
              :class="['result','result-list', result.side, {win:play.side_win==result.side},{bot:result.bot==true}]"
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
              <div class="player-img">
                <img
                  :class="['player-img-item',result.side]"
                  :src="$store.state.strapi+getPlayer(result.player).picture.url"
                  v-if="!result.bot && getPlayer(result.player).picture"
                />
              </div>
              <img
                class="hero-img"
                :src="$store.state.strapi+getHero(result.hero).picture.url"
                :alt="getHero(result.hero).picture.url"
              />
              <video
                preload
                autoplay
                loop
                v-if="!result.bot"
                class="hero-img hero-video"
                :src="$store.state.strapi+getHero(result.hero).video.url"
                :alt="getHero(result.hero).video.url"
              />
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

import Hero from "@/store/model/hero.js";
import { START_LOADING, END_LOADING } from "@/store/mutations-type";
import Elo from "@/store/elo";
import Player from "@/store/model/player";
import Play from "@/store/model/play";

export default {
  name: "Plays",
  data() {
    return {
      plays: [],
      players: [],
      heroes: [],
      playForm: Play
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
      this.playForm = new Play();
    }
  },
  watch: {
    plays(val) {
      val.forEach(elem => {
        elem.created_at = moment(elem.created_at).format(
          "YYYY - M - D // H:mm"
        );
      });
    },
    playForm(val) {
      val.player_results.forEach(pr => {
        pr.win = val.side_win === pr.side;
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
@import "@/theme/theme.scss";

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
    margin-bottom: 1.5rem;

    .play-date {
      background-color: map-get($map: $grey, $key: 400);
      padding: 10px 30px 17px 30px;
      clip-path: polygon(10% 0, 0 100%, 100% 100%, 90% 0);
    }

    .play-options {
      display: flex;
      justify-content: space-between;
      padding: 0 10%;

      .side-win {
        background-color: map-get($map: $grey, $key: 500);
        border: 1px solid map-get($map: $grey, $key: 600);
        padding: 1px 5px;
        font-size: smaller;

        &.wining {
          background-color: map-get($map: $color, $key: win);
          border: 1px solid map-get($map: $color, $key: win-line);
        }
      }
    }

    .result-content {
      display: grid;
      grid-template-rows: auto;
      grid-template-columns: repeat(10, $width-hero);
      align-content: center;
      justify-content: center;
      margin-top: 15px;

      .result {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-content: space-between;
        text-align: left;
        width: $width-hero;
        height: $height-hero;

        &.result-list:hover {
          .player-img-item {
            transform: scale(2);
          }
          .hero-img {
            display: none;
          }
          .hero-video {
            display: initial;
          }
        }
        &.result-list.bot {
          .hero-img {
            display: initial;
          }
        }

        @media screen and (max-width: 899px) {
          & {
            width: $width-hero-xs;
            height: $height-hero-xs;
          }
        }

        .hero-video {
          display: none;
        }
        .item {
          z-index: 2;
          color: white;
          padding: 0 5px;
          text-shadow: 0px 0px 3px black;
          width: calc($width-hero - 10);
          &.elo {
            .elo-plus {
              &.success {
                color: map-get($map: $color, $key: good-plus);
              }
              &.danger {
                color: map-get($map: $color, $key: bad-plus);
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
        .player-img {
          display: flex;
          justify-content: center;
          align-content: flex-end;
          z-index: 1;
          position: absolute;
          width: $width-hero;
          height: $height-hero;
          transform: translateY(-15px);

          @media screen and (max-width: 899px) {
            & {
              width: $width-hero-xs;
              height: $height-hero-xs;
            }
          }

          &-item {
            border-radius: 50%;
            height: 25px;
            width: 25px;
            transition: 0.15s;

            &.good {
              box-shadow: 0px 0px 5px map-get($map: $color, $key: good);
            }
            &.bad {
              box-shadow: 0px 0px 5px map-get($map: $color, $key: bad);
            }
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

        &.good {
          border-top: 5px solid map-get($map: $color, $key: good);
        }

        &.bad {
          border-top: 5px solid map-get($map: $color, $key: bad);
        }

        border-bottom: 5px solid map-get($map: $grey, $key: 500);
        &.win {
          border-bottom: 5px solid map-get($map: $color, $key: win);
        }
      }

      @media screen and (max-width: 899px) {
        & {
          grid-template-columns: repeat(5, $width-hero-xs);
        }
      }
    }
  }
}
</style>
