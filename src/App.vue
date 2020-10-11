<template>
  <div>
    <Loading></Loading>
    <Nav></Nav>
    <router-view />
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import Nav from "@/components/Nav";

export default {
  components: {
    Loading,
    Nav
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
