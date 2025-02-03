import { ref, onUnmounted } from "vue";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL; // WebSocket URL
const STREAMING_API_KEY = import.meta.env.VITE_SOCKET_KEY; // Replace with your API key

export function useWebSocket(symbols: string[]) {
  const socket = ref<WebSocket | null>(null);
  const exchangeRates = ref<Record<string, { bid: number; ask: number; mid: number }>>({});

  const connect = () => {
    if (socket.value) return; // Prevent multiple connections

    socket.value = new WebSocket(SOCKET_URL);

    socket.value.onopen = () => {
      console.log("WebSocket connected!");
      socket.value?.send(JSON.stringify({ userKey: STREAMING_API_KEY }));
      // Authenticate
      symbols.forEach(symbol => {
        socket.value?.send(JSON.stringify({ symbol } ));
      });
    };

    socket.value.onmessage = (event) => {
      try {
        if (event.data !== 'Connected') {
          const data = JSON.parse(event.data);
          if (data.symbol) {
            exchangeRates.value[data.symbol] = {
              bid: data.bid,
              ask: data.ask,
              mid: data.mid,
            };
          }
        }
      } catch (error) {
        console.error("WebSocket message parsing error:", error);
      }
    };

    socket.value.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.value.onclose = () => {
      console.warn("WebSocket disconnected, attempting reconnect...");
      setTimeout(connect, 5000); // Reconnect after 5 seconds
    };
  };

  const disconnect = () => {
    socket.value?.close();
    socket.value = null;
  };

  // Connect WebSocket on service usage
  connect();

  // Cleanup on component unmount
  onUnmounted(disconnect);

  return { exchangeRates, disconnect };
}
