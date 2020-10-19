<template>
  <div>
    <div class="heroes-container">
      <input class="buscar" type="text" placeholder="Buscar" v-model="filterText" />

      <div class="heroes">
        <transition-group name="slide-fade">
          <template v-for="(h,i) in hs">
            <div
              :key="h.id"
              :class="['hero',{selected:hSelected==h}]"
              v-if="hsVisible[i]"
              @click="hSelected=h"
            >
              <img :src="$store.state.strapi+h.picture.url" class="img" />
              <span class="name hide-xs">
                <span>{{h.displayName}}</span>
                <b class="victorias">{{ prs.filter(pr=>(pr.hero.id==h.id)).length}}</b>
              </span>
            </div>
          </template>
        </transition-group>
      </div>
    </div>

    <div class="players-contianer">
      <transition name="fade-slide">
        <div class="hero-selected" v-if="hSelected">
          <img class="img" :src="$store.state.strapi+hSelected.picture.url" alt />
          <div>
            <span class="name">{{hSelected.displayName}}</span>
            <table class="table">
              <thead>
                <tr>
                  <th>P</th>
                  <th>V</th>
                  <th>Ave.</th>
                  <th>K</th>
                  <th>K/P</th>
                  <th>D</th>
                  <th>D/P</th>
                  <th>A</th>
                  <th>A/P</th>
                </tr>
              </thead>
              <tbody>
                <tr class="player">
                  <td>{{hP}}</td>
                  <td>{{hV}}</td>
                  <td>{{hAve}}</td>
                  <td>{{hK}}</td>
                  <td>{{hKP}}</td>
                  <td>{{hD}}</td>
                  <td>{{hDP}}</td>
                  <td>{{hA}}</td>
                  <td>{{hAP}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </transition>

      <div v-if="!hSelected">Seleccione un heroe para ver estadisticas</div>

      <table class="players" v-if="hSelected">
        <thead>
          <tr>
            <th>Nick</th>
            <th>P</th>
            <th>V</th>
            <th>Ave.</th>
            <th>K</th>
            <th>K/P</th>
            <th>D</th>
            <th>D/P</th>
            <th>A</th>
            <th>A/P</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="p in ps">
            <tr class="player" v-if="p.nick!='bot'" :key="p.id">
              <td>{{p.nick}}</td>
              <td>{{getP(p.id)}}</td>
              <td>{{getV(p.id)}}</td>
              <td>{{getAve(p.id)}}</td>
              <td>{{getK(p.id)}}</td>
              <td>{{getKP(p.id)}}</td>
              <td>{{getD(p.id)}}</td>
              <td>{{getDP(p.id)}}</td>
              <td>{{getA(p.id)}}</td>
              <td>{{getAP(p.id)}}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      ps: [],
      prs: [],
      hs: [],
      hsVisible: [],
      filterText: "",
      hSelected: null,
      hP: 0,
      hV: 0,
      hAve: 0,
      hK: 0,
      hKP: 0,
      hD: 0,
      hDP: 0,
      hA: 0,
      hAP: 0
    };
  },
  methods: {
    initPs() {
      axios
        .get(this.$store.state.strapi + "/players?_limit=-1")
        .then(({ data }) => (this.ps = data.sort((a, b) => a.nick > b.nick)));
    },
    initPrs() {
      axios
        .get(this.$store.state.strapi + "/player-results?_limit=-1")
        .then(({ data }) => (this.prs = data.filter(d => !d.bot)));
    },
    initHs() {
      axios
        .get(this.$store.state.strapi + "/heroes?_limit=-1")
        .then(({ data }) => {
          this.hsVisible = [];
          data.forEach(() => this.hsVisible.push(true));
          this.hs = data.sort((a, b) => a.displayName > b.displayName);
        });
    },
    getV(id) {
      return this.prs.filter(pr => {
        return pr.player.id == id && pr.hero.id == this.hSelected.id && pr.win;
      }).length;
    },
    getP(id) {
      return this.prs.filter(pr => {
        return pr.player.id == id && pr.hero.id == this.hSelected.id;
      }).length;
    },
    getAve(id) {
      let p = this.getP(id);
      if (p == 0) return 0;
      return Math.round((this.getV(id) / p) * 1000);
    },
    getK(id) {
      var out = 0;
      this.prs
        .filter(pr => {
          return pr.player.id == id && pr.hero.id == this.hSelected.id;
        })
        .forEach(pr => (out += pr.kills));
      return out;
    },
    getKP(id) {
      let p = this.getP(id);
      if (p == 0) return 0;
      return Math.round(this.getK(id) / p);
    },
    getD(id) {
      var out = 0;
      this.prs
        .filter(pr => {
          return pr.player.id == id && pr.hero.id == this.hSelected.id;
        })
        .forEach(pr => (out += pr.deths));
      return out;
    },
    getDP(id) {
      let p = this.getP(id);
      if (p == 0) return 0;
      return Math.round(this.getD(id) / p);
    },
    getA(id) {
      var out = 0;
      this.prs
        .filter(pr => {
          return pr.player.id == id && pr.hero.id == this.hSelected.id;
        })
        .forEach(pr => (out += pr.asist));
      return out;
    },
    getAP(id) {
      let p = this.getP(id);
      if (p == 0) return 0;
      return Math.round(this.getA(id) / p);
    }
  },
  created() {
    this.initPs();
    this.initPrs();
    this.initHs();
  },
  watch: {
    filterText(text) {
      this.hs.forEach((h, i) => {
        this.hsVisible[i] =
          h.displayName.toLowerCase().indexOf(text.toLowerCase()) >= 0;
        if (text == "") {
          this.hsVisible[i] = true;
        }
      });
    },
    hSelected(h) {
      this.hP = 0;
      this.hV = 0;
      this.hAve = 0;
      this.hK = 0;
      this.hKP = 0;
      this.hD = 0;
      this.hDP = 0;
      this.hA = 0;
      this.hAP = 0;

      this.prs
        .filter(pr => pr.hero.id == h.id)
        .forEach(pr => {
          this.hP++;
          this.hV += pr.win ? 1 : 0;
          this.hK += pr.kills;
          this.hD += pr.deths;
          this.hA += pr.asist;
        });
      this.hAve = this.hP > 0 ? Math.round((this.hV / this.hP) * 1000) : 0;
      this.hKP = this.hP > 0 ? Math.round(this.hK / this.hP) : 0;
      this.hDP = this.hP > 0 ? Math.round(this.hD / this.hP) : 0;
      this.hAP = this.hP > 0 ? Math.round(this.hA / this.hP) : 0;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/theme/theme.scss";

.heroes-container {
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  width: 20vw;
  height: 100vh;

  .heroes {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    height: 100%;

    .hero {
      display: flex;
      align-items: center;
      padding: 3px 0;
      cursor: pointer;

      &:hover {
        background-color: map-get($map: $bg, $key: 2);
      }

      &.selected {
        background: map-get($map: $bg, $key: 3);
      }

      .img {
        height: 25px;
        width: 25x;
        padding: 0 6px;
        border-radius: 50%;
      }
      .name {
        display: flex;
        width: 100%;
        justify-content: space-between;
        padding-right: 5px;

        .victorias {
          display: flex;
          //align-items: center;
          justify-content: center;
          background-color: rgba(255, 255, 255, 0.555);
          color: map-get($map: $bg, $key: 2);
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
        }
      }
    }
  }
}

.players-contianer {
  width: 80vw;
  transform: translateX(20vw);
  padding: 10px;
  overflow: auto;

  .hero-selected {
    display: flex;
    align-items: center;

    .img {
      height: 15vw;
      border-radius: 50%;
      padding: 10px;
    }

    .table{
      margin-top: 10px;
    }
  }

  .players {
    width: 100%;

    th {
      text-align: left;
    }

    .player {
      &:nth-of-type(odd) {
        background-color: map-get($map: $bg, $key: 2);
      }

      &:hover {
        background-color: map-get($map: $bg, $key: 3);
      }
    }
  }
}
</style>
