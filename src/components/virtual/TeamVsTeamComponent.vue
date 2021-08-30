<template>
  <label-component title-top="Team vs Team">
    <div
      class="grid grid-cols-2 gap-3 p-3 border rounded-lg shadow-lg bg-gradient-to-t from-gray-100 to-white"
    >
      <!-- side win a-->
      <label
        :class="[
          ' h-5 text-center border bg-gradient-to-b rounded-lg shadow-lg',
          {
            'cursor-pointer text-gray-900 border-gray-300 hover:border-gray-200 from-gray-100 to-gray-300 hover:from-gray-50 hover:to-gray-200':
              side_win === 'b',
          },
          {
            'cursor-default text-yellow-900 border-yellow-400 from-yellow-200 to-yellow-400':
              side_win === 'a',
          },
        ]"
      >
        <input v-model="side_win" type="radio" name="radio" value="a" hidden />
      </label>
      <!-- side win b-->
      <label
        :class="[
          'h-5 text-center border bg-gradient-to-b rounded-lg shadow-lg',
          {
            'cursor-pointer text-gray-900 border-gray-300 hover:border-gray-200 from-gray-100 to-gray-300 hover:from-gray-50 hover:to-gray-200':
              side_win === 'a',
          },
          {
            'cursor-default text-yellow-900 border-yellow-400 from-yellow-200 to-yellow-400':
              side_win === 'b',
          },
        ]"
      >
        <input v-model="side_win" type="radio" name="radio" value="b" hidden />
      </label>
      <!-- Team A -->
      <label-component title-top="Team A">
        <virtual-team-component
          v-model="players"
          @mmr="mmrA = $event"
        ></virtual-team-component>
      </label-component>
      <!-- Team B -->
      <label-component title-top="Team B">
        <virtual-team-component
          v-model="players"
          @mmr="mmrB = $event"
        ></virtual-team-component>
      </label-component>
      <!-- MMR plus a -->
      <div class="flex items-center space-x-3">
        <i class="text-gray-300">Plus:</i>
        <span
          :class="[
            'text-xl text-center text-gray-400',
            { 'text-green-500': mmrPlusA > 0 },
            { 'text-red-500': mmrPlusA < 0 },
          ]"
        >
          <span v-if="mmrPlusA > 0">+</span>
          <span v-if="mmrPlusA < 0">-</span>

          {{ Math.abs(mmrPlusA) }}
        </span>
      </div>
      <!-- MMR plus b -->
      <div class="flex items-center space-x-3">
        <i class="text-gray-300">Plus:</i>
        <span
          :class="[
            'text-xl text-center text-gray-400',
            { 'text-green-500': mmrPlusB > 0 },
            { 'text-red-500': mmrPlusB < 0 },
          ]"
        >
          <span v-if="mmrPlusB > 0">+</span>
          <span v-if="mmrPlusB < 0">-</span>

          {{ Math.abs(mmrPlusB) }}
        </span>
      </div>
    </div>
  </label-component>
</template>

<script>
import Axios from "axios";

import MMR from "@/store/model/mmr";

import VirtualTeamComponent from "@/components/virtual/VirtualTeamComponent.vue";
import LabelComponent from "@/components/LabelComponent.vue";

export default {
  components: { VirtualTeamComponent, LabelComponent },
  data() {
    return {
      players: [],
      mmrA: 0,
      mmrB: 0,
      side_win: "a",
    };
  },
  computed: {
    mmrPlusA() {
      return this.side_win === "a"
        ? new MMR(this.mmrA, this.mmrB).getPlusA()
        : new MMR(this.mmrB, this.mmrA).getPlusB();
    },
    mmrPlusB() {
      return this.side_win === "b"
        ? new MMR(this.mmrB, this.mmrA).getPlusA()
        : new MMR(this.mmrA, this.mmrB).getPlusB();
    },
  },
  async created() {
    await Axios.get(this.$store.state.strapi + "/players?_limit=-1").then(
      ({ data }) => {
        this.players = data;
      }
    );
  },
};
</script>