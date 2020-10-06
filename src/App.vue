<template>
  <div>
    <Loading></Loading>
    <div id="nav">
      <router-link to="/">Players</router-link>
      <span class="nav-separator">|</span>
      <router-link to="/plays">Plays</router-link>
      <span class="nav-separator">|</span>
      <router-link to="/demo">Demo</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
import Loading from "@/components/Loading";

export default {
  components: {
    Loading
  }
};
</script>

<style lang="scss">
@import "@/theme/theme.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

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
}
</style>
