import { useState, useEffect, useRef } from 'react';
import { fetchCryptoPrices } from '../utils/api';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

const CryptoPriceTable = ({ onSelectCoin }) => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchCryptoPrices();
        setCryptoData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch cryptocurrency data');
        setLoading(false);
      }
    };

    fetchData();
    // Refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectCoin = (coin) => {
    setSelectedCoin(coin.id);
    
    // Call the parent callback to update the selectedCoin in the parent component
    if (onSelectCoin) {
      onSelectCoin(coin);
    }
    
    // Find and scroll to the AIAnalysisComponent
    const analysisComponent = document.getElementById('ai-analysis-component');
    if (analysisComponent) {
      // Smooth scroll to the analysis component
      analysisComponent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="card animate-pulse">
        <h2 className="text-xl font-semibold mb-4">Top Cryptocurrencies</h2>
        <div className="h-64 flex items-center justify-center">
          <div className="text-web3-primary">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Top Cryptocurrencies</h2>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Top Cryptocurrencies</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Coin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">24h %</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Market Cap</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {cryptoData.map((coin) => (
              <tr key={coin.id} className={selectedCoin === coin.id ? "bg-slate-700" : "hover:bg-slate-700"}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{coin.market_cap_rank}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2" />
                    <div>
                      <div className="font-medium">{coin.name}</div>
                      <div className="text-gray-400 text-xs">{coin.symbol.toUpperCase()}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  ${coin.current_price.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`flex items-center ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {coin.price_change_percentage_24h >= 0 ? <FiArrowUp className="mr-1" /> : <FiArrowDown className="mr-1" />}
                    {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  ${coin.market_cap.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button 
                    onClick={() => handleSelectCoin(coin)}
                    className="text-web3-primary hover:text-web3-secondary"
                  >
                    Analyze
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoPriceTable;