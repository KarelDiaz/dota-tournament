<template>
  <div>
    <div class="hidden sm:flex p-3 justify-between h-14">
      <img src="dota_logo.png" class="filter hue-rotate-180 h-10" />
      <div class="flex">
        <router-link
          class="
            py-1
            px-2
            shadow-sm
            bg-gradient-to-b
            from-blue-100
            to-blue-300
            hover:from-blue-50
            hover:to-blue-200
            border border-blue-300
            hover:border-blue-200
            transform
            -skew-x-12
          "
          to="/"
        >
          Players
        </router-link>
        <router-link
          class="
            py-1
            px-2
            shadow-sm
            bg-gradient-to-b
            from-blue-100
            to-blue-300
            hover:from-blue-50
            hover:to-blue-200
            border border-blue-300
            hover:border-blue-200
            transform
            -skew-x-12
          "
          to="/plays"
        >
          Plays
        </router-link>
        <router-link
          class="
            py-1
            px-2
            shadow-sm
            bg-gradient-to-b
            from-blue-100
            to-blue-300
            hover:from-blue-50
            hover:to-blue-200
            border border-blue-300
            hover:border-blue-200
            transform
            -skew-x-12
          "
          to="/hero"
        >
          Heroes
        </router-link>
        <router-link
          class="
            py-1
            px-2
            shadow-sm
            bg-gradient-to-b
            from-blue-100
            to-blue-300
            hover:from-blue-50
            hover:to-blue-200
            border border-blue-300
            hover:border-blue-200
            transform
            -skew-x-12
          "
          to="/lotery"
        >
          Lotery
        </router-link>
        <router-link
          class="
            py-1
            px-2
            shadow-sm
            bg-gradient-to-b
            from-blue-100
            to-blue-300
            hover:from-blue-50
            hover:to-blue-200
            border border-blue-300
            hover:border-blue-200
            transform
            -skew-x-12
          "
          to="/tournament"
        >
          Tournament
        </router-link>
      </div>
    </div>
    <div class="flex sm:hidden justify-between h-14 p-3 top-0 w-full">
      <img src="dota_logo.png" class="filter hue-rotate-180" />
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
      <transition name="slide-left">
        <div
          v-if="open"
          class="
            flex flex-col
            z-50
            left-0
            top-0
            w-1/2
            h-screen
            fixed
            bg-white
            shadow-lg
            p-3
          "
        >
          <img
            src="dota_logo.png"
            class="filter hue-rotate-180 mb-3 w-1/4 mx-auto"
          />
          <router-link
            @click.passive="open = false"
            class="
              py-1
              px-2
              mb-3
              shadow-sm
              bg-gradient-to-b
              from-blue-100
              to-blue-300
              hover:from-blue-50
              hover:to-blue-200
              border border-blue-300
              hover:border-blue-200
            "
            to="/"
          >
            Players
          </router-link>
          <router-link
            @click.passive="open = false"
            class="
              py-1
              px-2
              mb-3
              shadow-sm
              bg-gradient-to-b
              from-blue-100
              to-blue-300
              hover:from-blue-50
              hover:to-blue-200
              border border-blue-300
              hover:border-blue-200
            "
            to="/plays"
          >
            Plays
          </router-link>
          <router-link
            @click.passive="open = false"
            class="
              py-1
              px-2
              mb-3
              shadow-sm
              bg-gradient-to-b
              from-blue-100
              to-blue-300
              hover:from-blue-50
              hover:to-blue-200
              border border-blue-300
              hover:border-blue-200
            "
            to="/hero"
          >
            Heroes
          </router-link>
          <router-link
            @click.passive="open = false"
            class="
              py-1
              px-2
              mb-3
              shadow-sm
              bg-gradient-to-b
              from-blue-100
              to-blue-300
              hover:from-blue-50
              hover:to-blue-200
              border border-blue-300
              hover:border-blue-200
            "
            to="/lotery"
          >
            Lotery
          </router-link>
          <router-link
            @click.passive="open = false"
            class="
              py-1
              px-2
              shadow-sm
              bg-gradient-to-b
              from-blue-100
              to-blue-300
              hover:from-blue-50
              hover:to-blue-200
              border border-blue-300
              hover:border-blue-200
            "
            to="/tournament"
          >
            Tournament
          </router-link>
        </div>
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
.router-link-exact-active {
  @apply from-green-50 to-green-200 border-green-200;
  &:hover {
    @apply from-green-50 to-green-200 border-green-200 cursor-default;
  }
}
</style>
