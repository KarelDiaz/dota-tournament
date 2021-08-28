<template>
  <div class="flex p-2 space-x-3 sm:p-3">
    <mmr-vs-mmr-component></mmr-vs-mmr-component>
    <team-vs-team-component></team-vs-team-component>
  </div>
</template>

<script>
import MmrVsMmrComponent from "@/components/virtual/MmrVsMmrComponent.vue";
import TeamVsTeamComponent from "../components/virtual/TeamVsTeamComponent.vue";
export default {
  components: { MmrVsMmrComponent, TeamVsTeamComponent },
};
</script>

<style>
</style>