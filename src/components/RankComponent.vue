<template>
  <div class="flex flex-col items-center" :title="title">
    <div class="flex justify-center" v-if="rank.star > 0">
      <i
        class="text-yellow-400 fa fa-star"
        :style="[{ 'font-size': `${size}px` }]"
        v-for="i in rank.star"
        :key="`star${i}`"
      ></i>
    </div>
    <div :class="`h-${size}`">
      <img :class="`w-${size + 2}`" :src="`rank/${rank.name}.png`" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { GET_RANK } from "@/store/type/getters";

export default {
  data() {
    return {
      rank: {},
    };
  },
  props: {
    mmr: Number,
    size: { type: Number, default: 5 },
  },
  computed: {
    ...mapGetters([GET_RANK]),
    title() {
      // capitalize the title
      if(!this.rank.name)return ''
      let name = this.rank.name;
      name = name.substring(0, 1).toUpperCase() + name.substring(1);
      let star = this.rank.star;
      return `${name} ${star}`;
    },
  },
  mounted() {
    this.rank = this.getRank(this.mmr);
  },
};
</script>