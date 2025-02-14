import requests

def process_payment():
    """Calls the payment API but lacks retries and fault tolerance."""
    try:
        response = requests.get("http://127.0.0.1:5001/pay", timeout=2)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Payment API error: {e}")
        return {"status": "failed", "error": "Payment service unavailable"}

if __name__ == "__main__":
    for _ in range(10):  # Simulate multiple requests
        print(process_payment())
