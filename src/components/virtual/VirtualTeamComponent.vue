<template>
  <div class="flex flex-col">
    <!-- Players select -->
    <div class="flex overflow-hidden rounded-lg shadow-lg">
      <!-- Players -->
      <select
        class="w-full h-8 px-2 border rounded-l-lg bg-gradient-to-t from-gray-100 to-white"
        v-model="playerToAdd"
      >
        <option v-for="player in players" :key="player.id" :value="player">
          {{ player.nick }}
        </option>
      </select>
      <!-- Add -->
      <button
        class="h-8 px-3 text-green-800 border border-green-400 rounded-r-lg bg-gradient-to-t from-green-400 to-green-200"
        @click="add()"
      >
        <i class="fa fa-plus"></i>
      </button>
    </div>
    <!-- Players list -->
    <label-component
      class="flex flex-col p-2 space-y-2"
      :title-top="`MMR: ${mmr}`"
    >
      <transition-group name="slide-top">
        <!-- Player -->
        <span
          class="flex justify-between px-3 text-gray-700 border rounded-full shadow-lg cursor-pointer player bg-gradient-to-t from-gray-100 to-gray-50 hover:from-gray-100 hover:to-white"
          v-for="player in playersSelected"
          :key="player.id + 'as'"
          @click="remove(player)"
        >
          <span>{{ player.nick }}</span>
          <i class="fa fa-arrow-up"></i>
        </span>
      </transition-group>
    </label-component>
  </div>
</template>

<script>
import LabelComponent from "@/components/LabelComponent.vue";

export default {
  props: {
    modelValue: Array,
  },
  data() {
    return {
      playerToAdd: {},
      playersSelected: [],
      players: [],
    };
  },
  computed: {
    mmr() {
      let mmr = 0;
      this.playersSelected.map((ps) => (mmr += ps.mmr));
      mmr = Math.round(mmr / Math.max(this.playersSelected.length, 1));
      return mmr;
    },
  },
  components: {
    LabelComponent,
  },
  methods: {
    add() {
      if (this.playerToAdd.nick && this.playersSelected.length < 5) {
        this.players = this.players.filter((p) => p.id !== this.playerToAdd.id);
        this.playersSelected.push(this.playerToAdd);
        this.playerToAdd = {};
      }
    },
    remove(player) {
      this.players.push(player);
      this.players.sort((a, b) => a.nick.localeCompare(b.nick));
      this.playersSelected = this.playersSelected.filter(
        (p) => p.id !== player.id
      );
    },
  },
  watch: {
    modelValue(v) {
      this.players = v;
    },
    players(v) {
      this.$emit("update:modelValue", v);
    },
    mmr(v) {
      this.$emit("mmr", v);
    },
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
        transform: translateY(5px);
      }
      100% {
        transform: translateY(-5px);
      }
    }
  }
}
</style>