/**
 * Crypto-Specific Sentiment Analysis
 * 
 * Uses a context-aware lexicon to score sentiment.
 * Distinguishes between general English usage and Crypto slang.
 */

const CRYPTO_LEXICON = {
    // POSITIVE WORDS
    'moon': { base: 0.2, crypto: 0.9 },
    'mooning': { base: 0.2, crypto: 0.9 },
    'long': { base: 0.0, crypto: 0.3 }, // Long position
    'bull': { base: 0.1, crypto: 0.6 },
    'bullish': { base: 0.2, crypto: 0.8 },
    'pump': { base: 0.1, crypto: 0.6 },
    'wagmi': { base: 0.0, crypto: 0.8 }, // We All Gonna Make It
    'gem': { base: 0.3, crypto: 0.7 },
    'hodl': { base: 0.0, crypto: 0.6 },
    'diamond': { base: 0.3, crypto: 0.5 }, // Diamond hands
    'buy': { base: 0.1, crypto: 0.5 },
    'support': { base: 0.2, crypto: 0.4 },
    'breakout': { base: 0.1, crypto: 0.7 },
    'green': { base: 0.1, crypto: 0.3 },
    'gain': { base: 0.3, crypto: 0.6 },
    'adoption': { base: 0.2, crypto: 0.6 },
    'upgrade': { base: 0.2, crypto: 0.5 },
    'partnership': { base: 0.2, crypto: 0.6 },
    'listing': { base: 0.0, crypto: 0.5 },

    // NEGATIVE WORDS
    'rekt': { base: 0.0, crypto: -0.9 },
    'dump': { base: -0.2, crypto: -0.7 },
    'bear': { base: -0.1, crypto: -0.6 },
    'bearish': { base: -0.2, crypto: -0.8 },
    'short': { base: -0.1, crypto: -0.3 }, // Short position
    'sell': { base: -0.1, crypto: -0.4 },
    'crash': { base: -0.5, crypto: -0.9 },
    'fud': { base: 0.0, crypto: -0.5 }, // Fear Uncertainty Doubt
    'scam': { base: -0.8, crypto: -1.0 },
    'rug': { base: 0.0, crypto: -1.0 }, // Rug pull
    'rugpull': { base: 0.0, crypto: -1.0 },
    'hack': { base: -0.6, crypto: -0.9 },
    'exploit': { base: -0.5, crypto: -0.8 },
    'dip': { base: -0.2, crypto: 0.2 }, // "Buy the dip" is slightly positive nuance in crypto context usually, but dip itself is price down. Let's keep nuance.
    'correction': { base: -0.1, crypto: -0.3 },
    'resistance': { base: -0.1, crypto: -0.4 },
    'red': { base: -0.1, crypto: -0.3 },
    'loss': { base: -0.3, crypto: -0.6 },
    'ban': { base: -0.4, crypto: -0.7 },
    'regulation': { base: 0.0, crypto: -0.2 },

    // CONTEXTUAL
    'burn': { base: -0.4, crypto: 0.5 }, // Token burn is good (deflationary)
    'volatility': { base: -0.1, crypto: 0.0 }, // Expected in crypto
    'ath': { base: 0.0, crypto: 0.8 }, // All Time High
    'atl': { base: 0.0, crypto: -0.6 } // All Time Low
};

/**
 * Analyzes text sentiment with crypto context
 * @param {string} text 
 * @returns {number} Score between -1 (Very Negative) and 1 (Very Positive)
 */
export const analyzeSentiment = (text) => {
    if (!text) return 0;

    // Simple tokenization
    const tokens = text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/);

    let score = 0;
    let relevantTokens = 0;

    tokens.forEach(token => {
        if (CRYPTO_LEXICON[token]) {
            // Use crypto score by default for this app
            score += CRYPTO_LEXICON[token].crypto;
            relevantTokens++;
        }
    });

    if (relevantTokens === 0) return 0;

    // Normalize to -1 to 1 range approx
    const normalized = score / Math.max(relevantTokens, 1);

    // Clamp
    return Math.max(-1, Math.min(1, normalized));
};
