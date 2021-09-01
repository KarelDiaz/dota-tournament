<template>
  <div>
    <nav-component class="w-full"></nav-component>
    <router-view
      id="view"
      class="fixed bottom-0 left-0 right-0 overflow-y-auto top-10"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";

import { INIT } from "@/store/type/actions";

import NavComponent from "@/components/NavComponent";

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
#view {
  @apply bg-cover bg-center bg-no-repeat;
  background-image: url("/background.jpg");
}
</style>
