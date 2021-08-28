<template>
  <label-component title-top="MMR vs MMR">
    <div
      class="grid items-center justify-center w-1/4 grid-cols-2 gap-2 p-2 border rounded-lg shadow-lg bg-gradient-to-t from-gray-50 to-white"
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
      <!-- MMR a -->
      <label-component title-top="MMR a">
        <!-- MMR val -->
        <input
          class="px-2 py-1 border border-gray-100 rounded-lg shadow-lg bg-gradient-to-b from-white to-gray-100 focus:ring-green-200 focus:outline-none focus:ring-1 focus:border-transparent"
          type="number"
          min="0"
          v-model="a"
        />
      </label-component>
      <!-- MMR b -->
      <label-component title-top="MMR b">
        <!-- MMR val -->
        <input
          class="px-2 py-1 border border-gray-100 rounded-lg shadow-lg bg-gradient-to-b from-white to-gray-100 focus:ring-green-200 focus:outline-none focus:ring-1 focus:border-transparent"
          type="number"
          min="0"
          v-model="b"
        />
      </label-component>
      <!-- MMR plus a -->
      <span
        :class="[
          'text-xl text-center',
          { 'text-green-500': mmrA > 0 },
          { 'text-red-500': mmrA < 0 },
        ]"
      >
        <span v-if="mmrA > 0">+</span>
        <span v-if="mmrA < 0">-</span>

        {{ Math.abs(mmrA) }}
      </span>
      <!-- MMR plus b -->
      <span
        :class="[
          'text-xl text-center text-gray-400',
          { 'text-green-500': mmrB > 0 },
          { 'text-red-500': mmrB < 0 },
        ]"
      >
        <span v-if="mmrB > 0">+</span>
        <span v-if="mmrB < 0">-</span>

        {{ Math.abs(mmrB) }}
      </span>
    </div>
  </label-component>
</template>

<script>
import MMR from "@/store/model/mmr";

import LabelComponent from "@/components/LabelComponent";

export default {
  data() {
    return {
      a: 0,
      b: 0,
      side_win: "a",
    };
  },
  computed: {
    mmrA() {
      return this.side_win === "a"
        ? new MMR(this.a, this.b).getPlusA()
        : new MMR(this.b, this.a).getPlusB();
    },
    mmrB() {
      return this.side_win === "b"
        ? new MMR(this.b, this.a).getPlusA()
        : new MMR(this.a, this.b).getPlusB();
    },
  },
  components: { LabelComponent },
};
</script>
