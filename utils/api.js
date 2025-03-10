import axios from 'axios';

// Base URL for API calls
const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-url.vercel.app/api' 
  : 'http://localhost:3000/api';

// Fetch crypto prices
export const fetchCryptoPrices = async () => {
  try {
    const response = await axios.get(`${baseUrl}/crypto-prices`);
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    throw error;
  }
};

// Fetch airdrops
export const fetchAirdrops = async () => {
  try {
    const response = await axios.get(`${baseUrl}/airdrops`);
    return response.data;
  } catch (error) {
    console.error('Error fetching airdrops:', error);
    throw error;
  }
};

// Get AI analysis for a specific coin
export const getAIAnalysis = async (coinId) => {
  try {
    const response = await axios.post(`${baseUrl}/ai-analysis`, { coinId });
    return response.data;
  } catch (error) {
    console.error('Error getting AI analysis:', error);
    throw error;
  }
};