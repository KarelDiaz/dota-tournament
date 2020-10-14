<template>
  <div class="loading-content" v-if="$store.state.loading">
    <div class="loading-animation">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Loading"
};
</script>

<style lang="scss" scoped>
.loading-content {
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.3);
  width: 100vw;
  height: 100vh;
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;

  .loading-animation {
    display: flex;
    flex-direction: row;
    justify-content: center;
    $color-off: rgb(128, 0, 0);
    $color-on: rgb(255, 47, 47);
    $w: 20px;
    $h: 40px;

    * {
      min-width: $w;
      min-height: $h;
      width: $w;
      height: $h;
      background-color: $color-off;
      border: 1px solid $color-on;
      margin: 10px;
      $t: 1s;

      &:nth-child(1) {
        animation: loading $t 0s infinite linear;
      }

      &:nth-child(2) {
        animation: loading $t 0.1s infinite linear;
      }

      &:nth-child(3) {
        animation: loading $t 0.2s infinite linear;
      }

      @keyframes loading {
        10% {
          background-color: $color-on;
          transform: scale(1.6);
        }
        0%,
        20%,
        100% {
          transform: scale(1);
          background-color: $color-off;
        }
      }
    }
  }
}
</style>
