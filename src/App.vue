<template>
  <div>
    <nav-component class="w-full"></nav-component>
    <router-view class="fixed bottom-0 left-0 right-0 p-1 overflow-y-auto sm:p-3 top-14" />
  </div>
</template>

<script>
import { mapActions } from "vuex";

import NavComponent from "@/components/NavComponent";
import { INIT } from "@/store/actions-type";

export default {
  components: {
    NavComponent
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
