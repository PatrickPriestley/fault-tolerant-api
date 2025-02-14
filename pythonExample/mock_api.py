import random
import time
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/pay', methods=['GET'])
def mock_payment_api():
    """Simulates an unreliable API with a 30% failure rate."""
    time.sleep(random.uniform(0.1, 0.5))  # Simulate network latency

    if random.random() < 0.3:  # 30% failure rate
        return jsonify({"error": "Payment API timeout!"}), 500

    return jsonify({"status": "success", "transaction_id": random.randint(1000, 9999)}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
