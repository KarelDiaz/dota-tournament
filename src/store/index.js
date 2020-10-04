import { createStore } from "vuex";
import strapi from "./strapiurl";

export default createStore({
  state: {
    loading: false,
    strapi: strapi,
  },
  mutations: {
    startLoading(state) {
      state.loading = true;
    },
    endLoading(state) {
      state.loading = false;
    },
  },
  actions: {},
  modules: {},
});
