<template>
  <div class="nav">
    <router-link class="nav-link" to="/">Players</router-link>
    <span class="nav-separator">|</span>
    <router-link class="nav-link" to="/plays">Plays</router-link>
    <span class="nav-separator">|</span>
    <router-link class="nav-link" to="/demo">Demo</router-link>
  </div>
</template>

<style lang="scss" scoped>
.nav {
  padding: 20px 0;
  display: flex;

  justify-content: center;
  .nav-separator {
    color: rgb(190, 230, 190);
    margin: 0 0.5rem;
  }
  /*.nav-link {
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
  }*/
}
</style>