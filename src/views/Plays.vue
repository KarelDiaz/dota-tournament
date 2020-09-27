<template>
  <div>
    <div class="options">
      <form @submit.prevent="send">
        <div class="plays">
          <div class="play">
            <button type="submit" class="success">Agregar el play</button>
            <div class="result-content">
              <div class="result" :class="pr.side" v-for="pr in prForm" :key="pr.player">
                <span>
                  <input v-model="pr.bot" type="checkbox" /> Bot
                </span>
                <select v-model="pr.player" v-if="!pr.bot">
                  <option :value="p.id" v-for="p in players" :key="p.id">{{p.nick}}</option>
                </select>
                <input v-model="pr.kills" v-if="!pr.bot" type="text" placeholder="Kills" />
                <input v-model="pr.deths" v-if="!pr.bot" type="text" placeholder="Deths" />
                <input v-model="pr.asist" v-if="!pr.bot" type="text" placeholder="Asist" />
                <select v-model="pr.hero" required>
                  <option :value="h.id" v-for="h in heroes" :key="h.id">{{h.displayName}}</option>
                </select>
                <span>
                  <input v-model="pr.win" v-if="!pr.bot" type="checkbox" /> Win
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>

    <div class="plays">
      <div class="play" v-for="play in plays" :key="play.id">
        <span>{{play.created_at}}</span>

        <div class="result-content">
          <div
            class="result"
            :class="result.side"
            v-for="result in play.player_results"
            :key="result.id"
          >
            <span class="item" v-if="!result.bot">{{getPlayer(result.player).nick}}</span>
            <span class="item" v-if="result.bot">Bot</span>
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
              :src="'http://localhost:1337'+getHero(result.hero).picture.url"
              :alt="getHero(result.hero).picture.url"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dataurl from "@/store/dataurl";
import PlayerResult from "@/store/model/player_result.js";

export default {
  name: "Plays",
  data() {
    return {
      plays: [],
      players: [],
      heroes: [],
      prForm: [],
      ns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    };
  },
  methods: {
    send() {
      var out = [];
      this.prForm.forEach(pr => {
        fetch(dataurl + "/player-results", {
          method: "POST",
          body: JSON.stringify(pr),
          headers: {
            Accept: "application/json",
            "Content-type": "application/json"
          }
        })
          .then(res => res.json())
          .then(data => {
            out.push(data.id);
            if (out.length === 10) {
              fetch(dataurl + "/plays", {
                method: "POST",
                body: JSON.stringify({ player_results: out }),
                headers: {
                  Accept: "application/json",
                  "Content-type": "application/json"
                }
              })
                .then(res => res.json())
                .then(() => {
                  this.resetForm();
                  this.filter();
                });
            }
          });
      });
    },
    filter() {
      fetch(dataurl + "/plays")
        .then(res => res.json())
        .then(data => {
          this.plays = data.reverse().slice(0, 10);
          this.plays.forEach(play => {
            play.player_results = play.player_results.sort((a, b) => {
              if (a.side == b.side) {
                return a.bot;
              }
              return a.side < b.side;
            });
          });
        });
    },

    initPlayers() {
      fetch(dataurl + "/players")
        .then(res => res.json())
        .then(data => {
          this.players = data.sort(
            (a, b) => a.fullName.toLowerCase() > b.fullName.toLowerCase()
          );
        });
    },

    getPlayer(id) {
      return this.players.find(p => p.id == id);
    },

    initHeroes() {
      fetch(dataurl + "/heroes")
        .then(res => res.json())
        .then(data => {
          this.heroes = data.sort(
            (a, b) => a.displayName.toLowerCase() > b.displayName.toLowerCase()
          );
        });
    },

    getHero(id) {
      return this.heroes.find(h => h.id == id);
    },

    resetForm() {
      this.prForm = [
        new PlayerResult("good"),
        new PlayerResult("good"),
        new PlayerResult("good"),
        new PlayerResult("good"),
        new PlayerResult("good"),
        new PlayerResult("bad"),
        new PlayerResult("bad"),
        new PlayerResult("bad"),
        new PlayerResult("bad"),
        new PlayerResult("bad")
      ];
    }
  },
  created() {
    this.resetForm();
    this.initPlayers();
    this.initHeroes();
    this.filter();
  }
};
</script>

<style lang="scss" scoped>
.plays {
  display: flex;
  flex-direction: column;

  .play {
    display: flex;
    flex-direction: column;
    background-color: rgb(240, 240, 240);
    padding: 5px;
    margin-bottom: 1rem;

    .result-content {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      padding-top: 5px;

      .result {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-content: space-between;
        padding: 5px;
        text-align: left;
        width: calc(100vw / 12);
        height: 150px;
        font-size: smaller;

        .item {
          z-index: 2;
          color: white;
          padding: 0 5px;
          text-shadow: 0px 0px 3px black;
          width: calc(100vw / 12 - 10);
        }
        .black-shadow {
          position: absolute;
          width: calc(100vw / 12);
          height: 150px;
          z-index: 1;
          background-color: transparent;

          &.bot {
            background-color: rgba(0, 0, 0, 0.6);
          }
        }
        .hero-img {
          position: absolute;
          width: calc(100vw / 12);
          height: 150px;
          background-color: transparentize($color: #000000, $amount: 0);
        }
      }
    }

    .good {
      background-color: rgb(110, 255, 110);
    }

    .bad {
      background-color: rgb(255, 117, 117);
    }
  }
}
</style>
