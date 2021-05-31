<template>
  <div>
    <div class="heroes-container">
      <div>
        <input
          class="buscar"
          type="text"
          placeholder="Buscar"
          v-model="filterText"
        />
        <button v-if="true" @click="resetHeroes()">Reset</button>
      </div>

      <div class="heroes">
        <transition-group name="slide-right">
          <template v-for="(h, i) in heroes">
            <div
              :key="h.id"
              :class="['hero', { selected: hSelected == h }]"
              v-if="hsVisible[i]"
              @click="hSelected = h"
            >
              <img :src="'npc/' + h.name + '.png'" class="img" />
              <span class="name hide-xs">
                <span>{{ h.displayName }}</span>
                <b class="victorias">{{
                  prs.filter(pr => pr.hero.id == h.id).length
                }}</b>
              </span>
            </div>
          </template>
        </transition-group>
      </div>
    </div>

    <div class="players-contianer">
      <transition name="fade-slide">
        <div class="hero-selected" v-if="hSelected">
          <img class="img" :src="'./npc/' + hSelected.name + '.png'" alt />
          <div>
            <span class="name">{{ hSelected.displayName }}</span>
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
            <tr class="player" v-if="p.nick != 'bot'" :key="p.id">
              <td>{{ p.nick }}</td>
              <td>{{ getP(p.id) }}</td>
              <td>{{ getV(p.id) }}</td>
              <td>{{ getAve(p.id) }}</td>
              <td>{{ getK(p.id) }}</td>
              <td>{{ getKP(p.id) }}</td>
              <td>{{ getD(p.id) }}</td>
              <td>{{ getDP(p.id) }}</td>
              <td>{{ getA(p.id) }}</td>
              <td>{{ getAP(p.id) }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapMutations } from "vuex";

