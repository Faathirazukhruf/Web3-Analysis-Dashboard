import { useState, useEffect } from 'react';
import { getAIAnalysis } from '../utils/api';
import { FiBarChart2, FiTrendingUp, FiTrendingDown, FiAlertCircle, FiInfo, FiActivity } from 'react-icons/fi';
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
          <div className="text-web3-primary">Analyzing market data (90-day history)...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">AI Market Analysis: {selectedCoin.name}</h2>
        <div className="text-red-500 bg-red-900/20 p-4 rounded-lg flex items-center">
          <FiAlertCircle className="mr-2" />
          {error}
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  // Format data for chart (if specific history provided, otherwise standard price)
  // Since we don't have detailed history in the NEW response, we might skipping charting 
  // OR we can visualize the CONFIDENCE INTERVAL or just show the prediction.
  // For now, let's focus on the transparency UI as the user requested.

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          AI Market Analysis: {selectedCoin.name}
        </h2>
        <div className="text-xs text-gray-500 flex items-center">
          <span className={`w-2 h-2 rounded-full mr-1 ${analysis.metadata?.is_cached ? 'bg-green-500' : 'bg-blue-500'}`}></span>
          {analysis.metadata?.is_cached ? 'Cached Model' : 'Live Trained'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Sentiment Card */}
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
          <div className="text-sm text-gray-400 mb-1 flex items-center">
            Sentiment Score
            <div className="group relative ml-2">
              <FiInfo className="cursor-help text-xs" />
              <div className="hidden group-hover:block absolute z-10 w-48 p-2 bg-black rounded text-xs -top-2 left-5">
                Crypto-specific sentiment analysis based on recent trends and lexicon.
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div
              className={`text-2xl font-bold ${analysis.sentiment.score > 0 ? 'text-green-500' :
                analysis.sentiment.score < 0 ? 'text-red-500' : 'text-yellow-500'
                }`}
            >
              {analysis.sentiment.score.toFixed(2)}
            </div>
            <div className="ml-3 text-sm font-medium px-2 py-1 rounded bg-slate-800">
              {analysis.sentiment.label}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2 italic">"{analysis.sentiment.analyzed_text_snippet}"</p>
        </div>

        {/* Prediction Card */}
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
          <div className="text-sm text-gray-400 mb-1 flex items-center">
            24h Prediction
            <div className="group relative ml-2">
              <FiInfo className="cursor-help text-xs" />
              <div className="hidden group-hover:block absolute z-10 w-64 p-2 bg-black rounded text-xs -top-2 left-5">
                Linear Regression model prediction for the next 24 hours based on 90 days of historical data using Momentum, RSI, and Volatility features.
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div
              className={`text-2xl font-bold ${(analysis.prediction?.percentChange || 0) > 0 ? 'text-green-500' : 'text-red-500'
                }`}
            >
              {(analysis.prediction?.percentChange || 0) > 0 ? '+' : ''}{(analysis.prediction?.percentChange || 0).toFixed(2)}%
            </div>
            <div className="ml-2">
              {(analysis.prediction?.percentChange || 0) > 0 ? (
                <FiTrendingUp className="text-green-500 text-xl" />
              ) : (
                <FiTrendingDown className="text-red-500 text-xl" />
              )}
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Target Price: <span className="text-white font-mono">${(analysis.prediction?.price || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="h-80 mb-6 bg-slate-800/50 rounded-xl p-4 border border-slate-700 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center">
          <FiBarChart2 className="mr-2 text-web3-primary" /> Price Trend & Forecast
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={[
              ...(analysis.priceHistory || []).map((price, i) => ({
                day: `Day ${i + 1}`,
                price: price,
                isForecast: false
              })),
              {
                day: 'Forecast',
                price: analysis.prediction?.price || 0,
                isForecast: true
              }
            ]}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
              domain={['auto', 'auto']}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                color: '#f8fafc',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#38bdf8"
              strokeWidth={3}
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (payload.isForecast) {
                  return <circle cx={cx} cy={cy} r={6} fill="#ec4899" stroke="#fff" strokeWidth={2} key="forecast-dot" />
                }
                return <circle cx={cx} cy={cy} r={0} fill="#38bdf8" key={`dot-${props.key}`} />
              }}
              activeDot={{ r: 6, fill: '#38bdf8', stroke: '#fff', strokeWidth: 2 }}
              strokeDasharray="5 0"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Transparency Section */}
      <div className="border-t border-slate-700 pt-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
          <FiActivity className="mr-2" /> Model Transparency
        </h3>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 block">Methodology</span>
            <span className="text-gray-300">{analysis.methodology.model}</span>

            <span className="text-gray-500 block mt-2">Features Used</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {analysis.methodology.features.map(f => (
                <span key={f} className="text-xs bg-slate-800 px-2 py-1 rounded">{f}</span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-gray-500 block">Model Accuracy (R²)</span>
            <div className="flex items-center">
              <span className={`font-bold ${analysis.accuracy.r_squared > 0.5 ? 'text-green-400' : 'text-yellow-400'}`}>
                {(analysis.accuracy.r_squared * 100).toFixed(1)}%
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1 leading-tight">
              {analysis.accuracy.explanation}
            </div>

            <span className="text-gray-500 block mt-2">Last Updated</span>
            <span className="text-gray-300 text-xs">
              {new Date(analysis.methodology.last_updated).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Honest Disclaimer */}
        <div className="mt-4 bg-yellow-900/10 border border-yellow-900/30 p-3 rounded text-xs text-yellow-500">
          <strong>Disclaimer:</strong> This is a statistical model implementation for educational purposes.
          Cryptocurrency markets are highly volatile and unpredictable.
          This tool does not constitute financial advice.
          Past performance (Training Accuracy) is not indicative of future results.
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisComponent;