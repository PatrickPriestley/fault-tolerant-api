const axios = require("axios");

async function processPayment() {
    try {
        const response = await axios.get("http://127.0.0.1:5005/pay", { timeout: 2000 });
        return response.data;
    } catch (error) {
        console.error(`Payment API error: ${error.message}`);
        return { status: "failed", error: "Payment service unavailable" };
    }
}

(async () => {
    for (let i = 0; i < 10; i++) {
        console.log(await processPayment());
    }
})();
