import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { FiLink, FiUnlink } from 'react-icons/fi';

const ConnectWalletButton = () => {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const account = accounts[0];
            setAccount(account);
            await fetchBalance(account);
          }
        } catch (err) {
          console.error('Error checking wallet connection:', err);
        }
      }
    };

    checkConnection();
  }, []);

  // Handle account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          fetchBalance(accounts[0]);
        } else {
          setAccount('');
          setBalance('');
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  const fetchBalance = async (address) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance));
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('Ethereum wallet not detected. Please install MetaMask.');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        await fetchBalance(accounts[0]);
      }
    } catch (err) {
      if (err.code === 4001) {
        setError('Connection request rejected. Please try again.');
      } else {
        setError('Failed to connect wallet. Please try again.');
        console.error('Wallet connection error:', err);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setBalance('');
  };

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}
      
      {!account ? (
        <button 
          onClick={connectWallet} 
          disabled={isConnecting}
          className={`btn-primary w-full flex items-center justify-center ${isConnecting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <FiLink className="mr-2" />
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div>
          <div className="bg-slate-700 rounded-lg p-3 mb-4">
            <div className="mb-2">
              <div className="text-sm text-gray-400">Connected Address</div>
              <div className="font-mono">{formatAddress(account)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">ETH Balance</div>
              <div className="font-mono">{parseFloat(balance).toFixed(4)} ETH</div>
            </div>
          </div>
          <button 
            onClick={disconnectWallet}
            className="btn-secondary w-full flex items-center justify-center"
          >
            <FiUnlink className="mr-2" />
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default ConnectWalletButton;