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
      axios.get(state.strapi + "/players?_limit=-1").then(({ data }) => {
        state.players = data.sort((a, b) => a.nick > b.nick);
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
