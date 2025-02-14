# Fault-Tolerant API Wrapper Exercise

## Task
Your goal is to implement a Python wrapper for an unreliable payment API. The wrapper should:
- Implement **retries** with **exponential backoff**.
- Use a **circuit breaker** to prevent excessive API calls when failures persist.
- Log **API requests, retries, and failures**.
- (Bonus) Add caching and monitoring.

## Setup
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
