import requests
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def process_payment():
    """Calls the payment API, but lacks retries and fault tolerance (candidate must fix this)."""
    try:
        response = requests.get("http://127.0.0.1:5001/pay", timeout=2)
        response.raise_for_status()
        data = response.json()
        logging.info(f"Payment processed successfully: {data}")
        return data
    except requests.exceptions.RequestException as e:
        logging.error(f"Payment API error: {e}")
        return {"status": "failed", "error": "Payment service unavailable"}

if __name__ == "__main__":
    for _ in range(20):  # Simulate multiple requests
        print(process_payment())
