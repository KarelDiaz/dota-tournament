<template>
  <div>
    <!-- Desktop -->
    <div
      class="z-50 justify-between hidden p-3 border border-blue-100 shadow-lg  md:flex h-14 bg-gradient-to-r from-blue-100 to-white"
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
      <div class="flex items-center space-x-3">
        <!-- Players -->
        <router-link class="link hover:text-blue-500" to="/players">
          Players
        </router-link>
        <!-- Plays -->
        <router-link class="link hover:text-blue-500" to="/plays">
          Plays
        </router-link>
        <!-- Tournaments -->
        <router-link class="link hover:text-blue-500" to="/tournaments">
          Tournaments
        </router-link>
        <!-- Heroes -->
        <router-link class="link hover:text-blue-500" to="/hero">
          Heroes
        </router-link>
        <!-- Lotery -->
        <router-link class="link hover:text-blue-500" to="/lotery">
          Lotery
        </router-link>
        <!-- GitHub -->
        <a
          class="ml-3 cursor-pointer"
          :href="$store.state.github.frontend"
          target="blanck"
        >
          <span class="-mt-1 text-3xl text-gray-400 fa fa-github"></span>
        </a>
      </div>
    </div>
    <!-- Movile -->
    <div
      class="top-0 z-50 flex justify-between w-full p-3 border-b border-blue-100 shadow-lg  md:hidden h-14 bg-gradient-to-r from-blue-100 to-white"
    >
      <!-- Logo -->
      <div>
        <router-link to="/" class="cursor-pointer">
          <img class="h-full" src="favicon.png" />
        </router-link>
      </div>
      <!-- Burguer -->
      <button class="flex flex-col justify-between" @click="open = !open">
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
      <!-- Links -->
      <transition name="slide-left-full">
        <div
          v-if="open"
          class="fixed top-0 left-0 z-50 flex flex-col justify-between w-2/3 h-screen p-3 overflow-y-auto bg-white shadow-2xl "
        >
          <!-- Link -->
          <div class="flex flex-col space-y-3">
            <!-- Logo -->
            <router-link
              to="/"
              class="cursor-pointer"
              @click.passive="open = false"
            >
              <img src="favicon.png" class="w-1/4 mx-auto mb-3" />
            </router-link>
            <!-- Players -->
            <router-link
              @click.passive="open = false"
              class="px-2 py-1 mb-3 break-all border border-blue-300 shadow-sm  bg-gradient-to-b from-blue-100 to-blue-300 hover:from-blue-50 hover:to-blue-200 hover:border-blue-200"
              to="/players"
            >
              Players
            </router-link>
            <!-- Plays -->
            <router-link
              @click.passive="open = false"
              class="px-2 py-1 mb-3 break-all border border-blue-300 shadow-sm  bg-gradient-to-b from-blue-100 to-blue-300 hover:from-blue-50 hover:to-blue-200 hover:border-blue-200"
              to="/plays"
            >
              Plays
            </router-link>
            <!-- Tournaments -->
            <router-link
              @click.passive="open = false"
              class="px-2 py-1 mb-3 break-all border border-blue-300 shadow-sm  bg-gradient-to-b from-blue-100 to-blue-300 hover:from-blue-50 hover:to-blue-200 hover:border-blue-200"
              to="/tournaments"
            >
              Tournaments
            </router-link>
            <!-- Heroes -->
            <router-link
              @click.passive="open = false"
              class="px-2 py-1 mb-3 break-all border border-blue-300 shadow-sm  bg-gradient-to-b from-blue-100 to-blue-300 hover:from-blue-50 hover:to-blue-200 hover:border-blue-200"
              to="/hero"
            >
              Heroes
            </router-link>
            <!-- Lotery -->
            <router-link
              @click.passive="open = false"
              class="px-2 py-1 break-all border border-blue-300 shadow-sm  bg-gradient-to-b from-blue-100 to-blue-300 hover:from-blue-50 hover:to-blue-200 hover:border-blue-200"
              to="/lotery"
            >
              Lotery
            </router-link>
          </div>
          <!-- GitHub -->
          <a
            class="w-full text-center cursor-pointer"
            :href="$store.state.github.frontend"
            target="blanck"
          >
            <span class="-mt-1 text-3xl text-gray-400 fa fa-github"></span>
          </a>
        </div>
      </transition>
      <!-- Dropback -->
      <transition name="fade">
        <div
          v-if="open"
          @click="open = false"
          class="fixed top-0 right-0 z-40 w-screen h-screen bg-blue-900  bg-opacity-30"
        ></div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      open: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.link {
  @apply py-1 px-2 cursor-pointer bg-transparent rounded-lg text-lg font-extrabold text-gray-400;
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
