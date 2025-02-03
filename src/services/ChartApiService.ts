import axios from 'axios'

const API_KEY = import.meta.env.VITE_API_KEY
const BASE_URL = import.meta.env.VITE_API_URL

export const getHistoricalRates = async (
  fromCurrency: string,
  toCurrency: string,
  selectedTime: string,
) => {
  try {
    const currencyPair = `${fromCurrency}${toCurrency}`
    const now = new Date()
    let startDate: Date
    let interval: string
    let period: number | undefined

    // Set start & end dates based on selectedTime
    switch (selectedTime) {
      case '15M':
        interval = 'minute'
        period = 1
        startDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
        break
      case '1H':
        interval = 'minute'
        startDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
        period = 10
        break
      case '1D':
        interval = 'hourly'
        startDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
        period = 2
        break
      case '1W':
        interval = 'daily'
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '1M':
        interval = 'daily'
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      default:
        throw new Error(`Invalid selectedTime: ${selectedTime}`)
    }

    // Format dates as YYYY-MM-DD or YYYY-MM-DD-HH:MM
    const formatDate = (date: Date, includeTime = false) => {
      const pad = (num: number) => String(num).padStart(2, '0')
      const year = date.getUTCFullYear()
      const month = pad(date.getUTCMonth() + 1)
      const day = pad(date.getUTCDate())
      if (includeTime) {
        const hours = pad(date.getUTCHours())
        const minutes = pad(date.getUTCMinutes())
        return `${year}-${month}-${day}-${hours}:${minutes}`
      }
      return `${year}-${month}-${day}`
    }

    const endDate = formatDate(now, interval !== 'daily')
    const formattedStartDate = formatDate(startDate, interval !== 'daily')

    const params: Record<string, string> = {
      currency: currencyPair,
      api_key: API_KEY,
      start_date: formattedStartDate,
      end_date: endDate,
      format: 'records',
      interval,
    }

    if (interval === 'minute' || (interval === 'hourly' && period !== undefined)) {
      if (period) {
        params['period'] = period.toString()
      }
    }


    const response = await axios.get(`${BASE_URL}timeseries`, { params })
    let quotes = response.data.quotes;

    if (selectedTime === '15M' && quotes && quotes.length > 15) {
      quotes = quotes.slice(-15); // Get the last 15 elements X 1min = 15min
    } else if (selectedTime === '1H' && quotes && quotes.length > 6) {
      quotes = quotes.slice(-6); // Get the last 6 elements representing 6 X 10min = 1hr
    }

    return quotes
  } catch (error) {
    console.error('Failed to fetch historical rates:', error)
    return []
  }
}
