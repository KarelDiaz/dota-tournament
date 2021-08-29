<template>
  <div
    class="flex flex-col p-2 space-y-2  sm:space-y-0 sm:space-x-3 sm:flex-row sm:p-3"
  >
    <mmr-vs-mmr-component></mmr-vs-mmr-component>
    <team-vs-team-component></team-vs-team-component>
  </div>
</template>

<script>
import MmrVsMmrComponent from "@/components/virtual/MmrVsMmrComponent.vue";
import TeamVsTeamComponent from "@/components/virtual/TeamVsTeamComponent.vue";

export default {
  components: { MmrVsMmrComponent, TeamVsTeamComponent },
};
</script>
