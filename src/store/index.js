import axios from "axios";
import { createStore } from "vuex";

import {
  START_LOADING,
  END_LOADING,
  INIT_PLAYERS,
  INIT_HEROES,
  INIT_TOURNAMENTS,
  INIT_TOURNAMENT_TYPE,
  SET_PLAYER_INFO,
  SET_RESULT_INFO,
  ADD_TOURNAMENT
} from "./mutations-type";
import { ALL } from './tournament-type'
import { INIT } from "./actions-type";
import Hero from './model/hero'
import TournamentType from './model/tournament_type'

export default createStore({
  state: {
    loading: false,
    strapi: `http://${window.location.hostname}:1337`,
    local: `http://${window.location.hostname}:8080`,
    github: {
      frontend: 'https://github.com/KarelDiaz/dota-tournament-frontend',
      backend: 'https://github.com/KarelDiaz/dota-tournament-backend'
    },
    players: [],
    heroes: [],
    playerInfo: {},
    playerInfoResults: [],
    playerInfoPlays: [],
    resultInfo: {},
    playInfo: {},
    tournaments: [],
    tournamentTypes: []
  },
  mutations: {
    [START_LOADING](state) {
      state.loading = true;
    },
    [END_LOADING](state) {
      state.loading = false;
    },
    [INIT_PLAYERS](state) {
      axios.get(state.strapi + "/player-results?_limit=-1").then(prs => {
        prs = prs.data;
        axios.get(state.strapi + "/players?_limit=-1").then(ps => {
          ps = ps.data;
          state.players = ps.sort((a, b) => b.nick.localeCompare(a.nick)
          );

          state.players.forEach(p => {
            const arr_prs = prs.filter(pr => {
              if (pr.player)
                return pr.player.id == p.id;
              return false;
            });
            p.p = arr_prs.length;
            p.v = arr_prs.filter(_p => _p.win).length;
            p.k = 0;
            p.d = 0;
            p.a = 0;
            arr_prs.forEach(_p => {
              p.k += _p.kills;
              p.d += _p.deths;
              p.a += _p.asist;
            });
          });
        });
      });
    },
    [INIT_HEROES](state) {
      axios.get(state.strapi + "/heroes?_limit=-1").then(({ data }) => {
        state.heroes = data.sort((a, b) => a.displayName.localeCompare(b.displayName));

        // load all heros from scratch if no exist on db
        if (this.state.heroes.length === 0) {
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
            new Hero("npc_dota_hero_pudge", "pudge"),
          ];
          var n = 0;
          heroes.forEach((h) => {
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
            axios.post(this.state.strapi + "/heroes", h).then(() => {
              n++;
              if (n == heroes.length) {
                axios.get(state.strapi + "/heroes?_limit=-1").then(({ data }) => {
                  state.heroes = data.sort((a, b) => a.displayName.localeCompare(b.displayName));
                });
              }
            });
          });
        }
      });
    },
    [INIT_TOURNAMENTS](state) {
      axios.get(state.strapi + "/tournaments?_limit=-1").then(({ data }) => {
        state.tournaments = data.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      });
    },
    [INIT_TOURNAMENT_TYPE](state) {
      axios.get(state.strapi + "/tournament-types").then(({ data }) => {
        state.tournamentTypes = data
        state.tournamentTypes.sort((a, b) => a.name.localeCompare(b.name))

        // in case of not have any type... add from scratch :)
        if (data.length === 0) {
          ALL.forEach(tt => {
            axios.post(state.strapi + "/tournament-types", new TournamentType(tt))
              .then(({ data }) => {
                state.tournamentTypes.push(data)
                state.tournamentTypes.sort((a, b) => a.name.localeCompare(b.name))
              });
          });
        }
      });
    },
    [SET_PLAYER_INFO](state, dataIn) {
      state.playerInfo = dataIn;
      state.resultInfo = {};
      state.playInfo = {};
      axios.get(state.strapi + "/player-results?_limit=-1").then(({ data }) => {
        state.playerInfoResults = data
          .filter((p) => {
            if (p.player) return p.player.id == state.playerInfo.id;
            return false;
          })
          .reverse();
      });
    },
    [SET_RESULT_INFO](state, dataIn) {
      state.resultInfo = dataIn;
      axios.get(state.strapi + "/plays?_limit=-1").then(({ data }) => {
        state.playInfo = data.find((p) =>
          p.player_results.find((pr) => pr.id == state.resultInfo.id)
        );
      });
    },
    [ADD_TOURNAMENT](state, dataIn) {
      state.tournaments.push(dataIn)
      state.tournaments.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    }
  },
  actions: {
    async [INIT]({ commit }) {
      await commit(INIT_HEROES);
      await commit(INIT_PLAYERS);
      await commit(INIT_TOURNAMENTS);
      await commit(INIT_TOURNAMENT_TYPE);
    }
  },
  modules: {}
});
