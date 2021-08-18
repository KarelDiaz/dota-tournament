<template>
  <div class="flex flex-col">
    <span v-if="titleTop" class="text-xs text-gray-400 pl-2">
      {{ titleTop }}
    </span>
    <slot></slot>
    <span v-if="titleBottom" class="text-xs text-gray-400 pl-2">
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