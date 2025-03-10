import { useState, useEffect } from 'react';
import { getAIAnalysis } from '../utils/api';
import { FiBarChart2, FiTrendingUp, FiTrendingDown, FiAlertCircle } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AIAnalysisComponent = ({ selectedCoin }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedCoin) {
      fetchAnalysis(selectedCoin.id);
    }
  }, [selectedCoin]);

  const fetchAnalysis = async (coinId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAIAnalysis(coinId);
      setAnalysis(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch AI analysis');
      setLoading(false);
    }
  };

  if (!selectedCoin) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">AI Market Analysis</h2>
        <div className="h-64 flex flex-col items-center justify-center">
          <FiBarChart2 className="text-4xl text-web3-primary mb-2" />
          <p className="text-gray-400">Select a cryptocurrency from the table for AI analysis</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card animate-pulse">
        <h2 className="text-xl font-semibold mb-4">AI Market Analysis: {selectedCoin.name}</h2>
        <div className="h-64 flex items-center justify-center">
          <div className="text-web3-primary">Analyzing...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">AI Market Analysis: {selectedCoin.name}</h2>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  // Format price history data for chart
  const chartData = analysis.priceHistory.map((item, index) => ({
    name: `Day ${index + 1}`,
    price: item
  }));

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">
        AI Market Analysis: {selectedCoin.name}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-700 p-3 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Sentiment Score</div>
          <div className="flex items-center">
            <div 
              className={`text-xl font-bold ${
                analysis.sentiment > 0 ? 'text-green-500' : 
                analysis.sentiment < 0 ? 'text-red-500' : 'text-yellow-500'
              }`}
            >
              {analysis.sentiment.toFixed(2)}
            </div>
            <div className="ml-2">
              {analysis.sentiment > 0.3 ? (
                <FiTrendingUp className="text-green-500" />
              ) : analysis.sentiment < -0.3 ? (
                <FiTrendingDown className="text-red-500" />
              ) : (
                <FiAlertCircle className="text-yellow-500" />
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-slate-700 p-3 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Prediction (7 Days)</div>
          <div className="flex items-center">
            <div 
              className={`text-xl font-bold ${
                analysis.prediction > 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {analysis.prediction > 0 ? '+' : ''}{analysis.prediction.toFixed(2)}%
            </div>
            <div className="ml-2">
              {analysis.prediction > 0 ? (
                <FiTrendingUp className="text-green-500" />
              ) : (
                <FiTrendingDown className="text-red-500" />
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                borderColor: '#374151',
                color: '#e5e7eb'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#06b6d4" 
              strokeWidth={2}
              dot={{ fill: '#06b6d4', r: 4 }}
              activeDot={{ fill: '#f472b6', r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-slate-700 p-3 rounded-lg">
        <h3 className="font-semibold mb-2">Analysis Summary</h3>
        <p className="text-sm text-gray-300">{analysis.summary}</p>
      </div>
    </div>
  );
};

export default AIAnalysisComponent;