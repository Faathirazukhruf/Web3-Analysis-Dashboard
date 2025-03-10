import { useState, useEffect } from 'react';
import { fetchAirdrops } from '../utils/api';
import { FiExternalLink, FiClock } from 'react-icons/fi';

const AirdropList = () => {
  const [airdrops, setAirdrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchAirdrops();
        setAirdrops(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch airdrop data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="card animate-pulse">
        <h2 className="text-xl font-semibold mb-4">Latest Airdrops</h2>
        <div className="h-64 flex items-center justify-center">
          <div className="text-web3-primary">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Latest Airdrops</h2>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Latest Airdrops</h2>
      <div className="space-y-4">
        {airdrops.map((airdrop) => (
          <div key={airdrop.id} className="p-3 bg-slate-700 rounded-lg hover:glow-border transition-all duration-300">
            <div className="flex items-start">
              {airdrop.logo && (
                <img src={airdrop.logo} alt={airdrop.name} className="w-12 h-12 rounded-full mr-4" />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{airdrop.name}</h3>
                <p className="text-sm text-gray-300 line-clamp-2 mb-2">{airdrop.description}</p>
                <div className="flex items-center text-xs text-gray-400 mb-2">
                  <FiClock className="mr-1" />
                  <span>{airdrop.endDate || 'Ongoing'}</span>
                </div>
                <div className="flex space-x-2">
                  <a 
                    href={airdrop.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary text-xs flex items-center"
                  >
                    More Info <FiExternalLink className="ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AirdropList;