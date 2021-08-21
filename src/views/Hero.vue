<template>
  <div class="flex justify-end p-2 sm:p-3">
    <!-- Hores list -->
    <div class="sticky top-0 w-1/4">
      <div
        class="flex flex-col h-full overflow-hidden border rounded-lg shadow-lg bg-gradient-to-t from-gray-100 to-gray-50 mt-50"
      >
        <input
          class="sticky top-0 px-2 py-1 border-b border-gray-300 shadow-lg bg-gradient-to-b from-gray-50 to-gray-200 focus:border-blue-300"
          type="search"
          placeholder="Buscar"
          v-model="filterText"
        />

        <div
          class="flex flex-col p-2 space-y-2 overflow-auto sm:p-3 sm:space-y-3"
        >
          <transition-group name="slide-right">
            <template v-for="(h, i) in heroes">
              <div
                :key="h.id"
                :class="[
                  'flex w-full sm:space-x-3 items-center sm:p-3 bg-gradient-to-t from-gray-50 to-white rounded-lg border shadow-lg cursor-pointer hover:from-gray-200 hover:to-gry-100',
                  {
                    'from-blue-200 to-blue-50 border-blue-200': hSelected == h,
                  },
                ]"
                v-if="hsVisible[i]"
                @click="hSelected = h"
              >
                <img
                  :src="'npc/' + h.name + '.png'"
                  :class="[
                    'transform transition-all rounded-lg sm:w-10 sm:rounded-full',
                    { 'scale-75 sm:scale-100 shadow-md': hSelected == h },
                  ]"
                />
                <span class="hidden truncate sm:flex">{{ h.displayName }}</span>
              </div>
            </template>
          </transition-group>
        </div>
      </div>
    </div>
    <!-- Hero and all users onfo -->
    <div class="w-3/4 pl-3 text-center sm:text-left">
      <div v-if="!hSelected" class="p-10 italic text-gray-400">
        Seleccione un heroe para ver estadisticas
      </div>
      <!--Hero info-->
      <div class="flex flex-col mb-3 sm:flex-row" v-if="hSelected">
        <img
          class="rounded-lg shadow-lg sm:rounded-full"
          :src="'./npc/' + hSelected.name + '.png'"
          alt
        />
        <div class="w-full my-auto sm:pl-3">
          <span class="text-2xl font-extrabold">
            {{ hSelected.displayName }}
          </span>
          <table class="w-full mt-3 text-left">
            <thead>
              <tr>
                <th>P</th>
                <th>V</th>
                <th>AVE</th>
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
                <td>{{ hP }}</td>
                <td>{{ hV }}</td>
                <td>{{ hAve }}</td>
                <td>{{ hK }}</td>
                <td>{{ hKP }}</td>
                <td>{{ hD }}</td>
                <td>{{ hDP }}</td>
                <td>{{ hA }}</td>
                <td>{{ hAP }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!--All users info-->
      <div class="flex">
        <table class="w-full text-left" v-if="hSelected">
          <thead>
            <tr>
              <th>Nick</th>
              <th>P</th>
              <th>V</th>
              <th>AVE</th>
              <th>K</th>
              <th class="hidden sm:flex">K/P</th>
              <th>D</th>
              <th class="hidden sm:flex">D/P</th>
              <th>A</th>
              <th class="hidden sm:flex">A/P</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="p in ps">
              <tr class="player" v-if="p.nick != 'bot'" :key="p.id">
                <td>{{ p.nick }}</td>
                <td>{{ getP(p.id) }}</td>
                <td>{{ getV(p.id) }}</td>
                <td>{{ getAve(p.id) }}</td>
                <td>{{ getK(p.id) }}</td>
                <td class="hidden sm:flex">{{ getKP(p.id) }}</td>
                <td>{{ getD(p.id) }}</td>
                <td class="hidden sm:flex">{{ getDP(p.id) }}</td>
                <td>{{ getA(p.id) }}</td>
                <td class="hidden sm:flex">{{ getAP(p.id) }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  data() {
    return {
      ps: [],
      prs: [],
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
      hAP: 0,
    };
  },
  computed: {
    ...mapState({
      strapi: (state) => state.strapi,
      heroes: (state) => state.heroes,
    }),
  },
  methods: {
    initPs() {
      axios
        .get(this.strapi + "/players?_limit=-1")
        .then(
          ({ data }) =>
            (this.ps = data.sort((a, b) => a.nick.localeCompare(b.nick)))
        );
    },
    initPrs() {
      axios
        .get(this.strapi + "/player-results?_limit=-1")
        .then(({ data }) => (this.prs = data.filter((d) => !d.bot)));
    },
    initHs() {
      this.hsVisible = new Array(1000);
      this.hsVisible.fill(true);
    },
    getV(id) {
      return this.prs.filter((pr) => {
        return pr.player.id == id && pr.hero.id == this.hSelected.id && pr.win;
      }).length;
    },
    getP(id) {
      return this.prs.filter((pr) => {
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
        .filter((pr) => {
          return pr.player.id == id && pr.hero.id == this.hSelected.id;
        })
        .forEach((pr) => (out += pr.kills));
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
        .filter((pr) => {
          return pr.player.id == id && pr.hero.id == this.hSelected.id;
        })
        .forEach((pr) => (out += pr.deths));
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
        .filter((pr) => {
          return pr.player.id == id && pr.hero.id == this.hSelected.id;
        })
        .forEach((pr) => (out += pr.asist));
      return out;
    },
    getAP(id) {
      let p = this.getP(id);
      if (p == 0) return 0;
      return Math.round(this.getA(id) / p);
    },
  },
  created() {
    this.initPs();
    this.initPrs();
    this.initHs();
  },
  watch: {
    filterText(text) {
      this.heroes.forEach((h, i) => {
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
        .filter((pr) => pr.hero.id == h.id)
        .forEach((pr) => {
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
    },
  },
};
</script>
