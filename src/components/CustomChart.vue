<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import LineChart from "@/components/LineChart.vue";
import type { ChartData, ChartOptions } from "chart.js";

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  historicalData: any[];
}>();

const screenWidth = ref(window.innerWidth);

const chartData = computed<ChartData<"line">>(() => {
  if (!props.historicalData || props.historicalData.length === 0) {
    return {
      labels: [],
      datasets: [{ label: 'Price', data: [] }]
    };
  }

  const labels = props.historicalData.map(item => item.date); // Dates for x-axis
  const data = props.historicalData.map(item => item.close); // Close prices for y-axis

  return {
    labels,
    datasets: [
      {
        label: "Price",
        data,
        borderColor: "green",
        backgroundColor: "rgba(144, 238, 144, 0.3)",
        borderWidth: 2,
        tension: 0.1,
        fill: true,
      },
    ],
  };
});

const updateWidth = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", updateWidth);
});
onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
});

// Chart options
const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    x: {
      grid: {
        display: false, // Hide gridlines
      },
      ticks: {
        display: screenWidth.value > 600, // Hide x-axis labels if ≤ 600px
      },
    },
    y: {
      grid: {
        display: false, // Hide gridlines
      },
      ticks: {
        display: false, // Hide y-axis labels
      },
    },
  },
};
</script>

<template>
  <div class="chart-container">
    <!-- Chart -->
    <div class="line-chart-wrapper">
      <LineChart :chartData="chartData" :chartOptions="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
}

.chart-container .line-chart-wrapper {
  height: 450px;
}

@media (max-width: 420px) {
  .chart-container .line-chart-wrapper {
    height: 200px !important;
  }
}

.chart-container canvas {
  width: 100% !important;
  height: 450px;
}
</style>
