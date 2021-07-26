<template>
  <div>
    <div v-if="tournament.name">
      <h1>{{ tournament.name }}</h1>
      <h3>{{ tournament.teams.length }}</h3>
      <div v-for="team in tournament.teams" :key="team">
        {{ team }}
      </div>
    </div>
    <div v-else>
      <h1>No hay tourneo seleccionado</h1>
    </div>    
  </div>
</template>

<script>
export default {
  props: {
    tournament:{},
  },
};
</script>

<style>
</style>