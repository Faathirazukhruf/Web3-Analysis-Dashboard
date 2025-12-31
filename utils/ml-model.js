/**
 * Simple Linear Regression with Gradient Descent
 * & Basic Statistical Utilities
 */

export class SimpleLinearRegression {
    constructor() {
        this.weights = [];
        this.bias = 0;
        this.iterations = 0;
        this.metadata = {
            last_trained: null,
            training_size: 0,
            mse: 0,
            r_squared: 0
        };
    }

    /**
     * Train the model using Gradient Descent with Early Stopping
     * @param {number[][]} X - Features matrix
     * @param {number[]} y - Target vector
     * @param {number} learningRate 
     * @param {number} maxIterations 
     */
    train(X, y, learningRate = 0.001, maxIterations = 2000) {
        if (!X.length || !y.length || X.length !== y.length) {
            throw new Error("Invalid training data");
        }

        const n_samples = X.length;
        const n_features = X[0].length;

        // Initialize weights with small random values
        this.weights = new Array(n_features).fill(0).map(() => Math.random() * 0.01);
        this.bias = 0;

        let prevCost = Infinity;

        // Feature Scaling (Normalization) - Important for Gradient Descent
        // We'll store min/max to scale inputs during prediction
        this.featureStats = this.calculateFeatureStats(X);
        const X_scaled = this.scaleFeatures(X, this.featureStats);

        // Gradient Descent
        for (let i = 0; i < maxIterations; i++) {
            const predictions = this.predictRaw(X_scaled);
            const errors = predictions.map((pred, idx) => pred - y[idx]);

            // Calculate Cost (MSE)
            const cost = errors.reduce((sum, err) => sum + err * err, 0) / (2 * n_samples);

            // Early Stopping
            if (Math.abs(prevCost - cost) < 1e-6) {
                // console.log(`Early stopping at iteration ${i}, Cost: ${cost}`);
                this.iterations = i;
                break;
            }
            prevCost = cost;

            // Update Weights and Bias
            // d(Cost)/d(Weight) = (1/m) * sum(error * feature_value)
            for (let j = 0; j < n_features; j++) {
                let gradient = 0;
                for (let k = 0; k < n_samples; k++) {
                    gradient += errors[k] * X_scaled[k][j];
                }
                this.weights[j] -= learningRate * (gradient / n_samples);
            }

            // d(Cost)/d(Bias) = (1/m) * sum(error)
            let biasGradient = errors.reduce((a, b) => a + b, 0) / n_samples;
            this.bias -= learningRate * biasGradient;

            this.iterations = i;
        }

        // Calculate Metrics
        this.metadata.last_trained = new Date().toISOString();
        this.metadata.training_size = n_samples;
        const finalPreds = this.predictRaw(X_scaled);
        this.metadata.r_squared = this.calculateRSquared(y, finalPreds);
    }

    /**
     * Prediction for a single input/row
     * @param {number[]} features 
     */
    predict(features) {
        if (features.length !== this.weights.length) {
            throw new Error(`Feature mismatch. Expected ${this.weights.length}, got ${features.length}`);
        }

        // Normalize input
        const scaledFeatures = features.map((val, idx) => {
            const stats = this.featureStats[idx];
            if (stats.max === stats.min) return 0; // Avoid division by zero
            return (val - stats.min) / (stats.max - stats.min);
        });

        let result = this.bias;
        for (let i = 0; i < this.weights.length; i++) {
            result += this.weights[i] * scaledFeatures[i];
        }
        return result;
    }

    // Internal helper to predict batch without re-scaling checks
    predictRaw(X) {
        return X.map(row => {
            let result = this.bias;
            for (let i = 0; i < this.weights.length; i++) {
                result += this.weights[i] * row[i];
            }
            return result;
        });
    }

    calculateFeatureStats(X) {
        const n_features = X[0].length;
        const stats = [];
        for (let j = 0; j < n_features; j++) {
            const col = X.map(row => row[j]);
            const min = Math.min(...col);
            const max = Math.max(...col);
            stats.push({ min, max });
        }
        return stats;
    }

    scaleFeatures(X, stats) {
        return X.map(row => row.map((val, idx) => {
            if (stats[idx].max === stats[idx].min) return 0;
            return (val - stats[idx].min) / (stats[idx].max - stats[idx].min);
        }));
    }

    calculateRSquared(actual, predicted) {
        const mean = actual.reduce((a, b) => a + b, 0) / actual.length;
        const ssTotal = actual.reduce((a, b) => a + Math.pow(b - mean, 2), 0);
        const ssRes = actual.map((a, i) => Math.pow(a - predicted[i], 2)).reduce((a, b) => a + b, 0);
        return 1 - (ssRes / (ssTotal || 1)); // Total or 1 to avoid NaN
    }
}
