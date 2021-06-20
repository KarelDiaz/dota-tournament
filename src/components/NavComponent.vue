<template>
  <div class="nav">
    <router-link class="nav-link" to="/">Players</router-link>
    <span class="nav-separator">|</span>
    <router-link class="nav-link" to="/plays">Plays</router-link>
    <span class="nav-separator">|</span>
    <router-link class="nav-link" to="/hero">Heroes</router-link>
    <span class="nav-separator">|</span>
    <router-link class="nav-link" to="/lotery">Lotery</router-link>
    <span class="nav-separator">|</span>
    <router-link class="nav-link" to="/tournament">Tournament</router-link>
    <span class="nav-separator">|</span>
    <router-link class="nav-link" to="/tournament-explore">T Explore</router-link>
  </div>
</template>

<style lang="scss" scoped>
@import "@/theme/theme.scss";

.nav {
  padding: 10px 0;
  display: flex;

  justify-content: center;
  .nav-separator {
    color: rgb(190, 224, 230);
    margin: 0 0.5rem;
  }
  .nav-link {
    text-transform: uppercase;
    text-decoration: none;
    padding: 1px 5px;
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
