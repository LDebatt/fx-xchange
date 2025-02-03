<template>
  <div class="currency-selector">
    <select
      id="currency-dropdown"
      v-model="localSelectedCurrency"
      @change="onSelectionChange"
      class="currency-select"
    >
      <option v-for="(currencyName, currencyCode) in options" :key="currencyCode" :value="currencyCode">
        {{ currencyCode }} - {{ currencyName }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';


defineProps({
  options: Object,
  selectedOption: String,
});

const emit = defineEmits<{
  (e: 'updateSelection', currencyCode: string): void;
}>();

const localSelectedCurrency = ref<string>('');

const onSelectionChange = () => {
  emit('updateSelection', localSelectedCurrency.value);
};
</script>


<style scoped>
.currency-selector {
  max-width: 300px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.currency-select {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  color: #333;
  background-color: #f7f7f7;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.currency-select:focus {
  border-color: #4a90e2;
  background-color: #fff;
  outline: none;
}

.currency-select option {
  padding: 10px;
  font-size: 1rem;
  background-color: #fff;
  color: #333;
}

.currency-select option:hover {
  background-color: #e6f7ff;
}
</style>
