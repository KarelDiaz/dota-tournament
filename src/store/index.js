import axios from "axios";

import { createStore } from "vuex";
import {
  START_LOADING,
  END_LOADING,
  INIT_PLAYERS,
  INIT_HEROES,
} from "./mutations-type";

export default createStore({
  state: {
    loading: false,
    strapi: "http://localhost:1337",
    players: [],
    heroes: [],
  },
  mutations: {
    [START_LOADING](state) {
      state.loading = true;
    },
    [END_LOADING](state) {
      state.loading = false;
    },
    [INIT_PLAYERS](state) {
      axios.get(state.strapi + "/player-results?_limit=-1").then((prs) => {
        prs = prs.data;
        axios.get(state.strapi + "/players?_limit=-1").then((ps) => {
          ps = ps.data;
          state.players = ps.sort((a, b) => a.nick > b.nick);

          state.players.forEach((p) => {
            const arr_prs = prs.filter((pr) => pr.player.id == p.id);
            p.p = arr_prs.length;
            p.v = arr_prs.filter((_p) => _p.win).length;
            p.k = 0;
            p.d = 0;
            p.a = 0;
            arr_prs.forEach((_p) => {
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
        state.heroes = data.sort((a, b) => a.displayName > b.displayName);
      });
    },
  },
  actions: {},
  modules: {},
});
