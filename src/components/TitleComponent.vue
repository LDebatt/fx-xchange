<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="top-title">
    <h1 class="team-color">{{ msg }}</h1>
    <h3>
      Check out the current price for a currency pair
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: bold;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
  font-weight: 600;
}

.top-title h1,
.top-title h3 {
  text-align: center;
}

@media (min-width: 1160px) {
  .top-title h1,
  .top-title h3 {
    text-align: left;
  }
}
</style>
