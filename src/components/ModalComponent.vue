<template>
  <!-- Back -->
  <transition name="fade">
    <div
      @click="$emit('update:modelValue', false)"
      v-if="modelValue"
      class="fixed top-0 bottom-0 left-0 right-0 z-30 bg-gray-900 bg-opacity-30"
    ></div>
  </transition>
  <!-- Modal -->
  <transition name="slide-top">
    <div
      v-if="modelValue"
      class="fixed z-40 top-3 right-3 left-3 bottom-3 sm:bottom-auto sm:top-6 sm:right-6 sm:left-6"
    >
      <!-- Close -->
      <button
        class="absolute z-50 text-gray-700 transition-all border border-gray-300 rounded-full shadow-md w-9 h-9 -top-5 -right-5 hover:border-gray-200 bg-gradient-to-b from-gray-50 to-gray-200 hover:from-white hover:to-gray-100"
        @click="$emit('update:modelValue', false)"
      >
        <i class="fa fa-close"></i>
      </button>
      <!-- Modal content -->
      <div
        class="z-40 flex flex-col w-full h-full p-3 overflow-auto bg-white rounded-lg shadow-xl sm:p-6"
      >
        <!-- Form content -->
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    modelValue: Boolean,
  },
};
</script>