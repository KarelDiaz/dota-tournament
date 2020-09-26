<template>
  <div>
    <div id="nav">
      <router-link to="/">Players</router-link>
      <span class="nav-separator">|</span>
      <router-link to="/plays">Plays</router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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

input {
  border: none;
  box-shadow: none;
  background-color: rgb(250, 250, 250);
  border: 1px solid rgb(240, 240, 240);
  padding: 0 5px;
}

button {
  background-color: rgb(230, 230, 230);
  border: 1px solid rgb(220, 220, 220);
  padding: 1px 5px;
  cursor: pointer;

  &.success {
    background-color: rgb(200, 240, 200);
    border: 1px solid rgb(180, 220, 180);
    color: rgb(80, 120, 80);

    &:hover {
      background-color: rgb(190, 230, 190);
      border: 1px solid rgb(170, 210, 170);
    }
  }

  &.danger {
    background-color: rgb(240, 200, 200);
    border: 1px solid rgb(220, 180, 180);
    color: rgb(120, 80, 80);

    &:hover {
      background-color: rgb(230, 190, 190);
      border: 1px solid rgb(210, 170, 170);
    }
  }
}
</style>
