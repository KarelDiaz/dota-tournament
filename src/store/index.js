import axios from "axios";

import { createStore } from "vuex";
import { START_LOADING, END_LOADING, INIT_PLAYERS } from "./mutations-type";

export default createStore({
  state: {
    loading: false,
    strapi: "http://localhost:1337",
    players: [],
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
        state.players = data;
      });
    },
  },
  actions: {},
  modules: {},
});
