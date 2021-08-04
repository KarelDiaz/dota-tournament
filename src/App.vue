<template>
  <div>
    <NavComponent class="fixed top-0 w-full z-10"></NavComponent>
    <router-view class="p-3 pt-20" />
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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
