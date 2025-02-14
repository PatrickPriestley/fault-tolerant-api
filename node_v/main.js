const axios = require('axios');
const winston = require('winston');

// Configure logging
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} - ${level.toUpperCase()} - ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console()
    ]
});

class CircuitBreaker {
    constructor(failureThreshold = 3, resetTimeout = 10000) {
        this.failureThreshold = failureThreshold;
        this.resetTimeout = resetTimeout;
        this.failures = 0;
        this.isOpen = false;
        this.lastFailureTime = null;
    }

    async execute(fn) {
        if (this.isOpen) {
            if (Date.now() - this.lastFailureTime >= this.resetTimeout) {
                this.isOpen = false;
                this.failures = 0;
            } else {
                throw new Error('Circuit breaker is open');
            }
        }

        try {
            const result = await fn();
            this.failures = 0;
            return result;
        } catch (error) {
            this.failures++;
            this.lastFailureTime = Date.now();
            if (this.failures >= this.failureThreshold) {
                this.isOpen = true;
            }
            throw error;
        }
    }
}

function exponentialBackoff(attempt) {
    const baseDelay = 500; // 0.5 seconds in milliseconds
    const maxDelay = 5000; // 5 seconds in milliseconds
    const jitter = Math.random() * 200 + 100; // Random value between 100-300ms
    return Math.min(baseDelay * Math.pow(2, attempt) + jitter, maxDelay);
}

const circuitBreaker = new CircuitBreaker();

async function processPayment() {
    const maxRetries = 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await circuitBreaker.execute(async () => {
                const result = await axios.get('http://127.0.0.1:5002/pay', {
                    timeout: 2000
                });
                return result.data;
            });

            logger.info(`Payment processed successfully: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            logger.warn(`Payment API error: ${error.message}. Retrying... (attempt ${attempt + 1})`);
            if (attempt < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, exponentialBackoff(attempt)));
            }
        }
    }

    logger.error('All retry attempts failed. Returning fallback response.');
    return { status: 'failed', error: 'Payment service unavailable' };
}

async function main() {
    for (let i = 0; i < 10; i++) {
        try {
            const result = await processPayment();
            console.log(result);
        } catch (error) {
            console.error(error.message);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

if (require.main === module) {
    main().catch(console.error);
} 