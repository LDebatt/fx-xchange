# About Forex Exchange APP

## Overview

FX Exchange responsive web application designed for real-time **foreign exchange (FX) rate tracking and analysis**.
Built with **Vue 3 and TypeScript**, the platform provides **live market data**.

The application integrates with **TraderMade's API** for **real-time exchange rates**,
leveraging **WebSockets** for instant price updates and a **charting library** for data visualization.

---

## Key Features

**Live Exchange Rates** – Stream real-time currency values via WebSockets.  
**Historical Data** – Access time-series data to analyze market trends.  
**Interactive Charting** – Visualize FX rate fluctuations with professional charts.  
**Custom Currency Selection** – Compare any currency pairs dynamically.  
**Mobile-Responsive Design** – Optimized for all screen sizes.

---

## Technology Stack

- **Frontend:** Vue 3 + TypeScript
- **Data Fetching:** TraderMade API (REST + WebSocket)
- **State Management:** Vue's Composition API
- **Charting Library:** Chart.js
- **Build Tool:** Vite
- **IDE:** Visual Studio Code

---

## Core Components

### 1. ExchangeView.vue

- The main interface for selecting currency pairs and timeframes.
- Fetches **live exchange rates** and **historical data** via the API.

### 2. APIservice.ts & ChartAPIService.ts

- Manages **REST API calls** to fetch exchange rates and historical trends.
- Includes functions like `getLiveExchangeRate()` and `getHistoricalRates()`.
- And the Chart data

### 3. WebSocketService.ts

- Establishes a **real-time WebSocket connection** for live price updates.
- Handles **subscription to currency pairs** and automatic reconnections.

### 4. Dropdown.vue

- Custom dropdown for **currency selection**.
- Dynamically updates based on available currency pairs.

### 5. MyChart.vue & LineChart.vue

- Displays **historical exchange rates** using an interactive **charting library**.
- Supports **multiple timeframes** 15M, 1H, 1D, 1W, 1M **As Instructed**.

---

## Developer's Note

As the developer behind this project, I want to address a few important points:

1. **WebSocket Implementation**:  
   The WebSocket connection has been developed, but the live data from the WebSocket service is not currently functional due to the connection being down or unresponsive. Once the connection is stable, real-time pricing updates will be available.

2. **Dropdown of Exchanges**:  
   The instructions called for a dropdown to select different exchanges. Unfortunately, this couldn't be implemented as planned, since the **TraderMade API** does not provide data on available exchanges at this time. Without this data.

3. **Charting Data Delay**:  
   The data being returned for historical charts is often **2 to 3 days old**. This delay is a result of the API's limitations on data freshness. As such, the chart reflects historical trends, but it may not always represent the most current market conditions.

Despite these limitations, I’ve made sure that the core functionalities work as expected.

---
