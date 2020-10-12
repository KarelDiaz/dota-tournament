<template>
  <div class="content">Info</div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      prs: []
    };
  },
  methods: {
    initPrs() {
      axios
        .get(this.$store.state.strapi + "/player-results?_limit-1")
        .then(({ data }) => (this.prs = data));
    },
    initPl() {
      axios
        .get(this.$store.state.strapi + "/player-results?_limit-1")
        .then(({ data }) => (this.prs = data));
    }
  },
  created() {
    this.initPrs();
  }
};
</script>

<style lang="scss" scoped>
</style>