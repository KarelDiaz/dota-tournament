<template>
  <div>
    <h1 v-if="tournament.name">{{tournament.name}}</h1>
    <h1 v-if="!tournament.name">No hay tourneo seleccionado</h1>
    <h3>{{tournament.teams.length}}</h3>
    <div v-for="team in tournament.teams" :key="team">
      {{team}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tournament: {},
  },
}
</script>

<style>

</style>