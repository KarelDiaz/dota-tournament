<template>
  <div class="play">
    <div class="result-content">
      <div
        :class="[
          'result',
          'result-list',
          result.side,
          { win: play.side_win == result.side },
          { bot: result.bot == true }
        ]"
        v-for="result in play.player_results"
        :key="result.id"
      >
        <b class="item" v-if="!result.bot">{{ getPlayer(result.player).nick }}</b>
        <span class="item elo" v-if="!result.bot">
          {{ result.elo }}
          <b class="elo-plus" :class="result.win ? 'success' : 'danger'">
            <span v-if="result.win">+</span>
            <span v-if="!result.win">-</span>
            {{ Math.abs(result.eloPlus) }}
          </b>
        </span>
        <table class="item" v-if="!result.bot">
          <tr>
            <td>K</td>
            <td>D</td>
            <td>A</td>
          </tr>
          <tr>
            <td>
              <b>{{ result.kills }}</b>
            </td>
            <td>
              <b>{{ result.deths }}</b>
            </td>
            <td>
              <b>{{ result.asist }}</b>
            </td>
          </tr>
        </table>

        <span class="item" v-if="!result.bot">{{ getHero(result.hero).displayName }}</span>
        <div class="black-shadow" :class="result.side + (result.bot ? ' bot' : '')"></div>
        <div class="player-img">
          <img
            :class="['player-img-item', result.side]"
            :src="$store.state.strapi + getPlayer(result.player).picture.url"
            v-if="!result.bot && getPlayer(result.player).picture"
          />
        </div>
        <img
          class="hero-img"
          :src="
            !result.bot
              ? $store.state.strapi + getHero(result.hero).picture.url
              : $store.state.strapi + '/uploads/bot_0db0ba3b71.png'
          "
          :alt="getHero(result.hero).picture.url"
        />
      </div>
    </div>

    <div class="play-date">
      <span class="play-date-content">
        {{ play.createdAt }}
        <button v-if="false" class="danger" @click="del(play.id)">
          <i class="fa fa-trash"></i>
        </button>
      </span>
    </div>
  </div>
</template>

<script>
import Player from "@/store/model/player";
import Hero from "@/store/model/hero";

export default {
  name: "PlayComponent",
  props: {
    play: {}
  },
  methods: {
    getPlayer(id) {
      const temp = this.$store.state.players.find(p => p.id == id);
      return temp ? temp : new Player();
    },
    getHero(id) {
      const temp = this.$store.state.heroes.find(p => p.id == id);
      return temp ? temp : new Hero();
    }
  },
  watch: {
    play(val) {
      console.log(val);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./PlayComponent.scss";
</style>
