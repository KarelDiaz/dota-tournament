<template>
  <div class="nav">
    <router-link class="nav-link" to="/">Players</router-link>
    <span class="nav-separator">|</span>
    <router-link class="nav-link" to="/plays">Plays</router-link>
    <span class="nav-separator">|</span>
    <router-link class="nav-link" to="/hero">Heroes</router-link>
  </div>
</template>

<style lang="scss" scoped>
@import "@/theme/theme.scss";

.nav {
  padding: 10px 0;
  display: flex;

  justify-content: center;
  .nav-separator {
    color: rgb(190, 230, 190);
    margin: 0 0.5rem;
  }
  .nav-link {
    text-transform: uppercase;
    text-decoration: none;
    padding: 1px 5px;

    &.router-link-exact-active {
      background-color: map-get($map: $bg, $key: 2);
      border: 1px solid rgb(170, 210, 170);
    }
  }
}
</style>
