<template>
  <div class="flex flex-wrap p-3 justify-between sm:justify-end">
    <router-link
      class="
        py-1
        px-2
        shadow-sm
        bg-gradient-to-b
        from-blue-100
        to-blue-300
        hover:from-blue-50
        hover:to-blue-200
        border border-blue-400
        hover:border-blue-300
        transform
        -skew-x-12
      "
      to="/"
    >
      Players
    </router-link>
    <router-link
      class="
        py-1
        px-2
        shadow-sm
        bg-gradient-to-b
        from-blue-100
        to-blue-300
        hover:from-blue-50
        hover:to-blue-200
        border border-blue-400
        hover:border-blue-300
        transform
        -skew-x-12
      "
      to="/plays"
    >
      Plays
    </router-link>
    <router-link
      class="
        py-1
        px-2
        shadow-sm
        bg-gradient-to-b
        from-blue-100
        to-blue-300
        hover:from-blue-50
        hover:to-blue-200
        border border-blue-400
        hover:border-blue-300
        transform
        -skew-x-12
      "
      to="/hero"
    >
      Heroes
    </router-link>
    <router-link
      class="
        py-1
        px-2
        shadow-sm
        bg-gradient-to-b
        from-blue-100
        to-blue-300
        hover:from-blue-50
        hover:to-blue-200
        border border-blue-400
        hover:border-blue-300
        transform
        -skew-x-12
      "
      to="/lotery"
    >
      Lotery
    </router-link>
    <router-link
      class="
        py-1
        px-2
        shadow-sm
        bg-gradient-to-b
        from-blue-100
        to-blue-300
        hover:from-blue-50
        hover:to-blue-200
        border border-blue-400
        hover:border-blue-300
        transform
        -skew-x-12
      "
      to="/tournament"
    >
      Tournament
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.router-link-exact-active {
  @apply from-green-50 to-green-200 border-green-400;
}
</style>
