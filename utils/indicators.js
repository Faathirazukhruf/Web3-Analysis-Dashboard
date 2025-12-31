/**
 * Technical Analysis Indicators
 * 
 * Provides functions to calculate common trading indicators:
 * - SMA (Simple Moving Average)
 * - EMA (Exponential Moving Average)
 * - RSI (Relative Strength Index)
 * - MACD (Moving Average Convergence Divergence)
 * - Bollinger Bands
 * - Volatility
 */

// Calculate Simple Moving Average
// Calculate Simple Moving Average (Aligned with input, padded with nulls)
export const calculateSMA = (data, period) => {
  if (data.length < period) return new Array(data.length).fill(null);

  const sma = new Array(data.length).fill(null);

  // Calculate SMA starting from index = period - 1
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma[i] = sum / period;
  }
  return sma;
};

// Calculate Exponential Moving Average
export const calculateEMA = (data, period) => {
  if (data.length < period) return [];
  const k = 2 / (period + 1);
  const ema = [data[0]]; // Start with first data point as initial EMA

  // Calculate EMA for the rest of data
  for (let i = 1; i < data.length; i++) {
    ema.push(data[i] * k + ema[i - 1] * (1 - k));
  }

  // Return only the portion matching the input data length minus initial ramp up if needed
  // But typically for alignment, we just return the full EMA array
  return ema;
};

// Calculate RSI
// Calculate RSI (Time Series)
export const calculateRSI = (prices, period = 14) => {
  if (prices.length < period + 1) return new Array(prices.length).fill(50);

  const rsi = new Array(prices.length).fill(null); // Pad start

  let gains = 0;
  let losses = 0;

  // Initial Calculation
  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) {
      gains += diff;
    } else {
      losses += Math.abs(diff);
    }
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // First RSI value at index 'period'
  // (Standard Wilder's Smoothing starts after first period)
  // We can fill index 'period' with initial calculation
  if (avgLoss === 0) rsi[period] = 100;
  else {
    let rs = avgGain / avgLoss;
    rsi[period] = 100 - (100 / (1 + rs));
  }

  // Calculate subsequent RSI values
  for (let i = period + 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];

    // Wilder's Smoothing
    if (diff >= 0) {
      avgGain = (avgGain * (period - 1) + diff) / period;
      avgLoss = (avgLoss * (period - 1) + 0) / period;
    } else {
      avgGain = (avgGain * (period - 1) + 0) / period;
      avgLoss = (avgLoss * (period - 1) + Math.abs(diff)) / period;
    }

    if (avgLoss === 0) {
      rsi[i] = 100;
    } else {
      const rs = avgGain / avgLoss;
      rsi[i] = 100 - (100 / (1 + rs));
    }
  }

  return rsi;
};

// Calculate MACD
export const calculateMACD = (prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
  if (prices.length < slowPeriod) return { macdLine: 0, signalLine: 0, histogram: 0 };

  const fastEMA = calculateEMA(prices, fastPeriod);
  const slowEMA = calculateEMA(prices, slowPeriod);

  // Align arrays: slowEMA is shorter or same length but 'lagged' in calculation start
  // Actually calculateEMA as written returns array relative to start index 0

  // Calculate MACD Line
  const macdLine = [];
  const minLength = Math.min(fastEMA.length, slowEMA.length);

  for (let i = 0; i < minLength; i++) {
    macdLine.push(fastEMA[i] - slowEMA[i]);
  }

  // Calculate Signal Line (EMA of MACD Line)
  const signalLineFull = calculateEMA(macdLine, signalPeriod);
  const signalLine = signalLineFull[signalLineFull.length - 1];
  const currentMacd = macdLine[macdLine.length - 1];

  return {
    macdLine: currentMacd,
    signalLine: signalLine,
    histogram: currentMacd - signalLine
  };
};

// Calculate Bollinger Bands
export const calculateBollingerBands = (prices, period = 20, multiplier = 2) => {
  if (prices.length < period) return null;

  const smaFull = calculateSMA(prices, period);
  const currentSMA = smaFull[smaFull.length - 1];

  // Calculate Standard Deviation associated with the last window
  const slice = prices.slice(prices.length - period);
  const mean = slice.reduce((a, b) => a + b, 0) / period;
  const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period;
  const stdDev = Math.sqrt(variance);

  return {
    upper: currentSMA + (multiplier * stdDev),
    middle: currentSMA,
    lower: currentSMA - (multiplier * stdDev)
  };
};

// Calculate Volatility (Standard Deviation of returns)
// Calculate Volatility (Standard Deviation of returns) - Time Series
export const calculateVolatility = (prices, period = 14) => {
  if (prices.length < period + 1) return new Array(prices.length).fill(0);

  const volatility = new Array(prices.length).fill(0);
  const returns = [];

  // Calculate daily returns first
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }

  // Rolling Window Standard Deviation
  for (let i = period; i < returns.length; i++) {
    const slice = returns.slice(i - period, i); // Previous 'period' returns
    const mean = slice.reduce((a, b) => a + b, 0) / period;
    const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period;

    // Map return index 'i' back to price index 'i+1'
    // returns[0] is price[1]/price[0].
    // slice ending at i means we have Returns up to i (calculated from price[i+1]).
    // Actually, align it: volatility today based on PAST returns.
    // Let's say volatility[k] uses prices up to k.

    volatility[i + 1] = Math.sqrt(variance);
  }

  return volatility;
};
