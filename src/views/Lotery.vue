<template>
  <div class="players-container">
    <div class="players">
      <span class="top">Seleccione los players =></span>
      <transition-group name="slide-fade">
        <div class="player" v-for="p in ps1" :key="p.id" @click="from1To2(p)">
          <span class="name" v-html="p.nick"></span>
        </div>
      </transition-group>
    </div>
    <div class="players">
      <span class="top">
        Players
        <transition name="fade">
          <button v-if="ps2.length>0" class="success" @click="from2To3()">Seleccionar =></button>
        </transition>
      </span>
      <transition-group name="slide-fade-left">
        <div class="player" v-for="p in ps2" :key="p.id" @click="from2To1(p)">
          <span class="name" v-html="p.nick"></span>
        </div>
      </transition-group>
    </div>
    <div class="players">
      <span class="top">
        Seleccion aleatoria
        <button @click="reset()">Reset</button>
      </span>
      <transition-group name="slide-fade-left">
        <div class="player" v-for="(p,i) in ps3" :key="p.id">
          <span class="name" v-html="p.nick"></span>
          <b class="number" v-html="i+1"></b>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      ps1: [],
      ps2: [],
      ps3: []
    };
  },
  methods: {
    initPs() {
      axios
        .get(this.$store.state.strapi + "/players?_limit=-1")
        .then(({ data }) => {
          this.ps1 = data
            .filter(p => p.nick != "bot")
            .sort((a, b) => a.nick > b.nick);
        });
    },
    from1To2(p) {
      this.ps1 = this.ps1.filter(pp => pp != p);
      this.ps2.push(p);
      this.ps2.sort((a, b) => a.nick > b.nick);
    },
    from2To1(p) {
      this.ps2 = this.ps2.filter(pp => pp != p);
      this.ps1.push(p);
      this.ps1.sort((a, b) => a.nick > b.nick);
    },
    from2To3() {
      var pos = Math.floor(Math.random() * this.ps2.length);
      var p = this.ps2[pos];
      this.ps2 = this.ps2.filter(pp => pp != p);
      this.ps3.push(p);
    },
    reset() {
      this.ps1 = [];
      this.ps2 = [];
      this.ps3 = [];
      this.initPs();
    }
  },
  created() {
    this.initPs();
  }
};
</script>

<style lang="scss" scoped>
@import "@/theme/theme.scss";

.players-container {
  display: flex;
  flex-direction: row;

  .players {
    display: flex;
    flex-direction: column;
    width: 33vw;
    padding: 10px;

    &:nth-of-type(1) {
      background-color: map-get($map: $bg, $key: 1);
    }
    .top {
      padding-bottom: 10px;
    }
    .player {
      cursor: pointer;
      padding: 1px 10px;
      display: flex;
      justify-content: space-between;

      &:hover {
        background-color: map-get($map: $bg, $key: 3);
      }
    }
  }
}
</style>