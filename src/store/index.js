import { createStore } from "vuex";
import strapi from "./strapiurl";
import { START_LOADING, END_LOADING } from "./mutations-type";

export default createStore({
  state: {
    loading: false,
    strapi: strapi,
  },
  mutations: {
    [START_LOADING](state) {
      state.loading = true;
    },
    [END_LOADING](state) {
      state.loading = false;
    },
  },
  actions: {},
  modules: {},
});
