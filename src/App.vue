<template>
  <div>
    <NavComponent class="fixed top-0 z-10 w-full"></NavComponent>
    <router-view class="p-1 pt-20 sm:p-3 sm:pt-20" />
  </div>
</template>

<script>
import { mapActions } from "vuex";

import NavComponent from "@/components/NavComponent";
import { INIT } from "@/store/actions-type";

export default {
  components: {
    NavComponent,
  },
  methods: {
    ...mapActions([INIT]),
  },
  created() {
    this.init();
  },
};
</script>
  
<style lang="scss">
@import "@/theme/theme.scss";
#app {
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
