<template>
  <div class="nav">
    <router-link class="nav-link" to="/">Players</router-link>
    <router-link class="nav-link" to="/plays">Plays</router-link>
    <router-link class="nav-link" to="/hero">Heroes</router-link>
    <router-link class="nav-link" to="/lotery">Lotery</router-link>
    <router-link class="nav-link" to="/tournament">Tournament</router-link>
  </div>
</template>

<style lang="scss" scoped>
@import "@/theme/theme.scss";

.nav {
  padding: map-get($map: $spacings, $key: 3);
  display: flex;
  justify-content: right;
  flex-wrap: wrap;

  .nav-link {
    text-transform: uppercase;
    text-decoration: none;
    padding: 1px 5px;
    margin: 0 0 map-get($map: $spacings, $key: 3)
      map-get($map: $spacings, $key: 3);
    color: white;
    background-color: rgba(44, 167, 204, 0.5);
    border: 1px solid rgba(0, 217, 255, 0.5);

    &.router-link-exact-active {
      background-color: rgb(44, 167, 204);
      border: 1px solid rgb(0, 217, 255);
      color: white;
    }
  }
}
</style>
