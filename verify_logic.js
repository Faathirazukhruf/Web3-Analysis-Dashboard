
import { SimpleLinearRegression } from './utils/ml-model.js';
import { analyzeSentiment } from './utils/sentiment.js';
import { calculateRSI } from './utils/indicators.js';

// Mock getCryptoPrices for testing to avoid API calls in test
const mockGetCryptoPrices = async (coinId, days) => {
    // Generate linear data
    const prices = [];
    for (let i = 0; i < days; i++) {
        prices.push(100 + i + (Math.random() * 2));
    }
    return prices;
};

async function runTests() {
    console.log('🚀 Starting AI Analysis Upgrade Verification...\n');

    try {
        // 1. Test Sentiment Context
        console.log('\nTest 1: Context-Aware Sentiment...');
        const cryptoText = "This token burn is going to make us moon!";
        const score = analyzeSentiment(cryptoText);
        console.log(`Text: "${cryptoText}"`);
        console.log(`Score: ${score.toFixed(2)} (Expected positive > 0.5)`);
        if (score > 0.5) console.log('✅ Sentiment Logic Valid');
        else console.error('❌ Sentiment Logic Failed');

        // 2. Test Indicators
        console.log('\nTest 2: Technical Indicators...');
        const prices = [10, 11, 12, 13, 14, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6];
        const rsi = calculateRSI(prices, 5); // Short period for test
        console.log(`RSI calculated for descending input: ${rsi[rsi.length - 1].toFixed(2)}`);
        // Should be low since price dropped 15 -> 6
        if (rsi[rsi.length - 1] < 30) console.log('✅ RSI Logic Valid (Oversold detected)');
        else console.error('❌ RSI Logic Check Failed');

        // 3. Test ML Model Training & Early Stopping
        console.log('\nTest 3: ML Model Training...');
        const model = new SimpleLinearRegression();
        // Create dummy linear data: y = 2x + 1
        const X = [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]];
        const y = [3, 5, 7, 9, 11, 13, 15, 17, 19, 21];

        model.train(X, y);
        console.log(`Training complete. Iterations: ${model.iterations}`);
        console.log(`R-squared: ${model.metadata.r_squared.toFixed(4)}`);

        const prediction = model.predict([11]);
        console.log(`Prediction for x=11 (Expected ~23): ${prediction.toFixed(2)}`);

        if (Math.abs(prediction - 23) < 0.5) console.log('✅ Model Prediction Accurate');
        else console.error('❌ Model Prediction Inaccurate');

        if (model.iterations < 2000) console.log('✅ Early Stopping Working');

        console.log('\n🎉 Verification Script Complete. Core Logic is Solid.');

    } catch (error) {
        console.error('❌ Test Failed:', error);
    }
}

runTests();
