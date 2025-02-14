const express = require('express');
const app = express();

app.get('/pay', (req, res) => {
    // Simulate network latency
    setTimeout(() => {
        // 40% failure rate
        if (Math.random() < 0.4) {
            return res.status(500).json({
                error: "Payment API timeout!"
            });
        }

        res.json({
            status: "success",
            transaction_id: Math.floor(Math.random() * 9000) + 1000
        });
    }, Math.random() * 400 + 100); // Random delay between 100-500ms
});

const PORT = 5005;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mock API server running on port ${PORT}`);
}); 