<template>
  <div
    class="z-50 flex justify-between p-3 border border-blue-100 shadow-lg  h-14 bg-gradient-to-r from-blue-100 to-white"
  >
    <!-- Logo and link to info -->
    <router-link to="/" class="flex cursor-pointer">
      <img src="favicon.png" class="h-full my-auto" />
      <div class="ml-3 text-2xl font-bold">
        <span
          class="my-auto text-transparent  bg-clip-text bg-gradient-to-b from-blue-500 to-blue-800"
        >
          Dota Tournament
        </span>
      </div>
    </router-link>
    <!-- Link views -->
    <transition name="slide-left-full">
      <div
        class="fixed top-0 bottom-0 left-0 z-50 w-2/3 md:relative"
        v-if="open || window.innerWidth > 640"
      >
        <div
          class="flex flex-col items-center h-full p-3 m-0 space-y-3 overflow-auto bg-white shadow-xl  md:shadow-none md:bg-opacity-0 md:p-0 md:flex-row md:justify-end md:space-x-3 md:space-y-0"
        >
          <!-- Players -->
          <router-link
            class="link hover:text-blue-500"
            to="/players"
            @click.passive="open = false"
          >
            Players
          </router-link>
          <!-- Plays -->
          <router-link
            class="link hover:text-blue-500"
            to="/plays"
            @click.passive="open = false"
          >
            Plays
          </router-link>
          <!-- Tournaments -->
          <router-link
            class="link hover:text-blue-500"
            to="/tournaments"
            @click.passive="open = false"
          >
            Tournaments
          </router-link>
          <!-- Heroes -->
          <router-link
            class="link hover:text-blue-500"
            to="/hero"
            @click.passive="open = false"
          >
            Heroes
          </router-link>
          <!-- Lotery -->
          <router-link
            class="link hover:text-blue-500"
            to="/lotery"
            @click.passive="open = false"
          >
            Lotery
          </router-link>
          <!-- GitHub -->
          <div
            class="flex flex-col justify-end flex-grow w-full  md:w-auto md:flex-grow-0"
          >
            <a
              class="text-center cursor-pointer md:ml-3"
              :href="$store.state.github.frontend"
              target="blanck"
            >
              <span class="-mt-1 text-2xl text-gray-400 fa fa-github"></span>
            </a>
          </div>
        </div>
      </div>
    </transition>
    <!-- Burguer -->
    <button
      class="flex flex-col justify-between md:hidden"
      @click="open = !open"
    >
      <div
        v-for="i in 3"
        :key="i"
        :class="[
          'h-2 w-10 rounded-full transform transition-all',
          'bg-gradient-to-r from-gray-400 to-gray-300',
          { 'translate-y-3 rotate-45': open && i === 1 },
          { 'scale-x-0': open && i === 2 },
          { '-translate-y-3 -rotate-45': open && i === 3 },
        ]"
      ></div>
    </button>
    <!-- Dropback -->
    <transition name="fade">
      <div
        v-if="open"
        @click="open = false"
        class="fixed top-0 right-0 z-40 w-screen h-screen bg-gray-900  md:hidden bg-opacity-30"
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
  @apply px-2 text-center w-full md:w-auto cursor-pointer bg-transparent rounded-lg text-lg font-extrabold text-gray-400;
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
