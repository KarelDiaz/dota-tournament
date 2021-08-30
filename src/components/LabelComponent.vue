<template>
  <div class="flex flex-col">
    <span v-if="titleTop" class="pl-2 text-xs text-gray-400">
      {{ titleTop }}
    </span>
    <slot></slot>
    <span v-if="titleBottom" class="pl-2 text-xs text-gray-400">
      {{ titleBottom }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    titleTop: String,
    titleBottom: String,
  },
};
</script>