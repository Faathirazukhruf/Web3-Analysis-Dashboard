import axios from 'axios';
import * as cheerio from 'cheerio';

// In-memory cache
let cachedAirdrops = null;
let lastFetchTime = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour/60 mins

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const now = Date.now();
  if (cachedAirdrops && lastFetchTime && (now - lastFetchTime < CACHE_DURATION)) {
    return res.status(200).json(cachedAirdrops);
  }

  try {
    const response = await axios.get('https://airdrops.io/latest/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 5000
    });

    const $ = cheerio.load(response.data);
    const airdrops = [];

    $('article').each((i, el) => {
      if (airdrops.length >= 6) return;

      const name = $(el).find('h3').text().trim();
      const url = $(el).find('a').attr('href');
      const imgTag = $(el).find('img');
      const logo = imgTag.attr('data-src') || imgTag.attr('src');
      const description = $(el).find('.front-drop-list .est-value span').text().trim() || 'Check requirements';
      const status = $(el).find('.droptemp span').text().trim() || 'Active';

      if (name && url && url.startsWith('http')) {
        airdrops.push({
          id: `airdrop-${i}-${Date.now()}`,
          name,
          description,
          url,
          logo: logo && logo.startsWith('http') ? logo : (logo ? 'https://airdrops.io' + logo : 'https://via.placeholder.com/150?text=Web3'),
          endDate: status.includes('°') ? `Hot: ${status}` : status
        });
      }
    });

    if (airdrops.length === 0) throw new Error("No airdrops found with selector");

    cachedAirdrops = airdrops;
    lastFetchTime = now;

    return res.status(200).json(airdrops);
  } catch (error) {
    console.error('Error fetching airdrops:', error.message);

    // Fallback Mock Data
    const fallbackAirdrops = [
      {
        id: 'fb-1',
        name: 'Monad Testnet',
        description: 'High-performance blockchain designed for scalability',
        url: 'https://testnet.monad.xyz/',
        logo: 'https://via.placeholder.com/150?text=Monad',
        endDate: 'Ongoing'
      },
      {
        id: 'fb-2',
        name: 'Berachain',
        description: 'DeFi-focused L1 blockchain built on Cosmos SDK',
        url: 'https://berachain.com/',
        logo: 'https://via.placeholder.com/150?text=Bera',
        endDate: 'Testnet'
      }
    ];

    if (cachedAirdrops) return res.status(200).json(cachedAirdrops);
    return res.status(200).json(fallbackAirdrops);
  }
}