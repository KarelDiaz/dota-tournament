<template>
  <div
    class="flex justify-between h-10 p-1 border bg-gradient-to-t from-gray-100"
  >
    <!-- Logo and link to info -->
    <router-link to="/" class="flex items-center pl-2 space-x-2 cursor-pointer">
      <img src="favicon.png" class="h-8 py-1 max-w-min" />
      <div
        class="hidden my-auto space-x-2 text-sm text-transparent  font-extralight md:flex bg-clip-text bg-gradient-to-b from-blue-500 to-blue-800"
      >
        <span>T</span><span>o</span><span>u</span><span>r</span> <span>n</span
        ><span>a</span> <span>m</span><span>e</span> <span>n</span
        ><span>t</span>
      </div>
    </router-link>
    <div
      class="flex items-center justify-center tracking-widest text-transparent  md:hidden bg-clip-text bg-gradient-to-b from-blue-500 to-blue-800"
    >
      {{ $route.name }}
    </div>
    <!-- Burguer -->
    <button
      class="flex flex-col justify-around md:hidden"
      @click="open = !open"
    >
      <div
        v-for="i in 3"
        :key="i"
        :class="[
          'h-1 w-8 rounded-full transform transition-all duration-500',
          'bg-gradient-to-r from-gray-400 to-gray-300',
          { 'translate-y-2.5 rotate-45': open && i === 1 },
          { 'opacity-0': open && i === 2 },
          { '-translate-y-2.5 -rotate-45': open && i === 3 },
        ]"
      ></div>
    </button>
    <!-- Link views -->
    <transition name="slide-left-full">
      <div
        class="fixed top-0 bottom-0 left-0 z-20 w-2/3  md:static md:z-auto md:object-none md:object-center"
        v-if="open || window.innerWidth > 768"
      >
        <div
          class="flex flex-col items-center h-full p-3 m-0 space-y-2 overflow-auto bg-white shadow-xl  md:shadow-none md:bg-opacity-0 md:p-0 md:flex-row md:justify-end md:space-x-3 md:space-y-0"
        >
          <!-- Logo and link to info -->
          <router-link
            to="/"
            class="flex flex-col items-center w-full pb-3 border-b cursor-pointer  sm:hidden"
            @click.passive="open = false"
          >
            <img src="favicon.png" class="w-20 h-20 filter drop-shadow-lg" />
            <span
              class="flex w-full text-xs text-center text-blue-700  justify-evenly md:inline-block"
            >
              <span>T</span><span>o</span><span>u</span><span>r</span>
              <span>n</span><span>a</span> <span>m</span><span>e</span>
              <span>n</span><span>t</span>
            </span>
          </router-link>
          <!-- Players -->
          <router-link
            class="link hover:text-blue-500"
            to="/players"
            @click.passive="open = false"
          >
            Players
          </router-link>
          <!-- Tournaments -->
          <router-link
            v-if="$store.state.players.length > 0"
            @click.passive="open = false"
            class="link hover:text-blue-500"
            to="/tournaments"
          >
            Tournaments
          </router-link>
          <!-- Plays -->
          <router-link
            v-if="$store.state.players.length > 0"
            @click.passive="open = false"
            class="link hover:text-blue-500"
            to="/plays"
          >
            Plays
          </router-link>
          <!-- Heroes -->
          <router-link
            v-if="$store.state.players.length > 0"
            class="link hover:text-blue-500"
            to="/hero"
            @click.passive="open = false"
          >
            Heroes
          </router-link>
          <!-- Virtual -->
          <router-link
            v-if="$store.state.players.length > 0"
            class="link hover:text-blue-500"
            to="/virtual"
            @click.passive="open = false"
          >
            Virtual
          </router-link>
          <!-- Lotery -->
          <router-link
            v-if="$store.state.players.length > 0"
            class="link hover:text-blue-500"
            to="/lotery"
            @click.passive="open = false"
          >
            Lotery
          </router-link>
          <!-- GitHub -->
          <div
            class="flex flex-col justify-end flex-grow w-full pr-2  md:w-auto md:flex-grow-0"
          >
            <a
              class="text-center cursor-pointer"
              :href="$store.state.github.frontend"
              target="blanck"
            >
              <span class="-mt-1 text-2xl text-gray-400 fa fa-github"></span>
            </a>
          </div>
        </div>
      </div>
    </transition>
    <!-- Dropback -->
    <transition name="fade">
      <div
        v-if="open"
        @click="open = false"
        class="fixed top-0 right-0 z-10 w-screen h-screen bg-gray-900  md:hidden bg-opacity-30"
      ></div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      window: window,
      open: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.link {
  @apply text-center w-full md:w-auto cursor-pointer bg-transparent rounded-lg tracking-widest text-gray-400;
}
.router-link-exact-active {
  @apply bg-clip-text text-transparent bg-gradient-to-b from-blue-500 to-blue-800;
  &:hover {
    @apply bg-clip-text text-transparent bg-gradient-to-b from-blue-500 to-blue-800 cursor-default;
  }
}
.corner {
  clip-path: polygon(100% 0, 100% 100%, 50% 50%, 0 0);
}
</style>
