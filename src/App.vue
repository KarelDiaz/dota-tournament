<template>
  <div>
    <LoadingComponent></LoadingComponent>
    <NavComponent></NavComponent>
    <router-view />
  </div>
</template>

<script>
import { mapMutations, mapActions } from "vuex";

import LoadingComponent from "@/components/LoadingComponent";
import NavComponent from "@/components/NavComponent";
import { INIT } from "@/store/actions-type";
import { START_LOADING, END_LOADING } from "@/store/mutations-type";

export default {
  components: {
    LoadingComponent,
    NavComponent,
  },
  methods: {
    ...mapMutations([START_LOADING, END_LOADING]),
    ...mapActions([INIT]),
  },
  created() {
    this.startLoading();
    this.init();
    this.endLoading();
  },
};
</script>

<style lang="scss">
@import "@/theme/theme.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
