<template>
  <div>
    <transition name="fade">
      <div
        v-if="!nonePlayers"
        class="fixed top-0 bottom-0 left-0 right-0 grid grid-cols-3 divide-x pt-14"
      >
        <!--Left-->
        <div class="h-full p-3 space-y-3 overflow-auto">
          <!-- Controls -->
          <transition name="fade">
            <div
              class="sticky top-0 left-0 right-0 flex justify-center bg-gradient-to-b "
              v-if="ps1.length > 0"
            >
              <button
                @click="from1To2All()"
                class="w-8 h-8 ml-2 text-xs text-blue-800 border border-blue-300 rounded-full shadow-lg sm:ml-3 hover:border-blue-200 bg-gradient-to-b from-blue-100 to-blue-300 hover:from-blue-50 hover:to-blue-200"
              >
                <i class="fa fa-arrow-right"></i>
              </button>
            </div>
          </transition>
          <!-- Players left -->
          <transition-group name="slide-right">
            <div
              class="player"
              v-for="p in ps1"
              :key="p.id"
              @click="from1To2(p)"
            >
              <span>{{ p.nick }}</span>
              <i class="fa fa-arrow-right"></i>
            </div>
          </transition-group>
        </div>
        <!--Center-->
        <div class="h-full p-3 space-y-3 overflow-auto">
          <!-- Controls -->
          <transition name="fade">
            <div
              class="sticky top-0 left-0 right-0 flex justify-center space-x-2 stiky sm:space-x-6"
              v-if="ps2.length > 0"
            >
              <button
                v-if="ps2.length > 0"
                @click="clearPs2()"
                class="w-8 h-8 ml-2 text-xs text-blue-800 border border-blue-300 rounded-full shadow-lg sm:ml-3 hover:border-blue-200 bg-gradient-to-b from-blue-100 to-blue-300 hover:from-blue-50 hover:to-blue-200"
              >
                <i class="fa fa-arrow-left"></i>
              </button>
              <button
                @click="from2To3()"
                class="w-8 h-8 text-xs text-green-900 border border-green-400 rounded-full shadow-lg hover:border-green-300 bg-gradient-to-b from-green-200 to-green-400 hover:from-green-100 hover:to-green-300"
              >
                <i class="fa fa-random"></i>
              </button>
            </div>
          </transition>
          <!-- Players center -->
          <transition-group name="slide-left-in-fade-out">
            <div
              v-for="p in ps2"
              :key="p.id"
              @click="from2To1(p)"
              class="player"
            >
              <span>{{ p.nick }}</span>
              <i class="hidden sm:inline-block fa fa-arrow-left"></i>
            </div>
          </transition-group>
        </div>
        <!--Right-->
        <div class="h-full p-3 space-y-3 overflow-auto">
          <!-- Controls -->
          <transition name="fade">
            <div
              class="sticky top-0 left-0 right-0 flex justify-center"
              v-if="ps3.length > 0"
            >
              <button
                @click="clearPs3()"
                class="w-8 h-8 text-xs text-gray-900 border border-gray-300 rounded-full shadow-lg hover:border-gray-200 bg-gradient-to-b from-gray-100 to-gray-300 hover:from-gray-50 hover:to-gray-200"
              >
                <i class="fa fa-trash"></i>
              </button>
            </div>
          </transition>
          <!-- Players right -->
          <transition-group name="slide-left">
            <div
              v-for="(p, i) in ps3"
              :key="p.id"
              class="flex justify-between p-1 px-3 text-green-600 border border-green-200 rounded-full shadow-lg bg-gradient-to-tl from-green-200 to-green-50"
            >
              <span>{{ p.nick }}</span>
              <b>{{ i + 1 }}</b>
            </div>
          </transition-group>
        </div>
      </div>
      <div v-else>
        <h1>No hay players disponibles</h1>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      ps1: [],
      ps2: [],
      ps3: [],
    };
  },
  computed: {
    nonePlayers() {
      return (
        this.ps1.length === 0 && this.ps2.length === 0 && this.ps3.length === 0
      );
    },
  },
  methods: {
    from1To2All() {
      this.ps1.forEach((p) => this.ps2.push(p));
      this.ps1 = [];
      this.ps2.sort((a, b) => a.nick.localeCompare(b.nick));
    },
    from1To2(p) {
      this.ps1 = this.ps1.filter((pp) => pp != p);
      this.ps2.push(p);
      this.ps2.sort((a, b) => a.nick.localeCompare(b.nick));
    },
    from2To1(p) {
      this.ps2 = this.ps2.filter((pp) => pp != p);
      this.ps1.push(p);
      this.ps1.sort((a, b) => a.nick.localeCompare(b.nick));
    },
    from2To3() {
      var pos = Math.floor(Math.random() * this.ps2.length);
      var p = this.ps2[pos];
      this.ps2 = this.ps2.filter((pp) => pp != p);
      this.ps3.push(p);
    },
    clearPs2() {
      this.ps2.forEach((element) => {
        this.ps1.push(element);
      });
      this.ps1.sort((a, b) => a.nick.localeCompare(b.nick));
      this.ps2 = [];
    },
    clearPs3() {
      this.ps3.forEach((element) => {
        this.ps1.push(element);
      });
      this.ps1.sort((a, b) => a.nick.localeCompare(b.nick));
      this.ps3 = [];
    },
  },
  created() {
    axios
      .get(this.$store.state.strapi + "/players?_limit=-1")
      .then(({ data }) => {
        this.ps1 = data
          .filter((p) => p.nick != "bot")
          .sort((a, b) => a.nick.localeCompare(b.nick));
        this.ps2 = [];
        this.ps3 = [];
      });
  },
};
</script>

<style lang="scss" scoped>
.player {
  @apply cursor-pointer border border-dashed border-gray-300 p-1 px-3 rounded-full bg-gradient-to-t from-gray-100 to-white flex justify-between items-center;

  &:hover {
    .fa {
      opacity: 0.5;
      animation-play-state: running;
    }
  }

  .fa {
    @apply mr-3;
    opacity: 0;
    animation: atent 0.3s infinite alternate;
    animation-play-state: paused;

    @keyframes atent {
      0% {
        transform: translateX(0px);
      }
      100% {
        transform: translateX(15px);
      }
    }
  }
}
</style>