import {
  START_LOADING,
  END_LOADING,
  INIT_HEROES
} from "@/store/mutations-type";
import Hero from "@/store/model/hero";

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
      hAP: 0
    };
  },
  computed: {
    ...mapState({
      strapi: state => state.strapi,
      heroes: state => state.heroes
    })
  },
  methods: {
    ...mapMutations([START_LOADING, END_LOADING, INIT_HEROES]),
    resetHeroes() {
      this.startLoading();
      var heroes = [
        new Hero("npc_dota_hero_antimage", "Antimage"),
        new Hero("npc_dota_hero_axe", "Axe"),
        new Hero("npc_dota_hero_bane", "Bane"),
        new Hero("npc_dota_hero_bloodseeker", "Bloodseeker"),
        new Hero("npc_dota_hero_crystal_maiden", "Crystal Maiden"),
        new Hero("npc_dota_hero_drow_ranger", "Drow Ranger"),
        new Hero("npc_dota_hero_earthshaker", "Earthshaker"),
        new Hero("npc_dota_hero_juggernaut", "Juggernaut"),
        new Hero("npc_dota_hero_mirana", "Mirana"),
        new Hero("npc_dota_hero_nevermore", "Shadow Fiend"),
        new Hero("npc_dota_hero_morphling", "Morphling"),
        new Hero("npc_dota_hero_phantom_lancer", "Phantom Lancer"),
        new Hero("npc_dota_hero_puck", "Puck"),
        new Hero("npc_dota_hero_razor", "Razor"),
        new Hero("npc_dota_hero_sand_king", "Sand King"),
        new Hero("npc_dota_hero_storm_spirit", "Storm Spirit"),
        new Hero("npc_dota_hero_sven", "Sven"),
        new Hero("npc_dota_hero_tiny", "Tiny"),
        new Hero("npc_dota_hero_vengefulspirit", "Vengeful Spirit"),
        new Hero("npc_dota_hero_windrunner", "Windrunner"),
        new Hero("npc_dota_hero_zuus", "Zeus"),
        new Hero("npc_dota_hero_kunkka", "Kunkka"),
        new Hero("npc_dota_hero_lina", "Lina"),
        new Hero("npc_dota_hero_lich", "Lich"),
        new Hero("npc_dota_hero_lion", "Lion"),
        new Hero("npc_dota_hero_shadow_shaman", "Shadow Shaman"),
        new Hero("npc_dota_hero_slardar", "Slardar"),
        new Hero("npc_dota_hero_tidehunter", "tidehunter"),
        new Hero("npc_dota_hero_witch_doctor", "witch doctor"),
        new Hero("npc_dota_hero_riki", "riki"),
        new Hero("npc_dota_hero_enigma", "enigma"),
        new Hero("npc_dota_hero_tinker", "tinker"),
        new Hero("npc_dota_hero_sniper", "sniper"),
        new Hero("npc_dota_hero_necrolyte", "necrolyte"),
        new Hero("npc_dota_hero_warlock", "warlock"),
        new Hero("npc_dota_hero_beastmaster", "beastmaster"),
        new Hero("npc_dota_hero_queenofpain", "queen of pain"),
        new Hero("npc_dota_hero_venomancer", "venomancer"),
        new Hero("npc_dota_hero_faceless_void", "faceless_void"),
        new Hero("npc_dota_hero_skeleton_king", "wraith king"),
        new Hero("npc_dota_hero_arc_warden", "arc_warden"),
        new Hero("npc_dota_hero_earth_spirit", "earth_spirit"),
        new Hero("npc_dota_hero_death_prophet", "death_prophet"),
        new Hero("npc_dota_hero_phantom_assassin", "phantom_assassin"),
        new Hero("npc_dota_hero_pugna", "pugna"),
        new Hero("npc_dota_hero_templar_assassin", "templar_assassin"),
        new Hero("npc_dota_hero_viper", "viper"),
        new Hero("npc_dota_hero_luna", "luna"),
        new Hero("npc_dota_hero_dragon_knight", "dragon_knight"),
        new Hero("npc_dota_hero_dazzle", "dazzle"),
        new Hero("npc_dota_hero_rattletrap", "Clockwerk"),
        new Hero("npc_dota_hero_leshrac", "leshrac"),
        new Hero("npc_dota_hero_furion", "Nature's Prophet"),
        new Hero("npc_dota_hero_life_stealer", "life stealer"),
        new Hero("npc_dota_hero_dark_seer", "dark seer"),
        new Hero("npc_dota_hero_clinkz", "clinkz"),
        new Hero("npc_dota_hero_omniknight", "omniknight"),
        new Hero("npc_dota_hero_enchantress", "enchantress"),
        new Hero("npc_dota_hero_huskar", "huskar"),
        new Hero("npc_dota_hero_night_stalker", "night_stalker"),
        new Hero("npc_dota_hero_broodmother", "broodmother"),
        new Hero("npc_dota_hero_bounty_hunter", "bounty_hunter"),
        new Hero("npc_dota_hero_weaver", "weaver"),
        new Hero("npc_dota_hero_jakiro", "jakiro"),
        new Hero("npc_dota_hero_batrider", "batrider"),
        new Hero("npc_dota_hero_chen", "chen"),
        new Hero("npc_dota_hero_spectre", "spectre"),
        new Hero("npc_dota_hero_doom_bringer", "doom_bringer"),
        new Hero("npc_dota_hero_ancient_apparition", "ancient_apparition"),
        new Hero("npc_dota_hero_ursa", "ursa"),
        new Hero("npc_dota_hero_spirit_breaker", "spirit_breaker"),
        new Hero("npc_dota_hero_gyrocopter", "gyrocopter"),
        new Hero("npc_dota_hero_alchemist", "alchemist"),
        new Hero("npc_dota_hero_invoker", "invoker"),
        new Hero("npc_dota_hero_silencer", "silencer"),
        new Hero("npc_dota_hero_obsidian_destroyer", "obsidian_destroyer"),
        new Hero("npc_dota_hero_lycan", "lycan"),
        new Hero("npc_dota_hero_brewmaster", "brewmaster"),
        new Hero("npc_dota_hero_shadow_demon", "shadow_demon"),
        new Hero("npc_dota_hero_lone_druid", "lone_druid"),
        new Hero("npc_dota_hero_chaos_knight", "chaos_knight"),
        new Hero("npc_dota_hero_meepo", "meepo"),
        new Hero("npc_dota_hero_treant", "treant"),
        new Hero("npc_dota_hero_ogre_magi", "ogre_magi"),
        new Hero("npc_dota_hero_undying", "undying"),
        new Hero("npc_dota_hero_rubick", "rubick"),
        new Hero("npc_dota_hero_disruptor", "disruptor"),
        new Hero("npc_dota_hero_nyx_assassin", "nyx_assassin"),
        new Hero("npc_dota_hero_naga_siren", "naga_siren"),
        new Hero("npc_dota_hero_keeper_of_the_light", "keeper_of_the_light"),
        new Hero("npc_dota_hero_wisp", "IO"),
        new Hero("npc_dota_hero_visage", "visage"),
        new Hero("npc_dota_hero_slark", "slark"),
        new Hero("npc_dota_hero_medusa", "medusa"),
        new Hero("npc_dota_hero_troll_warlord", "troll_warlord"),
        new Hero("npc_dota_hero_centaur", "centaur"),
        new Hero("npc_dota_hero_magnataur", "magnataur"),
        new Hero("npc_dota_hero_shredder", "timbersaw"),
        new Hero("npc_dota_hero_bristleback", "bristleback"),
        new Hero("npc_dota_hero_tusk", "tusk"),
        new Hero("npc_dota_hero_skywrath_mage", "skywrath_mage"),
        new Hero("npc_dota_hero_abaddon", "abaddon"),
        new Hero("npc_dota_hero_elder_titan", "elder_titan"),
        new Hero("npc_dota_hero_legion_commander", "legion_commander"),
        new Hero("npc_dota_hero_ember_spirit", "ember_spirit"),
        new Hero("npc_dota_hero_terrorblade", "terrorblade"),
        new Hero("npc_dota_hero_phoenix", "phoenix"),
        new Hero("npc_dota_hero_oracle", "oracle"),
        new Hero("npc_dota_hero_techies", "techies"),
        new Hero("npc_dota_hero_winter_wyvern", "winter_wyvern"),
        new Hero("npc_dota_hero_abyssal_underlord", "Underlord"),
        new Hero("npc_dota_hero_monkey_king", "monkey_king"),
        new Hero("npc_dota_hero_pangolier", "Pangolier"),
        new Hero("npc_dota_hero_dark_willow", "Dark Willow"),
        new Hero("npc_dota_hero_grimstroke", "Grimstroke"),
        new Hero("npc_dota_hero_mars", "Mars"),
        new Hero("npc_dota_hero_void_spirit", "void_spirit"),
        new Hero("npc_dota_hero_snapfire", "snapfire"),
        new Hero("npc_dota_hero_pudge", "pudge")
      ];
      var n = 0;
      heroes.forEach(h => {
        while (h.displayName.indexOf("_") >= 0)
          h.displayName = h.displayName.replace("_", " ");

        var arr_str = h.displayName.split(" ");
        var str = "";
        for (let i = 0; i < arr_str.length; i++) {
          str +=
            arr_str[i].substring(0, 1).toUpperCase() +
            arr_str[i].substring(1) +
            " ";
        }
        h.displayName = str;
        axios.post(this.strapi + "/heroes", h).then(() => {
          n++;
          if (n == heroes.length) {
            this.initHeroes();
            this.endLoading();
          }
        });
      });
    },
    initPs() {
      axios
        .get(this.strapi + "/players?_limit=-1")
        .then(({ data }) => (this.ps = data.sort((a, b) => a.nick > b.nick)));
    },
    initPrs() {
      axios
        .get(this.strapi + "/player-results?_limit=-1")
        .then(({ data }) => (this.prs = data.filter(d => !d.bot)));
    },
    initHs() {
      this.hsVisible = new Array(1000);
      this.hsVisible.fill(true);
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
    overflow-x: hidden;
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
          padding: 1px;
          display: flex;
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
      margin: 10px;
      box-shadow: 0px 0px 15px black;
    }

    .table {
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
