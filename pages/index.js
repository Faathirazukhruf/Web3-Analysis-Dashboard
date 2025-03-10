import { useState } from 'react';
import CryptoPriceTable from '../components/CryptoPriceTable';
import AirdropList from '../components/AirdropList';
import ConnectWalletButton from '../components/ConnectWalletButton';
import AIAnalysisComponent from '../components/AIAnalysisComponent';
import { FiBriefcase, FiGlobe, FiGithub } from 'react-icons/fi';

export default function Home() {
  const [selectedCoin, setSelectedCoin] = useState(null);

  const handleSelectCoin = (coin) => {
    setSelectedCoin(coin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-web3-dark to-slate-900">
      <header className="border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-web3-primary via-web3-secondary to-web3-accent">
                Web3 Analysis Dashboard
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <a href="https://github.com/Faathirazukhruf" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FiGithub />
              </a>
              <a href="https://portfolio-faathir.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FiGlobe />
              </a>
              <a href="https://defi.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FiBriefcase />
              </a>
            </nav>
          </div>
        </div>
        <p className="text-xs text-white opacity-70 mt-1 pl-14">created by faathirazukhruf</p>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
  <CryptoPriceTable onSelectCoin={handleSelectCoin} />
  <div id="ai-analysis-component">
    <AIAnalysisComponent selectedCoin={selectedCoin} />
  </div>
</div>
          
          {/* Sidebar - 1/3 width on large screens */}
          <div className="space-y-6">
            <ConnectWalletButton />
            <AirdropList />
          </div>
        </div>
      </main>
      
      <footer className="bg-slate-800 border-t border-slate-700 py-6">
  <div className="container mx-auto px-4">
    <div className="text-center">
      <p className="text-sm text-gray-400">
        © 2025 Web3 Analysis Dashboard. Created by Faathirazukhruf.
      </p>
      <p className="text-sm text-gray-400 mt-2">
        Powered by Next.js and CoinGecko API.
      </p>
    </div>
  </div>
</footer>
    </div>
  );
}