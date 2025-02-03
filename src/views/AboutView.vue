<template>
  <div class="about">
    <div v-html="readmeContent"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { marked } from 'marked';

const readmeContent = ref<string>('');

onMounted(async () => {
  try {
    const response = await fetch('/README.md');
    const text = await response.text();
    const html = marked(text);
    if (html instanceof Promise) {
      readmeContent.value = await html;
    } else {
      readmeContent.value = html;
    }
  } catch (error) {
    console.error('Failed to load README.md:', error);
    readmeContent.value = 'Error loading README.md';
  }
});
</script>

<style>
@media (min-width: 1160px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
