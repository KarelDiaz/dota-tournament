<template>
  <button class="danger" @click="clean">Clean</button>
</template>

<script>
import axios from "axios";
export default {
  name: "Clean",
  methods: {
    clean() {
      for (let index = 0; index < 40; index++) {
        axios
          .delete(this.$store.state.strapi + "/plays/" + index)
          .then(() => {
            console.log("p", index);
          })
          .catch(() => {
            console.log("not exist p", index);
          });
      }
      for (let index = 0; index < 100; index++) {
        axios
          .delete(this.$store.state.strapi + "/player-results/" + index)
          .then(() => {
            console.log("pr", index);
          })
          .catch(() => {
            console.log("not exist pr", index);
          });
      }
    }
  }
};
</script>

<style>
</style>