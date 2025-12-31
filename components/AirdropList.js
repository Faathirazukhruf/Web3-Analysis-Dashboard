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
    <div className="card backdrop-blur-md bg-slate-800/80 border-slate-700/50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-web3-primary to-blue-400 bg-clip-text text-transparent">
          Latest Airdrops
        </h2>
        <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[10px] uppercase font-bold text-green-500 tracking-wider">Live Feed</span>
        </div>
      </div>

      <div className="space-y-4">
        {airdrops.map((airdrop, index) => (
          <div
            key={airdrop.id}
            className="group relative overflow-hidden p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50 hover:border-web3-primary/60 hover:bg-slate-700/60 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(56,189,248,0.2)]"
            style={{
              animationDelay: `${index * 150}ms`,
              animation: 'premiumFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              opacity: 0
            }}
          >
            {/* Shine Effect Overlay */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg]"></div>

            <div className="flex items-center relative z-10">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-web3-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {airdrop.logo && (
                  <img
                    src={airdrop.logo}
                    alt={airdrop.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-700 group-hover:border-web3-primary/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-2xl"
                  />
                )}
                <div className="absolute -bottom-2 -right-2 bg-web3-primary rounded-xl p-1.5 text-[10px] text-white shadow-lg border border-slate-800 group-hover:rotate-12 transition-transform">
                  <FiClock className="animate-spin-slow" />
                </div>
              </div>

              <div className="flex-1 ml-5 overflow-hidden">
                <div className="flex justify-between items-start">
                  <h3 className="font-extrabold text-white text-lg group-hover:text-web3-primary transition-colors truncate tracking-tight">
                    {airdrop.name}
                  </h3>
                  <span className="text-[9px] font-black bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-700 text-web3-primary shrink-0 uppercase tracking-widest">
                    {airdrop.endDate}
                  </span>
                </div>

                <p className="text-xs text-gray-400 line-clamp-1 mt-1 font-medium italic group-hover:text-gray-300 transition-colors">
                  {airdrop.description}
                </p>

                <div className="mt-3 flex justify-end">
                  <a
                    href={airdrop.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[10px] font-black text-web3-primary hover:text-white transition-all group-hover:tracking-[0.1em] uppercase"
                  >
                    Get Access <FiExternalLink className="ml-1.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes premiumFadeIn {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        :global(.animate-spin-slow) {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AirdropList;