import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL =  import.meta.env.VITE_API_URL;

export const getLiveCurrencies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}live_currencies_list`, {
      params: { api_key: API_KEY },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching live currencies:", error);
    throw error;
  }
};

export const getLiveExchangeRate = async (from: string, to: string, amount: number = 1) => { // Added amount parameter
  try {
    const response = await axios.get(`${BASE_URL}convert`, {
      params: { api_key: API_KEY, from: from, to: to, amount: amount }, // Correct parameters
    });
    // Access the rate from the response.  Adjust if the API response structure is different.
    if (response.data) { // Check if 'result' exists
      return {
        price: response.data.total, // Access the 'result' property

        change: amount, // Placeholder (calculate if needed)
      };
    } else {
      console.error("Invalid data from API:", response.data); // Log the actual response for debugging
      throw new Error("Invalid data from API");
    }

  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    throw error;
  }
};
