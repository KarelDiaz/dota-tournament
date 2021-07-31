<template>
  <div>
    <transition name="fade">
      <div v-if="!nonePlayers" class="flex">
        <!--Left-->
        <div class="flex-grow w-32 px-3 my-3 border-r">
          <span>
            <b>Seleccione los players <i class="fa fa-arrow-right"></i></b>
          </span>
          <transition-group name="slide-right">
            <div
              class="player"
              v-for="p in ps1"
              :key="p.id"
              @click="from1To2(p)"
            >
              <span>
                {{ p.nick }}
                <i class="fa fa-arrow-right"></i>
              </span>
            </div>
          </transition-group>
        </div>
        <!--Center-->
        <div class="flex-grow w-32 px-3 my-3 border-r">
          <span>
            <b>Players</b>
            <transition-group name="fade">
              <button
                v-if="ps2.length > 0"
                @click="from2To3()"
                class="
                  px-4
                  ml-3
                  text-green-900
                  border border-green-400
                  hover:border-green-300
                  bg-gradient-to-b
                  from-green-200
                  to-green-400
                  hover:from-green-100
                  hover:to-green-300
                "
              >
                <i class="fa fa-arrow-right"></i>
              </button>
              <button
                v-if="ps2.length > 0"
                @click="clearPs2()"
                class="
                  px-4
                  ml-3
                  text-gray-900
                  border border-gray-400
                  hover:border-gray-300
                  bg-gradient-to-b
                  from-gray-100
                  to-gray-400
                  hover:from-gray-100
                  hover:to-gray-300
                "
              >
                <i class="fa fa-trash"></i>
              </button>
            </transition-group>
          </span>
          <transition-group name="slide-left-in-fade-out">
            <div
              v-for="p in ps2"
              :key="p.id"
              @click="from2To1(p)"
              class="player"
            >
              <span>
                {{ p.nick }}
                <i class="fa fa-arrow-left"></i>
              </span>
            </div>
          </transition-group>
        </div>
        <!--Right-->
        <div class="flex-grow w-32 px-3 my-3">
          <span>
            <b>Seleccion</b>
            <transition name="fade">
              <button
                v-if="ps3.length > 0"
                @click="clearPs3()"
                class="
                  px-4
                  ml-3
                  text-gray-900
                  border border-gray-400
                  hover:border-gray-300
                  bg-gradient-to-b
                  from-gray-100
                  to-gray-400
                  hover:from-gray-100
                  hover:to-gray-300
                "
              >
                <i class="fa fa-trash"></i>
              </button>
            </transition>
          </span>
          <transition-group name="slide-left">
            <div v-for="(p, i) in ps3" :key="p.id" class="flex justify-between">
              <span v-html="p.nick"></span>
              <b v-html="i + 1"></b>
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
    from1To2(p) {
      this.ps1 = this.ps1.filter((pp) => pp != p);
      this.ps2.push(p);
      this.ps2.sort((a, b) => a.nick > b.nick);
    },
    from2To1(p) {
      this.ps2 = this.ps2.filter((pp) => pp != p);
      this.ps1.push(p);
      this.ps1.sort((a, b) => a.nick > b.nick);
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
      this.ps1.sort((a, b) => a.nick > b.nick);
      this.ps2 = [];
    },
    clearPs3() {
      this.ps3.forEach((element) => {
        this.ps1.push(element);
      });
      this.ps1.sort((a, b) => a.nick > b.nick);
      this.ps3 = [];
    },
  },
  created() {
    axios
      .get(this.$store.state.strapi + "/players?_limit=-1")
      .then(({ data }) => {
        this.ps1 = data
          .filter((p) => p.nick != "bot")
          .sort((a, b) => a.nick > b.nick);
        this.ps2 = [];
        this.ps3 = [];
      });
  },
};
</script>

<style lang="scss" scoped>
.player {
  @apply cursor-pointer;
  &:hover {
    i {
      opacity: 1;
      animation-play-state: running;
    }
  }

  i {
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
