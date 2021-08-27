<template>
  <div class="flex justify-center space-x-3">
    <input type="number" v-model="a" />
    <input type="number" v-model="b" />
    <span>{{ mmrA }}</span>
    <span>{{ mmrB }}</span>
  </div>
</template>

<script>
import MMR from "@/store/model/mmr";

export default {
  data() {
    return {
      a: 0,
      b: 0,
    };
  },
  computed: {
    mmrA() {
      return new MMR(this.a, this.b).getPlusA();
    },
    mmrB() {
      return new MMR(this.a, this.b).getPlusB();
    },
  },
};
</script>

<style>
</style>