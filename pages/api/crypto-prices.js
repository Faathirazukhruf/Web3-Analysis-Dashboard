import axios from 'axios';

// Simple in-memory cache
let cachedData = null;
let lastFetchTime = null;
const CACHE_DURATION = 60 * 1000; // 1 minute cache

// Rate limiting configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if we have cached data that's still fresh
    const now = Date.now();
    if (cachedData && lastFetchTime && (now - lastFetchTime < CACHE_DURATION)) {
      return res.status(200).json(cachedData);
    }

    // Function to fetch with retry logic
    const fetchWithRetry = async (retryCount = 0) => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets', 
          {
            params: {
              vs_currency: 'usd',
              order: 'market_cap_desc',
              per_page: 10,
              page: 1,
              sparkline: false,
              price_change_percentage: '24h'
            },
            // Add timeout to prevent hanging requests
            timeout: 5000,
            // Add headers to identify your application (good API practice)
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Your-App-Name/1.0'
            }
          }
        );
        
        // Update cache
        cachedData = response.data;
        lastFetchTime = Date.now();
        
        return response.data;
      } catch (error) {
        // Check if we should retry
        if (retryCount < MAX_RETRIES) {
          if (error.response && error.response.status === 429) {
            // Rate limited - wait longer before retry
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * 2));
          } else {
            // Other error - use standard retry delay
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          }
          
          // Recursive retry with incremented count
          return fetchWithRetry(retryCount + 1);
        }
        
        // If we've exhausted retries or it's not a rate limit issue, throw the error
        throw error;
      }
    };

    // Attempt to fetch data with retry logic
    const data = await fetchWithRetry();
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    
    // Return cached data if available, even if stale
    if (cachedData) {
      return res.status(200).json({
        data: cachedData,
        notice: "Showing cached data due to API error"
      });
    }
    
    // If no cached data, return fallback data
    return res.status(500).json({ 
      message: 'Failed to fetch cryptocurrency data',
      error: error.message,
      fallbackData: [
        {
          id: "bitcoin",
          symbol: "btc",
          name: "Bitcoin",
          current_price: 0,
          market_cap: 0,
          price_change_percentage_24h: 0,
          last_updated: new Date().toISOString(),
          image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
        },
        {
          id: "ethereum",
          symbol: "eth",
          name: "Ethereum",
          current_price: 0,
          market_cap: 0,
          price_change_percentage_24h: 0,
          last_updated: new Date().toISOString(),
          image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png"
        }
      ]
    });
  }
}