<template>
  <div>
    <img
      :class="'h-' + size"
      :src="`rank/${rank.name}.png`"
      :title="getRank(mmr).name"
    />
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
  },
  mounted() {
    this.rank = this.getRank(this.mmr);
  },
};
</script>