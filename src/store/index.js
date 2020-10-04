import { createStore } from "vuex";

export default createStore({
  state: {
    loading: true,
  },
  mutations: {
    startLoading(state) {
      state.loading = true;
    },
    endLoading(state) {
      state.loading = false;
    }
  },
  actions: {},
  modules: {},
});
