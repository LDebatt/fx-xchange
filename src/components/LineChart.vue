<script setup lang="ts">
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
} from "chart.js";
import { Chart } from "vue-chartjs";
import type { ChartData, ChartOptions } from "chart.js";

ChartJS.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Title);

defineProps<{
  chartData: ChartData<"line">;
  chartOptions?: ChartOptions<"line">;
}>();
</script>

<template>
  <Chart type="line" :data="chartData" :options="chartOptions" />
</template>
