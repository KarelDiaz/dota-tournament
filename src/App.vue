<template>
  <div>
    <LoadingComponent></LoadingComponent>
    <NavComponent></NavComponent>
    <router-view />
  </div>
</template>

<script>
import LoadingComponent from "@/components/LoadingComponent";
import NavComponent from "@/components/NavComponent";
import { INIT_PLAYERS, INIT_HEROES } from "@/store/mutations-type";

export default {
  components: {
    LoadingComponent,
    NavComponent
  },
  created() {
    this.$store.commit(INIT_PLAYERS);
    this.$store.commit(INIT_HEROES);
  }
};
</script>

<style lang="scss">
@import "@/theme/theme.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
/*
#nav {
  padding: 30px;

  .nav-separator {
    color: rgb(190, 230, 190);
    margin: 0 0.5rem;
  }

  a {
    text-transform: uppercase;
    text-decoration: none;
    background-color: rgb(230, 230, 230);
    border: 1px solid rgb(220, 220, 220);
    color: rgb(80, 120, 80);
    padding: 1px 5px;

    &.router-link-exact-active {
      background-color: rgb(190, 230, 190);
      border: 1px solid rgb(170, 210, 170);
    }
  }
}*/
</style>
