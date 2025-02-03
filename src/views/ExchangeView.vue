<template>
  <div >
    <div class="header">
      <div  class="selection">
        <Dropdown
          :options="currencies"
          :selectedOption="fromCurrency"
          @updateSelection="updateFromCurrency"
        />
        <span></span>
        <Dropdown
          :options="currencies"
          :selectedOption="toCurrency"
          @updateSelection="updateToCurrency"
        />
      </div>
    </div>

    <div v-if="rateData">
      <div class="container" >
        <div class="left">
          <div>
            <span :class="fromCurrencyFlagClass" class="flag"></span>
            <span :class="toCurrencyFlagClass" class="flag"></span>
          </div>
          <h1>{{ fromCurrency }}/{{ toCurrency }}</h1>
        </div>

        <div class="right">
          <div class="rate-display">
            <p class="price">
              {{ getCurrencySymbol(toCurrency) }} {{ currentPrice }}
            </p>
            <p :class="{'positive-change': priceChange >= 0, 'negative-change': priceChange < 0}" class="change">
              {{ priceChange.toFixed(6) }} ({{ percentageChange.toFixed(4) }}%)
            </p>
          </div>
        </div>
      </div>

      <Chart :historicalData="historicalData"/>

      <div class="time-buttons">
        <button
          v-for="time in timeFrames"
          :key="time"
          :class="{ active: selectedTime === time }"
          @click="selectTimeFrame(time)"
        >
          {{ time }}
        </button>
      </div>
    </div>
    <div v-else class="loading">Loading...</div>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, watchEffect } from 'vue'
import { getLiveCurrencies, getLiveExchangeRate } from '@/services/CurrencyApiService'
import { getHistoricalRates } from '@/services/ChartApiService'
import { useWebSocket } from "@/services/WebsocketService";
import Dropdown from '@/components/CustomDropdown.vue'
import Chart from '@/components/CustomChart.vue'

interface ExchangeRateData {
  price: number | null
  change: number | null
  fromCurrency?: string
  toCurrency?: string
  error?: string
}

interface HistoricalRate {
  close: number;
  timestamp?: string;
}

const currencies = ref<string[]>([]);
const fromCurrency = ref('EUR'); // Default from mockup
const toCurrency = ref('USD'); // Default to from mockup
const rateData = ref<ExchangeRateData | null>(null);
const selectedTime = ref('15M');
const timeFrames = ['15M', '1H', '1D', '1W', '1M'];
const historicalData = ref<HistoricalRate[]>([]);
const { exchangeRates } = useWebSocket(`${fromCurrency.value}${toCurrency.value}`);
const currentPrice = ref(0);
const priceChange = ref(0);
const percentageChange = ref(0);
let fromCurrencyFlagClass: unknown
let toCurrencyFlagClass: unknown


const getCurrencySymbol = (currencyCode: string | undefined): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode
  });
  const formatted = formatter.format(0);
  return formatted.replace(/\d/g, '').trim().replace(/\.$/, '');
}

const fetchCurrencyData = async () => {
  try {
    const data = await getLiveCurrencies()
    currencies.value = data.available_currencies
  } catch (error) {
    console.error('Failed to fetch currencies:', error)
  }
}

const fetchRate = async () => {
  rateData.value = null
  try {
    fromCurrencyFlagClass = computed(
      () => `currency-flag currency-flag-${fromCurrency.value.toLowerCase()}`,
    )
    toCurrencyFlagClass = computed(
      () => `currency-flag currency-flag-${toCurrency.value.toLowerCase()}`,
    )
    const data = await getLiveExchangeRate(fromCurrency.value, toCurrency.value)
    rateData.value = {
      price: Number(data.price),
      change: Number(data.change),
    }
    currentPrice.value = Number(data.price);
  } catch (error) {
    console.error('Failed to fetch rate:', error)
    rateData.value = {
      price: null,
      change: null,
      error: 'Failed to load rate.',
    }
  }
}

onMounted(() => {
  fetchCurrencyData()
  fetchRate()
  selectTimeFrame(selectedTime.value)
})

// watch([fromCurrency, toCurrency], fetchRate)
watch([fromCurrency, toCurrency], () => {
  if (fromCurrency.value && toCurrency.value) {
    sendMessage({ symbol: `${fromCurrency.value}${toCurrency.value}` });
  }
});

// Watch for price updates
// watch(exchangeRates, (newRates) => {
//   debugger;
//   const symbol = `${fromCurrency.value}${toCurrency.value}`;
//   if (newRates[symbol]) {
//     currentPrice.value = newRates[symbol].mid;
//   }
// });

watchEffect(() => {
  const symbol = `${fromCurrency.value}${toCurrency.value}`;
  if (exchangeRates.value[symbol]) {
    currentPrice.value = exchangeRates.value[symbol].mid;
  }
});

const { sendMessage } = useWebSocket(`${fromCurrency.value}${toCurrency.value}`);

const updateFromCurrency = (symbol: string) => {
  fromCurrency.value = symbol;
  selectTimeFrame();
  sendMessage({ symbol: `${fromCurrency.value}${toCurrency.value}` });
};

const updateToCurrency = (symbol: string) => {
  toCurrency.value = symbol;
  selectTimeFrame();
  sendMessage({ symbol: `${fromCurrency.value}${toCurrency.value}` });
};

const selectTimeFrame = async (time?: string) => {
  if (time) {
    selectedTime.value = time;
  }

  const data = await getHistoricalRates(fromCurrency.value, toCurrency.value, selectedTime.value);
  historicalData.value = data as HistoricalRate[];
  updatePriceDisplay();
}

const updatePriceDisplay = () => {
  if (historicalData.value && historicalData.value.length > 0) {
    const latestQuote = historicalData.value[historicalData.value.length - 1];
    currentPrice.value = latestQuote.close;

    const firstQuote = historicalData.value[0];
    priceChange.value = latestQuote.close - firstQuote.close;
    percentageChange.value = (priceChange.value / firstQuote.close) * 100;
  }
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 20px;
}

.selection {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.selection span {
  margin: 0 10px;
}

/* chart header */
.container {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* flags styling */
.flag {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  margin: 0 0.4rem;
  display: inline-block;
}

.left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.right {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}



h1 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 0;
}

.rate-display {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.price {
  font-size: 2rem;
  font-weight: 700;
}

.change {
  font-size: 1rem;
  font-weight: 600;
}

.positive-change {
  color: rgb(36, 114, 36);
}

.negative-change {
  color: rgb(180, 57, 41);
}

.loading {
  font-size: 1rem;
  font-weight: 500;
}

/* button styling */
.time-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap;
}

.time-buttons button {
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 25px;
  border: 2px solid var(--vt-c-indigo);
  background-color: var(--vt-c-white);
  color: var(--color-heading);
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.time-buttons button:hover {
  background-color: var(--color-heading);
  color: var(--vt-c-white);
  border-color: var(--vt-c-indigo);
}

.time-buttons button.active {
  background-color: var(--color-heading);
  color: var(--vt-c-white);
  border-color: var(--vt-c-indigo);
}

.time-buttons button:focus {
  outline: none;
}

@media (max-width: 420px) {
  .time-buttons {
    gap: 5px;
    margin-top: 10px;
  }

  .time-buttons button {
    padding: 6px 12px;  /* Reduce padding */
    font-size: 0.8rem;  /* Smaller font size */
    border-radius: 15px; /* Smaller border radius */
    min-width: 80px; /* Reduce minimum width */
  }

  .flag {
    width: 2rem;
    height: 2rem;
  }

  .price {
    font-size: 1.5rem;
  }
}
</style>
